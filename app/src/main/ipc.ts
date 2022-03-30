import { CouponDailyAvailability } from "../models/CouponDailyAvailability";
import { CouponItem } from "../models/CouponItem";
import { CouponRule } from "../models/CouponRule";
import { FindManyOptions } from "typeorm";
import { Item } from "futurepos-typed-models/dist/Item";
import connectACM from "../lib/data/connectACM";
import connectFPOS from "../lib/data/connectFPOS";
import copyRule from "../lib/acm/copyRule";
import createRule from "../lib/acm/createRule";
import deleteRule from "../lib/acm/deleteRule";
import disconnect from "../lib/data/disconnect";
import findItems from "../lib/fpos/findItems";
import findRule from "../lib/acm/findRule";
import findRules from "../lib/acm/findRules";
import getConfig from "../lib/config/getConfig";
import getStatus from "../lib/status/getStatus";
import { ipcMain } from "electron";
import saveRule from "../lib/acm/saveRule";
import writeConfig from "../lib/config/writeConfig";

enum Channels {
  copyRule = "copy-rule",
  createRule = "create-rule", //
  deleteRule = "delete-rule", //
  getConfig = "get-config", //
  getStatus = "get-status", //
  findItems = "find-items", //
  findRule = "find-rule", //
  findRules = "find-rules", //
  onConnect = "connect",
  onError = "error",
  onSave = "save-config",
  saveRule = "save-rule", //
  setConfig = "set-config", //
}

function setup() {
  ipcMain.handle(Channels.copyRule, async (_, id: string) => copyRule(id));
  ipcMain.handle(
    Channels.createRule,
    async (
      _,
      ruleObj: CouponRule,
      itemsArr: CouponItem[],
      dailyAvailabilityArr: CouponDailyAvailability[]
    ) => createRule(ruleObj, itemsArr, dailyAvailabilityArr)
  );
  ipcMain.handle(Channels.deleteRule, async (_, id: string) => deleteRule(id));
  ipcMain.handle(Channels.getConfig, async () => getConfig());
  ipcMain.handle(Channels.getStatus, async (_, name: StatusInfo["name"]) =>
    getStatus(name)
  );
  ipcMain.handle(Channels.setConfig, async (_, config: SettingsConfig) => {
    await writeConfig(config);
    await disconnect("ACM");
    await disconnect("FPOS");
    await connectACM();
    await connectFPOS();
    const decryptedConfig = await getConfig();
    return decryptedConfig;
  });
  ipcMain.handle(
    Channels.findItems,
    async (_, options: FindManyOptions<Item>) => findItems(options)
  );
  ipcMain.handle(Channels.findRule, async (_, id: string) => findRule(id));
  ipcMain.handle(
    Channels.findRules,
    async (_, options: FindManyOptions<CouponRule>) => findRules(options)
  );
  ipcMain.handle(
    Channels.saveRule,
    async (
      _,
      ruleObj: CouponRule,
      itemsArr: CouponItem[],
      dailyAvailabilityArr: CouponDailyAvailability[]
    ) => saveRule(ruleObj, itemsArr, dailyAvailabilityArr)
  );
}

export { Channels, setup };

interface RendererMethods {
  // Clear Listeners
  clearConfigSave: () => void;
  clearConnect: () => void;
  clearError: () => void;
  // Rule Methods
  copyRule: (id: string) => Promise<CouponRule>;
  createRule: (
    rule: CouponRule,
    items: CouponItem[],
    dailyAvailability: CouponDailyAvailability[]
  ) => Promise<CouponRule>;
  deleteRule: (id: string) => Promise<CouponRule>;
  findRule: (id: string) => Promise<CouponRule>;
  findRules: (options?: FindManyOptions<CouponRule>) => Promise<CouponRule[]>;
  saveRule: (
    rule: CouponRule,
    items: CouponItem[],
    dailyAvailability: CouponDailyAvailability[]
  ) => Promise<CouponRule>;
  // FPOS DB Methods
  findItems: (options?: FindManyOptions<Item>) => Promise<Item[]>;
  // Config Methods
  getConfig: () => Promise<SettingsConfig>;
  setConfig: (config: SettingsConfig) => void;
  // Status Methods
  getStatus: (name: StatusInfo["name"]) => Promise<StatusInfo>;
  // Listeners
  onConnect: (callback: (status: StatusInfo) => void) => void;
  onConfigSave: (callback: (config: SettingsConfig) => void) => void;
  onError: (callback: (error: ErrorMsg) => void) => void;
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: RendererMethods;
    };
  }
}
