import { Button, Heading, Stack, Text } from "@chakra-ui/react";

import type { CouponDailyAvailability } from "../../models/CouponDailyAvailability";
import React from "react";
import { UilEditAlt } from "@iconscout/react-unicons";
import formatTime from "../../utils/formatTime";

const AvailabilityDisplay: React.FC<{
  availability: CouponDailyAvailability[];
  onEdit: () => void;
}> = ({ availability, onEdit }) => {
  return (
    <Stack direction="column" p={4} rounded="md" bg="gray.100">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Heading size="md">Daily Schedule</Heading>
        <Button
          variant="outline"
          colorScheme="blue"
          leftIcon={<UilEditAlt />}
          size="sm"
          bg="white"
          onClick={onEdit}
        >
          Edit
        </Button>
      </Stack>
      <Stack direction="column" alignItems="stretch">
        {availability
          .filter((day) => day.isActive)
          .sort((day1, day2) => day1.dayIndex - day2.dayIndex)
          .map((day) => (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              key={day.id}
            >
              <Text>
                {
                  [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ][day.dayIndex]
                }
              </Text>
              <Text>
                {formatTime(day.startHour, day.startMinute)}
                &mdash; {formatTime(day.endHour, day.endMinute)}
              </Text>
            </Stack>
          ))}
      </Stack>
    </Stack>
  );
};

export default AvailabilityDisplay;
