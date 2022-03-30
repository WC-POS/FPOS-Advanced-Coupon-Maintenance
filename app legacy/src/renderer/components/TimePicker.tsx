import { IconButton, Select, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { UilMoon, UilSun } from '@iconscout/react-unicons';

interface TimePickerProps {
  value: {
    hour: number;
    minute: number;
  };
  onChange: (value: { hour: number; minute: number }) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 55];
  const [isPM, setIsPM] = useState(false);

  useEffect(() => {
    setIsPM(value.hour > 12);
  }, [setIsPM, value.hour]);

  return (
    <Stack direction="row" alignItems="center" w="full">
      <Stack direction="row" alignItems="center" spacing={0} w="full">
        <Select
          w="full"
          roundedRight="none"
          value={value.hour}
          onChange={(e) => {
            onChange({
              ...value,
              hour: isPM
                ? parseInt(e.target.value, 10) + 12
                : parseInt(e.target.value, 10),
            });
          }}
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </Select>
        <Select
          w="full"
          roundedLeft="none"
          value={value.minute}
          onChange={(e) => {
            onChange({ ...value, minute: parseInt(e.target.value, 10) });
          }}
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, '0')}
            </option>
          ))}
        </Select>
      </Stack>

      <IconButton
        aria-label="AM Time"
        icon={isPM ? <UilMoon /> : <UilSun />}
        colorScheme={isPM ? 'gray' : 'blue'}
        onClick={() => setIsPM(!isPM)}
      />
    </Stack>
  );
};

export default TimePicker;
