import { FormControl, FormLabel, Input, Stack, Switch } from '@chakra-ui/react';

import { CouponDailyAvailability } from 'main/models/ACM/CouponDailyAvailability';
import React from 'react';

interface ScheduleRowProps {
  value: CouponDailyAvailability;
  onChange: (value: CouponDailyAvailability) => void;
}

const ScheduleRow: React.FC<ScheduleRowProps> = ({ value, onChange }) => {
  return (
    <>
      <FormControl>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
        >
          <FormLabel>
            {
              [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ][value.dayIndex]
            }
          </FormLabel>
          <Switch
            isChecked={value.isActive}
            onChange={(e) => onChange({ ...value, isActive: e.target.checked })}
          />
        </Stack>
        <Stack direction="row" alignItems="center">
          <Input
            type="time"
            value={`${value.startHour}:${value.startMinute
              .toString()
              .padStart(2, '0')}`}
            onChange={(e) =>
              onChange({
                ...value,
                startHour: parseInt(e.target.value.split(':')[0], 10),
                startMinute: parseInt(e.target.value.split(':')[1], 10),
              })
            }
          />
          <Input
            type="time"
            value={`${value.endHour}:${value.endMinute
              .toString()
              .padStart(2, '0')}`}
            onChange={(e) =>
              onChange({
                ...value,
                endHour: parseInt(e.target.value.split(':')[0], 10),
                endMinute: parseInt(e.target.value.split(':')[1], 10),
              })
            }
          />
        </Stack>
      </FormControl>
    </>
  );
};

export default ScheduleRow;
