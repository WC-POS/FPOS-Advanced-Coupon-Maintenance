import { CouponDailyAvailability } from 'main/models/ACM/CouponDailyAvailability';
import { CouponItem } from 'main/models/ACM/CouponItem';
import { CouponRule } from 'main/models/ACM/CouponRule';
import { FindManyOptions } from 'typeorm';
import { Item } from 'main/models/FPOS/Item';

export interface ErrorMsg {
  createdAt: number;
  title: string;
  body: string;
  error: Error;
}

export enum IPCChannels {
  copyRule = 'copy-rule',
  createRule = 'create-rule',
  deleteRule = 'delete-rule',
  getConfig = 'get-config',
  getStatus = 'get-status',
  findItems = 'find-items',
  findRule = 'find-rule',
  findRules = 'find-rules',
  onConnect = 'connect',
  onError = 'error',
  onSave = 'save-config',
  saveConfig = 'save-config',
  saveRule = 'save-rule',
  setConfig = 'set-config',
}

export interface SettingsConfig {
  SQL: {
    host: string;
    user: string;
    password: string;
  };
  appDB: string;
  fposDB: string;
  encrypted?: boolean;
}

export interface StatusInfo {
  connected: boolean;
  host: string;
  database: string;
  name: 'FPOS' | 'ACM';
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        clearConfigSave: () => void;
        clearConnect: () => void;
        clearError: () => void;
        copyRule: (id: string) => Promise<CouponRule | undefined>;
        createRule: (
          ruleObj: CouponRule,
          itemsArr: CouponItem[],
          dailyAvailabilityArr: CouponDailyAvailability[]
        ) => Promise<CouponRule | undefined>;
        deleteRule: (id: string) => Promise<CouponRule | undefined>;
        findItems: (options?: FindManyOptions<Item>) => Promise<Item[]>;
        findRule: (id: string) => Promise<CouponRule | undefined>;
        findRules: (
          options?: FindManyOptions<CouponRule>
        ) => Promise<CouponRule[]>;
        getConfig: () => Promise<SettingsConfig>;
        getStatus: () => Promise<StatusInfo>;
        onConfigSave: (callback: (config: SettingsConfig) => void) => void;
        onConnect: (callback: (status: StatusInfo) => void) => void;
        onError: (callback: (error: ErrorMsg) => void) => void;
        saveRule: (
          ruleObj: CouponRule,
          itemsArr: CouponItem[],
          dailyAvailabilityArr: CouponDailyAvailability[]
        ) => Promise<CouponRule | undefined>;
        setConfig: (config: SettingsConfig) => Promise<SettingsConfig>;
      };
    };
  }
}
