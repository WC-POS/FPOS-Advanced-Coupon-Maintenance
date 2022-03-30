import { SetState, State } from 'zustand';

import { StatusInfo } from 'types';

export interface SimpleItem {
  name: string;
  description: string;
  department: string;
}

export interface FPOSState extends State {
  connected: boolean;
  host: string;
  database: string;
  items: SimpleItem[];
  reset: () => void;
  setConnected: (val: boolean) => void;
  setDatabase: (db: string) => void;
  setHost: (hostname: string) => void;
  getInfo: () => Promise<StatusInfo>;
  setInfo: (info: StatusInfo) => void;
  setItems: (items: SimpleItem[]) => void;
}

const FPOSStore = (set: SetState<FPOSState>) => ({
  connected: false,
  host: '',
  database: '',
  items: [],
  reset: () => {
    set(() => ({ connected: false, host: '', database: '', items: [] }));
  },
  setConnected: (val: boolean) => {
    set(() => ({ connected: val }));
  },
  setDatabase: (db: string) => {
    set(() => ({ database: db }));
  },
  setHost: (hostname: string) => {
    set(() => ({ host: hostname }));
  },
  getInfo: async () => {
    return window.electron.ipcRenderer.getStatus();
  },
  setInfo: (info: StatusInfo) => {
    set(() => ({
      connected: info.connected,
      host: info.host,
      database: info.database,
    }));
  },
  setItems: (itemArray: SimpleItem[]) => {
    set(() => ({ items: itemArray }));
  },
});

export default FPOSStore;
