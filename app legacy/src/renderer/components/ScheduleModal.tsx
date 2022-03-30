import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';

import { CouponDailyAvailability } from 'main/models/ACM/CouponDailyAvailability';
import React from 'react';
import ScheduleRow from './ScheduleRow';
import { UilTimes } from '@iconscout/react-unicons';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: CouponDailyAvailability[];
  onChange: (value: CouponDailyAvailability[]) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onChange,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="lg">
      <ModalOverlay />
      <ModalContent as="form">
        <ModalCloseButton />
        <ModalHeader>
          <Heading>Daily Schedule</Heading>
        </ModalHeader>
        <ModalBody>
          <Stack direction="column" spacing={2}>
            {schedule.map((day, index) => (
              <ScheduleRow
                key={day.id}
                value={day}
                onChange={(value) =>
                  onChange(
                    [
                      ...schedule.slice(0, index),
                      value,
                      ...schedule.slice(index + 1),
                    ].sort((a, b) => b.dayIndex - a.dayIndex)
                  )
                }
              />
            ))}
          </Stack>
        </ModalBody>
        <ModalFooter display="flex" alignItems="center">
          <Button leftIcon={<UilTimes />} onClick={onClose} w="full">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleModal;
