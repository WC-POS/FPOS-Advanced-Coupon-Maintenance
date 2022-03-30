import React, { useEffect } from 'react';

import { useToast } from '@chakra-ui/toast';

const ErrorToastManager: React.FC = () => {
  const toast = useToast();
  useEffect(() => {
    window.electron.ipcRenderer.clearError();
    window.electron.ipcRenderer.onError((error) => {
      toast({
        title: error.title,
        description: error.body,
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    });
  }, [toast]);

  return <></>;
};

export default ErrorToastManager;
