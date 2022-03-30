import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useACMStore, useFPOSStore } from "../store";

import SettingsModal from "./SettingsModal";
import { UilServerConnection } from "@iconscout/react-unicons";

const ConnectionStatus: React.FC = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { acmConnected, setACMInfo } = useACMStore((state) => ({
    acmConnected: state.connected,
    setACMInfo: state.setInfo,
  }));
  const { fposConnected, setFPOSInfo } = useFPOSStore((state) => ({
    fposConnected: state.connected,
    setFPOSInfo: state.setInfo,
  }));
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    window.electron.ipcRenderer.clearConnect();
    window.electron.ipcRenderer.onConnect((connectionStatus) => {
      if (connectionStatus.name === "FPOS") {
        setFPOSInfo(connectionStatus);
      } else {
        setACMInfo(connectionStatus);
      }
      setIsInitialLoad(false);
    });
    setTimeout(() => {
      setIsInitialLoad(false);
      setIsLoading(false);
    }, 1000);
  }, [setFPOSInfo, setACMInfo]);

  return (
    <>
      <Tooltip
        label={`${fposConnected ? "✓" : "×"} FPOS ${
          acmConnected ? "✓" : "×"
        } ACM`}
        placement="left"
      >
        <Button
          variant="solid"
          colorScheme={fposConnected && acmConnected ? "green" : "red"}
          isLoading={isLoading || isInitialLoad}
          onClick={onOpen}
        >
          <UilServerConnection />
        </Button>
      </Tooltip>
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ConnectionStatus;
