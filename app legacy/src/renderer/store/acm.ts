import { SetState, State } from 'zustand';

import { StatusInfo } from 'types';

export interface SimpleRule {
  id: string;
  name: string;
  isActive: boolean;
}

export interface ACMState extends State {
  connected: boolean;
  host: string;
  database: string;
  rules: SimpleRule[];
  reset: () => void;
  setConnected: (val: boolean) => void;
  setDatabase: (db: string) => void;
  setHost: (hostname: string) => void;
  getInfo: () => Promise<StatusInfo>;
  setInfo: (info: StatusInfo) => void;
  setRules: (rulesArray: SimpleRule[]) => void;
}

const ACMStore = (set: SetState<ACMState>) => ({
  connected: false,
  host: '',
  database: '',
  rules: [],
  reset: () => {
    set(() => ({ connected: false, host: '', database: '' }));
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
  setRules: (rulesArray: SimpleRule[]) => {
    set(() => ({ rules: rulesArray }));
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
});

export default ACMStore;
