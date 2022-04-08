import { Button, Heading, Stack } from "@chakra-ui/react";

import type { CouponItem } from "../../models/CouponItem";
import type { CouponRule } from "../../models/CouponRule";
import ItemRuleRow from "../ItemRuleRow";
import React from "react";
import { UilPlus } from "@iconscout/react-unicons";
import generateIDPlaceholder from "../../utils/generateIDPlaceholder";

const ItemsControl: React.FC<{
  rule: CouponRule;
  onChange: (items: CouponItem[]) => void;
}> = ({ rule, onChange }) => {
  return (
    <Stack
      direction="column"
      bg="gray.100"
      rounded="md"
      p={4}
      w={{ base: "full", md: "50%" }}
      spacing={1}
    >
      <Heading size="md">Item Rules</Heading>
      {rule.items.map((item, index) => (
        <ItemRuleRow
          key={item.id}
          couponItem={item}
          onChange={(value) =>
            onChange([
              ...rule.items.slice(0, index),
              value,
              ...rule.items.slice(index + 1),
            ])
          }
          onClone={() =>
            onChange([
              ...rule.items.slice(0, index + 1),
              { ...item, id: "NEW" },
              ...rule.items.slice(index + 1),
            ])
          }
          onDelete={() => {
            onChange([
              ...rule.items.slice(0, index),
              ...rule.items.slice(index + 1),
            ]);
          }}
        />
      ))}
      <Button
        leftIcon={<UilPlus />}
        w="full"
        colorScheme="blue"
        onClick={() =>
          onChange([
            ...rule.items,
            {
              id: generateIDPlaceholder(),
              itemName: "",
              operation: "discount-flat",
              amount: 0,
              isRequired: false,
              couponRule: rule,
            },
          ])
        }
      >
        Add
      </Button>
    </Stack>
  );
};

export default ItemsControl;
