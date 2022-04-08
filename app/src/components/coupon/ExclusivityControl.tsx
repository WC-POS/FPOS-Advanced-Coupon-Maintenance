import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

import React from "react";

const ExclusivityControl: React.FC<{
  value: boolean;
  onChange: (isExclusive: boolean) => void;
}> = ({ value, onChange }) => {
  return (
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
      <Switch isChecked={value} onChange={(e) => onChange(e.target.checked)} />
    </FormControl>
  );
};

export default ExclusivityControl;
