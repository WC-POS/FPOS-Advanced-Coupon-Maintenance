import {
  Checkbox,
  IconButton,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
} from "@chakra-ui/react";
import {
  UilCopy,
  UilDollarSign,
  UilEllipsisV,
  UilExchangeAlt,
  UilMinus,
  UilPercentage,
  UilPlus,
  UilTrashAlt,
} from "@iconscout/react-unicons";

import { CouponItem } from "../models/CouponItem";
import React from "react";
import { useFPOSStore } from "../store";

interface ItemRuleRowProps {
  couponItem: CouponItem;
  onChange: (value: CouponItem) => void;
  onClone: () => void;
  onDelete: () => void;
}

const OperationIcon: React.FC<{ operation: string }> = ({ operation }) => {
  if (operation === "discount-flat") {
    return <UilMinus />;
  }
  if (operation === "discount-percent") {
    return <UilPercentage />;
  }
  if (operation === "price-change") {
    return <UilExchangeAlt />;
  }
  return <UilPlus />;
};

const ItemRuleRow: React.FC<ItemRuleRowProps> = ({
  couponItem,
  onChange,
  onClone,
  onDelete,
}) => {
  const { items } = useFPOSStore((state) => ({ items: state.items }));

  return (
    <Stack direction="row" w="full" p={1} rounded="md" alignItems="center">
      <Checkbox
        size="lg"
        bg="white"
        isChecked={couponItem.isRequired}
        onChange={(e) =>
          onChange({ ...couponItem, isRequired: e.target.checked })
        }
      />
      <Select
        bg="white"
        value={couponItem.itemName}
        onChange={(e) => onChange({ ...couponItem, itemName: e.target.value })}
      >
        {items.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </Select>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Operation Option"
          icon={<OperationIcon operation={couponItem.operation} />}
          w="auto"
          variant="filled"
          bg="white"
        />
        <MenuList zIndex={10} defaultValue="discount-flat">
          <MenuOptionGroup
            title="Price Operation"
            type="radio"
            value={couponItem.operation}
            onChange={(value) =>
              onChange({ ...couponItem, operation: value.toString() })
            }
          >
            <MenuItemOption value="discount-flat" icon={<UilMinus />}>
              Discount (Flat)
            </MenuItemOption>
            <MenuItemOption value="discount-percent" icon={<UilPercentage />}>
              Discount (Percent)
            </MenuItemOption>
            <MenuItemOption value="price-change" icon={<UilExchangeAlt />}>
              Price Change
            </MenuItemOption>
            <MenuItemOption value="price-increase" icon={<UilPlus />}>
              Price Increase
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
      <InputGroup>
        <InputLeftElement color="gray.400">
          {couponItem.operation === "discount-percent" ? (
            <UilPercentage />
          ) : (
            <UilDollarSign />
          )}
        </InputLeftElement>
        <NumberInput
          min={0}
          max={100}
          precision={2}
          step={0.5}
          value={couponItem.amount}
          onChange={(_, value) =>
            onChange({ ...couponItem, amount: value || 0.0 })
          }
        >
          <NumberInputField bg="white" pl={8} textAlign="right" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<UilEllipsisV />}
          aria-label="Rule Options"
          color="gray.400"
        />
        <MenuList zIndex={10}>
          <MenuItem icon={<UilCopy />} onClick={onClone}>
            Clone
          </MenuItem>
          <MenuItem icon={<UilTrashAlt />} onClick={onDelete}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Stack>
  );
};

export default ItemRuleRow;
