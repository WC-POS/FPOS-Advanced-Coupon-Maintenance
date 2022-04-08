import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Tooltip,
} from "@chakra-ui/react";

import React from "react";
import { UilInfoCircle } from "@iconscout/react-unicons";

const ReceiptControl: React.FC<{
  name: string;
  onChange: (name: string) => void;
}> = ({ name, onChange }) => {
  return (
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
        value={name}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
};

export default ReceiptControl;
