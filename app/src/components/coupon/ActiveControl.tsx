import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

import React from "react";

const ActiveControl: React.FC<{
  value: boolean;
  onChange: (isActive: boolean) => void;
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
      <FormLabel m={0}>Active</FormLabel>
      <Switch isChecked={value} onChange={(e) => onChange(e.target.checked)} />
    </FormControl>
  );
};

export default ActiveControl;
