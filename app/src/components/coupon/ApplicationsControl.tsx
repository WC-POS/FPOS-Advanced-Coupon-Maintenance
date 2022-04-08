import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

import React from "react";
import { UilReceiptAlt } from "@iconscout/react-unicons";

const ApplicationsControl: React.FC = () => {
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
  );
};

export default ApplicationsControl;
