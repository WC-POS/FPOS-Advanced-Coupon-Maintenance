import { Heading, IconButton, Link, Stack } from '@chakra-ui/react';
import { UilInfoCircle, UilReceipt } from '@iconscout/react-unicons';

import ConnectionStatus from './ConnectionStatus';
import React from 'react';

const Navigation: React.FC = () => {
  return (
    <Stack
      direction="row"
      spacing={4}
      p={4}
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top={0}
      left={0}
      right={0}
      bg="white"
      zIndex={10}
      borderBottomColor="blue.200"
      borderBottomWidth={1}
    >
      <Stack spacing={1}>
        <Heading size="lg">Advanced Coupon Maintenance</Heading>
        <Heading size="sm" color="blue.400">
          Made for{' '}
          <Link href="https://web.futurepos.com/" target="_blank">
            FuturePOS
          </Link>{' '}
          6.0.7+
        </Heading>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Link
          aria-label="open help"
          href="http://help.cessecure.com/6030/#visual_toc.htm%3FTocPath%3D_____1"
          target="_blank"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={1}
          rounded="md"
        >
          <UilInfoCircle />
        </Link>
        <IconButton icon={<UilReceipt />} aria-label="Sale List" />
        <ConnectionStatus />
      </Stack>
    </Stack>
  );
};

export default Navigation;
