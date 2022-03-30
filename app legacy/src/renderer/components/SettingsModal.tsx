import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  UilEye,
  UilEyeSlash,
  UilSave,
  UilTimes,
} from '@iconscout/react-unicons';

import { SettingsConfig } from 'types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<SettingsConfig>({
    SQL: {
      host: '',
      user: '',
      password: '',
    },
    fposDB: '',
    appDB: '',
    encrypted: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const onSave = async () => {
    try {
      await window.electron.ipcRenderer.setConfig(config);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.electron.ipcRenderer
        .getConfig()
        .then((configObj) => {
          setConfig(configObj);
          setIsLoading(false);
          return null;
        })
        .catch((err) => err);
    } else {
      setIsLoading(true);
      setShowPassword(false);
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={onSave}>
        <ModalCloseButton />
        <ModalHeader>
          <Stack direction="row" spacing={4} alignItems="center">
            <Heading>Settings</Heading>
            {isLoading && <Spinner color="blue.500" />}
          </Stack>
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormControl>
              <FormLabel>SQL Host</FormLabel>
              <Input
                variant="filled"
                value={config.SQL.host}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    SQL: { ...config.SQL, host: e.target.value },
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>SQL User</FormLabel>
              <Input
                variant="filled"
                value={config.SQL.user}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    SQL: { ...config.SQL, user: e.target.value },
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>SQL Password</FormLabel>
              <Stack direction="row">
                <Input
                  variant="filled"
                  value={config.SQL.password}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      SQL: { ...config.SQL, password: e.target.value },
                    })
                  }
                  type={showPassword ? 'text' : 'password'}
                />
                <IconButton
                  aria-label="Show SQL password"
                  icon={showPassword ? <UilEyeSlash /> : <UilEye />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel>FPOS DB</FormLabel>
              <Input
                variant="filled"
                value={config.fposDB}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    fposDB: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>App DB</FormLabel>
              <Input
                variant="filled"
                value={config.appDB}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    appDB: e.target.value,
                  })
                }
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" spacing={4} w="full">
            <Button variant="ghost" leftIcon={<UilTimes />} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="solid"
              leftIcon={<UilSave />}
              w="full"
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              onClick={onSave}
            >
              Save
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
