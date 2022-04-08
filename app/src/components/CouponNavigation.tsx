import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  Stack,
} from "@chakra-ui/react";
import {
  UilBars,
  UilCopy,
  UilHistoryAlt,
  UilPlus,
  UilPlusCircle,
  UilSave,
  UilTrashAlt,
} from "@iconscout/react-unicons";

import React from "react";
import { SimpleRule } from "../store/acm";

const CouponNavigation: React.FC<{
  current: string;
  isSaving: boolean;
  activeRules: SimpleRule[];
  inactiveRules: SimpleRule[];
  onChange: (id: string) => void;
  onCopy: () => void;
  onDelete: () => void;
  onNew: () => void;
  onSave: () => void;
}> = ({
  current,
  isSaving,
  activeRules,
  inactiveRules,
  onChange,
  onCopy,
  onDelete,
  onNew,
  onSave,
}) => {
  return (
    <Stack direction="row" pb={2} alignItems="center">
      <IconButton
        aria-label="Create new coupon rule"
        icon={<UilPlusCircle />}
        colorScheme="blue"
        isLoading={isSaving}
        onClick={onNew}
      />
      <Select
        variant="filled"
        value={current}
        onChange={(e) => onChange(e.target.value)}
        isDisabled={isSaving}
      >
        <option value="NEW">New Coupon</option>
        <optgroup label="Active Rules">
          {activeRules.map((rule) => (
            <option value={rule.id} key={rule.id}>
              {rule.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Inactive Rules">
          {inactiveRules.map((rule) => (
            <option value={rule.id} key={rule.id}>
              {rule.name}
            </option>
          ))}
        </optgroup>
      </Select>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<UilBars />}
          isDisabled={isSaving}
        />
        <MenuList zIndex={10}>
          <MenuItem icon={<UilPlus />} onClick={onNew}>
            New
          </MenuItem>
          <MenuItem icon={<UilSave />}>Save</MenuItem>
          <MenuItem icon={<UilHistoryAlt />}>Reset</MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<UilCopy />}
            onClick={onCopy}
            isDisabled={current === "NEW"}
          >
            Clone
          </MenuItem>
          <MenuItem
            icon={<UilTrashAlt />}
            onClick={onDelete}
            isDisabled={current === "NEW"}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
      <Button
        leftIcon={<UilSave />}
        colorScheme="blue"
        onClick={onSave}
        isLoading={isSaving}
      >
        Save
      </Button>
    </Stack>
  );
};

export default CouponNavigation;
