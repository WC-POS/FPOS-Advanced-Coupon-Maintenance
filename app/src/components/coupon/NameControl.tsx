import { FormControl, FormLabel, Input } from "@chakra-ui/react";

import React from "react";

const NameControl: React.FC<{
  value: string;
  onChange: (name: string) => void;
}> = ({ value, onChange }) => {
  return (
    <FormControl isRequired>
      <FormLabel>Name</FormLabel>
      <Input
        variant="filled"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
};

export default NameControl;
