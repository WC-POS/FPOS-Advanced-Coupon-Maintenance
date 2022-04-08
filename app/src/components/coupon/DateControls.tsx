import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";

import React from "react";
import { UilCalendarAlt } from "@iconscout/react-unicons";

const DateControls: React.FC<{
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}> = ({ start, end, onChange }) => {
  return (
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
            value={start.split("T")[0]}
            onChange={(e) => onChange(e.target.value, end)}
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
            value={end.split("T")[0]}
            onChange={(e) => onChange(start, e.target.value)}
          />
        </InputGroup>
      </FormControl>
    </Stack>
  );
};

export default DateControls;
