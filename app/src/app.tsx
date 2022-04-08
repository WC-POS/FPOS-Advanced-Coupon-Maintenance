import {
  Box,
  ChakraProvider,
  FormControl,
  FormLabel,
  Stack,
  Textarea,
  extendTheme,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useACMStore, useFPOSStore } from "./store";

import ActiveControl from "./components/coupon/ActiveControl";
import ApplicationsControl from "./components/coupon/ApplicationsControl";
import AvailabilityDisplay from "./components/coupon/AvailabilityDisplay";
import { CouponDailyAvailability } from "./models/CouponDailyAvailability";
import CouponNavigation from "./components/CouponNavigation";
import { CouponRule } from "./models/CouponRule";
import DateControls from "./components/coupon/DateControls";
import DeleteDialog from "./components/DeleteDialog";
import ErrorToastManager from "./components/ErrorToastManager";
import ExclusivityControl from "./components/coupon/ExclusivityControl";
import ItemsControl from "./components/coupon/ItemsControl";
import NameControl from "./components/coupon/NameControl";
import Navigation from "./components/Navigation";
import ReactDOM from "react-dom";
import ReceiptControl from "./components/coupon/ReceiptControl";
import ScheduleModal from "./components/ScheduleModal";
import { SimpleRule } from "./store/acm";
import blankCouponRule from "./utils/blankCouponRule.contast";
import generateIDPlaceholder from "./utils/generateIDPlaceholder";
import reduceItems from "./utils/reduceItems";

const Hello = () => {
  const [couponRule, setCouponRule] = useState<CouponRule>({
    id: generateIDPlaceholder(),
    ...blankCouponRule,
  });
  const [activeRules, setActiveRules] = useState<SimpleRule[]>([]);
  const [inactiveRules, setInactiveRules] = useState<SimpleRule[]>([]);
  const [currentRule, setCurrentRule] = useState("NEW");

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [isSavingRule, setIsSavingRule] = useState(false);

  const { acmConnected } = useACMStore((state) => ({
    acmConnected: state.connected,
  }));
  const { fposConnected, setItems } = useFPOSStore((state) => ({
    fposConnected: state.connected,
    setItems: state.setItems,
  }));

  const toast = useToast();

  const generateBlankSchedule: () => CouponDailyAvailability[] = () => {
    return [...new Array(7).keys()].map((val) => ({
      id: generateIDPlaceholder(),
      isActive: false,
      dayIndex: val,
      startHour: 11,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
      couponRule,
    }));
  };

  const getRules = async () => {
    if (acmConnected) {
      const rules = await window.electron.ipcRenderer.findRules();
      setActiveRules(rules.filter((rule) => rule.isActive));
      setInactiveRules(rules.filter((rule) => !rule.isActive));
    } else {
      setActiveRules([]);
      setInactiveRules([]);
    }
  };

  const copyRule = async () => {
    if (currentRule !== "NEW") {
      const newRule = await window.electron.ipcRenderer.copyRule(currentRule);
      if (newRule) {
        toast({
          title: `Rule ${newRule.name} has been cloned.`,
          description: "The selected rule has been cloned.",
          duration: 10000,
          isClosable: true,
          status: "info",
        });
        setCurrentRule(newRule.id);
        await getRules();
      } else {
        toast({
          title: `Rule ${couponRule.name} could not be cloned.`,
          description:
            "The selected rule could not be cloned. If the problem persists, please contact Priority1 POS support.",
          duration: 10000,
          isClosable: true,
          status: "error",
        });
      }
    }
  };

  const deleteRule = async () => {
    if (currentRule !== "NEW") {
      const oldRule = await window.electron.ipcRenderer.deleteRule(currentRule);
      if (oldRule) {
        toast({
          title: `Rule ${oldRule.name} has been deleted.`,
          description: "The selected rule has been deleted and removed.",
          duration: 10000,
          isClosable: true,
          status: "info",
        });
        getRules();
        setCurrentRule("NEW");
        onDeleteClose();
      } else {
        toast({
          title: "Rule could not be deleted",
          description:
            "The selected rule could not be deleted. If this issues continues, please contact Priority1 POS Support at support@priority1pos.com",
          duration: 10000,
          isClosable: true,
          status: "error",
        });
      }
    }
  };

  const saveRule = async () => {
    if (
      couponRule.name &&
      couponRule.startDate &&
      couponRule.endDate &&
      couponRule.items.filter((item) => item.isRequired).length
    ) {
      setIsSavingRule(true);
      if (couponRule.id.includes("NEW-")) {
        await window.electron.ipcRenderer.createRule(
          couponRule,
          couponRule.items,
          couponRule.dailyAvailability
        );
        await getRules();
      } else {
        await window.electron.ipcRenderer.saveRule(
          couponRule,
          couponRule.items,
          couponRule.dailyAvailability
        );
        await getRules();
      }
      setIsSavingRule(false);
    } else {
      toast({
        title: "Missing Fields",
        description:
          "Please fill the name, start date, and end date fields. One required coupon item is also required/needed.",
        status: "warning",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (currentRule === "NEW") {
      setCouponRule({ id: generateIDPlaceholder(), ...blankCouponRule });
    } else {
      window.electron.ipcRenderer
        .findRule(currentRule)
        .then((rule) => {
          if (rule) {
            setCouponRule(rule);
          }
          return null;
        })
        .catch((err) => err);
    }
  }, [currentRule]);

  useEffect(() => {
    if (couponRule.id.includes("NEW-")) {
      setCouponRule({
        ...couponRule,
        dailyAvailability: generateBlankSchedule(),
      });
    }
  }, [couponRule.id]);

  useEffect(() => {
    if (fposConnected) {
      window.electron.ipcRenderer
        .findItems({
          where: {
            isModifier: false,
            isModifierGroup: false,
          },
          order: {
            department: "ASC",
            itemName: "ASC",
          },
        })
        .then((items) => {
          setItems(reduceItems(items));
          return null;
        })
        .catch((err) => err);
    }
  }, [fposConnected, setItems]);

  useEffect(() => {
    getRules()
      .then(() => null)
      .catch((err) => err);
  }, [acmConnected]);

  return (
    <>
      <ErrorToastManager />
      <ScheduleModal
        isOpen={isOpen}
        onClose={onClose}
        schedule={couponRule.dailyAvailability.sort(
          (day1, day2) => day1.dayIndex - day2.dayIndex
        )}
        onChange={(value) =>
          setCouponRule({ ...couponRule, dailyAvailability: value })
        }
      />
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={deleteRule}
      />
      <Box display="flex" flexDirection="column" h="100vh" position="relative">
        <Navigation />
        <Box
          flexGrow={1}
          px={4}
          py={4}
          h="full"
          display="flex"
          flexDirection="column"
        >
          <CouponNavigation
            current={currentRule}
            isSaving={isSavingRule}
            activeRules={activeRules}
            inactiveRules={inactiveRules}
            onChange={(id) => setCurrentRule(id)}
            onCopy={copyRule}
            onDelete={deleteRule}
            onNew={() => setCurrentRule("NEW")}
            onSave={saveRule}
          />
          <Stack direction={{ base: "column", md: "row" }} h="full" px={1}>
            <Stack w={{ base: "full", md: "50%" }}>
              <ActiveControl
                value={couponRule.isActive}
                onChange={(isActive) =>
                  setCouponRule({ ...couponRule, isActive })
                }
              />
              <NameControl
                value={couponRule.name}
                onChange={(name) => setCouponRule({ ...couponRule, name })}
              />
              <ReceiptControl
                name={couponRule.receiptName}
                onChange={(receiptName) =>
                  setCouponRule({ ...couponRule, receiptName })
                }
              />
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea variant="filled" />
              </FormControl>
              <DateControls
                start={couponRule.startDate}
                end={couponRule.endDate}
                onChange={(startDate, endDate) =>
                  setCouponRule({ ...couponRule, startDate, endDate })
                }
              />
              <AvailabilityDisplay
                availability={couponRule.dailyAvailability}
                onEdit={onOpen}
              />
              <ApplicationsControl />
              <ExclusivityControl
                value={couponRule.isDiscountExclusive}
                onChange={(isDiscountExclusive) =>
                  setCouponRule({ ...couponRule, isDiscountExclusive })
                }
              />
            </Stack>
            <ItemsControl
              rule={couponRule}
              onChange={(items) => setCouponRule({ ...couponRule, items })}
            />
          </Stack>
        </Box>
      </Box>
    </>
  );
};

function render() {
  const theme = extendTheme({
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
  });

  ReactDOM.render(
    <ChakraProvider theme={theme}>
      <Hello />
    </ChakraProvider>,
    document.querySelector("#root")
  );
}

render();
