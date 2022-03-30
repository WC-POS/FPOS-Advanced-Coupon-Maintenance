import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Switch as CSwitch,
  ChakraProvider,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
  extendTheme,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  UilBars,
  UilCalendarAlt,
  UilCopy,
  UilEditAlt,
  UilHistoryAlt,
  UilInfoCircle,
  UilPlus,
  UilPlusCircle,
  UilReceiptAlt,
  UilSave,
  UilTrashAlt,
} from "@iconscout/react-unicons";
import { format, parseISO } from "date-fns";
import { useACMStore, useFPOSStore } from "./store";

import { CouponDailyAvailability } from "./models/CouponDailyAvailability";
import { CouponItem } from "./models/CouponItem";
import { CouponRule } from "./models/CouponRule";
import ErrorToastManager from "./components/ErrorToastManager";
import ItemRuleRow from "./components/ItemRuleRow";
import Navigation from "./components/Navigation";
import ReactDOM from "react-dom";
import ScheduleModal from "./components/ScheduleModal";
import { SimpleRule } from "./store/acm";

export interface ScheduleDay {
  active: boolean;
  start: number;
  end: number;
}

export interface ScheduleSet {
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
}

const blankCouponRule = {
  name: "",
  receiptName: "",
  isActive: true,
  isDiscountExclusive: false,
  maxApplications: -1,
  notes: "",
  startDate: new Date(),
  endDate: new Date(),
  dailyAvailability: [] as CouponDailyAvailability[],
  items: [] as CouponItem[],
};

const Hello = () => {
  const generateNewIDPlaceholder = () => {
    return `NEW-${(Math.random() * 1000).toString()}`;
  };

  const [couponRule, setCouponRule] = useState<CouponRule>({
    id: generateNewIDPlaceholder(),
    ...blankCouponRule,
  });
  const [activeRules, setActiveRules] = useState<SimpleRule[]>([]);
  const [inactiveRules, setInactiveRules] = useState<SimpleRule[]>([]);
  const [currentRule, setCurrentRule] = useState("NEW");

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure();
  const [isSavingRule, setIsSavingRule] = useState(false);

  const cancelRef = useRef(null);

  const { acmConnected, setRules } = useACMStore((state) => ({
    acmConnected: state.connected,
    setRules: state.setRules,
  }));
  const { fposConnected, setItems } = useFPOSStore((state) => ({
    fposConnected: state.connected,
    setItems: state.setItems,
  }));

  const toast = useToast();

  const generateBlankSchedule: () => CouponDailyAvailability[] = () => {
    return [...new Array(7).keys()].map((val) => ({
      id: generateNewIDPlaceholder(),
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
      setCouponRule({ id: generateNewIDPlaceholder(), ...blankCouponRule });
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
        .findItems()
        .then((items) => {
          setItems(
            items
              .filter((item) => !item.isModifier && !item.isModifierGroup)
              .map((item) => ({
                name: item.itemName,
                description: item.itemDescription,
                department: item.department,
              }))
          );
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
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Coupon
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteRule} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
          <Stack direction="row" pb={2} alignItems="center">
            <IconButton
              aria-label="Create new coupon rule"
              icon={<UilPlusCircle />}
              colorScheme="blue"
              isLoading={isSavingRule}
              onClick={() => setCurrentRule("NEW")}
            />
            <Select
              variant="filled"
              value={currentRule}
              onChange={(e) => setCurrentRule(e.target.value)}
              isDisabled={isSavingRule}
            >
              <option value="NEW">New Coupon</option>
              <optgroup label="Active Rules">
                {activeRules.map((rule) => (
                  <option value={rule.id}>{rule.name}</option>
                ))}
              </optgroup>
              <optgroup label="Inactive Rules">
                {inactiveRules.map((rule) => (
                  <option value={rule.id}>{rule.name}</option>
                ))}
              </optgroup>
            </Select>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<UilBars />}
                isDisabled={isSavingRule}
              />
              <MenuList zIndex={10}>
                <MenuItem
                  icon={<UilPlus />}
                  onClick={() => setCurrentRule("NEW")}
                >
                  New
                </MenuItem>
                <MenuItem icon={<UilSave />}>Save</MenuItem>
                <MenuItem icon={<UilHistoryAlt />}>Reset</MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<UilCopy />}
                  onClick={() => copyRule()}
                  isDisabled={currentRule === "NEW"}
                >
                  Clone
                </MenuItem>
                <MenuItem
                  icon={<UilTrashAlt />}
                  onClick={() => onDeleteOpen()}
                  isDisabled={currentRule === "NEW"}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              leftIcon={<UilSave />}
              colorScheme="blue"
              onClick={saveRule}
              isLoading={isSavingRule}
            >
              Save
            </Button>
          </Stack>
          <Stack direction={{ base: "column", md: "row" }} h="full" px={1}>
            <Stack w={{ base: "full", md: "50%" }}>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="full"
                p={2}
                bg="gray.100"
                rounded="md"
              >
                <FormLabel m={0}>Active</FormLabel>
                <CSwitch
                  isChecked={couponRule.isActive}
                  onChange={(e) =>
                    setCouponRule({ ...couponRule, isActive: e.target.checked })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  variant="filled"
                  value={couponRule.name}
                  onChange={(e) =>
                    setCouponRule({
                      ...couponRule,
                      name: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <FormLabel m={0}>Receipt Description</FormLabel>
                  <Tooltip label="Max: 12 Characters">
                    <IconButton
                      aria-label="Max character tooltip"
                      icon={<UilInfoCircle size={16} />}
                      variant="ghost"
                      size="xs"
                      tabIndex={-1}
                    />
                  </Tooltip>
                </Stack>
                <Input
                  variant="filled"
                  maxLength={12}
                  value={couponRule.receiptName}
                  onChange={(e) =>
                    setCouponRule({
                      ...couponRule,
                      receiptName: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea variant="filled" />
              </FormControl>
              <Stack direction="row">
                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.500">
                      <UilCalendarAlt />
                    </InputLeftElement>
                    <Input
                      variant="filled"
                      type="date"
                      value={format(new Date(couponRule.startDate), "y-MM-dd")}
                      onChange={(e) =>
                        setCouponRule({
                          ...couponRule,
                          startDate: parseISO(e.target.value),
                        })
                      }
                    />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.500">
                      <UilCalendarAlt />
                    </InputLeftElement>
                    <Input
                      variant="filled"
                      type="date"
                      value={format(new Date(couponRule.endDate), "y-MM-dd")}
                      onChange={(e) =>
                        setCouponRule({
                          ...couponRule,
                          endDate: parseISO(e.target.value),
                        })
                      }
                    />
                  </InputGroup>
                </FormControl>
              </Stack>
              <Stack direction="column" p={4} rounded="md" bg="gray.100">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Heading size="md">Daily Schedule</Heading>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<UilEditAlt />}
                    size="sm"
                    bg="white"
                    onClick={onOpen}
                  >
                    Edit
                  </Button>
                </Stack>
                <Stack direction="column" alignItems="stretch">
                  {couponRule.dailyAvailability
                    .filter((day) => day.isActive)
                    .sort((day1, day2) => day1.dayIndex - day2.dayIndex)
                    .map((day) => (
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        key={day.id}
                      >
                        <Text>
                          {
                            [
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ][day.dayIndex]
                          }
                        </Text>
                        <Text>
                          {day.startHour < 12
                            ? day.startHour
                            : day.startHour - 12}
                          :{day.startMinute.toString().padStart(2, "0")}{" "}
                          {day.startHour < 12 ? "AM " : "PM "}
                          &mdash;{" "}
                          {day.endHour < 12 ? day.endHour : day.endHour - 12}:
                          {day.endMinute.toString().padStart(2, "0")}{" "}
                          {day.endHour < 12 ? "AM " : "PM "}
                        </Text>
                      </Stack>
                    ))}
                </Stack>
              </Stack>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="full"
                p={2}
                bg="gray.100"
                rounded="md"
              >
                <FormLabel m={0} w="full">
                  Max Applications
                </FormLabel>
                <InputGroup w="auto">
                  <InputLeftElement color="gray.400">
                    <UilReceiptAlt />
                  </InputLeftElement>
                  <NumberInput
                    min={-1}
                    max={100}
                    precision={0}
                    step={1}
                    defaultValue={-1}
                  >
                    <NumberInputField bg="white" pl={8} textAlign="right" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
              </FormControl>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="full"
                p={2}
                bg="gray.100"
                rounded="md"
              >
                <FormLabel m={0}>Prevent Additional Discounts</FormLabel>
                <CSwitch
                  isChecked={couponRule.isDiscountExclusive}
                  onChange={(e) =>
                    setCouponRule({
                      ...couponRule,
                      isDiscountExclusive: e.target.checked,
                    })
                  }
                />
              </FormControl>
            </Stack>
            <Stack
              direction="column"
              bg="gray.100"
              rounded="md"
              p={4}
              w={{ base: "full", md: "50%" }}
              spacing={1}
            >
              <Heading size="md">Item Rules</Heading>
              {couponRule.items.map((item, index) => (
                <ItemRuleRow
                  key={item.id}
                  couponItem={item}
                  onChange={(value) =>
                    setCouponRule({
                      ...couponRule,
                      items: [
                        ...couponRule.items.slice(0, index),
                        value,
                        ...couponRule.items.slice(index + 1),
                      ],
                    })
                  }
                  onClone={() =>
                    setCouponRule({
                      ...couponRule,
                      items: [
                        ...couponRule.items.slice(0, index + 1),
                        { ...item, id: "NEW" },
                        ...couponRule.items.slice(index + 1),
                      ],
                    })
                  }
                  onDelete={() => {
                    setCouponRule({
                      ...couponRule,
                      items: [
                        ...couponRule.items.slice(0, index),
                        ...couponRule.items.slice(index + 1),
                      ],
                    });
                  }}
                />
              ))}
              <Button
                leftIcon={<UilPlus />}
                w="full"
                colorScheme="blue"
                onClick={() =>
                  setCouponRule({
                    ...couponRule,
                    items: [
                      ...couponRule.items,
                      {
                        id: generateNewIDPlaceholder(),
                        itemName: "",
                        operation: "discount-flat",
                        amount: 0,
                        isRequired: false,
                        couponRule,
                      },
                    ],
                  })
                }
              >
                Add
              </Button>
            </Stack>
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
