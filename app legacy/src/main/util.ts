import { BrowserWindow, app } from 'electron';
import { ErrorMsg, SettingsConfig, StatusInfo } from '../types';
import { FindManyOptions, createConnection, getConnection } from 'typeorm';

import { CouponDailyAvailability } from './models/ACM/CouponDailyAvailability';
import { CouponItem } from './models/ACM/CouponItem';
import { CouponRule } from './models/ACM/CouponRule';
import CryptoJS from 'crypto-js';
import { Item } from './models/FPOS/Item';
import { URL } from 'url';
import fs from 'fs';
import getMAC from 'getmac';
import { getUnixTime } from 'date-fns';
import { log } from 'electron-log';
import path from 'path';
import regedit from 'regedit';
import { v4 } from 'uuid';

// eslint-disable-next-line import/no-mutable-exports
export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

// Renderer Communication Functions
export function buildError(
  title: string,
  body: string,
  error: Error
): ErrorMsg {
  return {
    createdAt: getUnixTime(new Date()),
    title,
    body,
    error,
  };
}

export function sendConnect(status: StatusInfo) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send('connect', status);
  }
}

export function sendSaveConfig(config: SettingsConfig) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send('save-config', config);
  }
}

export function sendError(error: ErrorMsg) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send('error', error);
  }
}

// Config Functions
export const defaultConfig: SettingsConfig = {
  SQL: {
    host: '',
    user: '',
    password: '',
  },
  appDB: '',
  fposDB: '',
  encrypted: false,
};

export const decryptConfig: (config: SettingsConfig) => SettingsConfig = (
  config: SettingsConfig
) => {
  if (!config.encrypted) return config;
  return {
    ...config,
    SQL: {
      ...config.SQL,
      password: CryptoJS.AES.decrypt(config.SQL.password, getMAC()).toString(
        CryptoJS.enc.Utf8
      ),
    },
    encrypted: false,
  };
};

export const encryptConfig: (config: SettingsConfig) => SettingsConfig = (
  config: SettingsConfig
) => {
  if (config.encrypted) return config;
  return {
    ...config,
    SQL: {
      ...config.SQL,
      password: CryptoJS.AES.encrypt(config.SQL.password, getMAC()).toString(),
    },
    encrypted: true,
  };
};

export const writeConfig = async (config: SettingsConfig) => {
  const filepath = path.join(app.getPath('userData'), 'config.json');
  const encryptedConfig = encryptConfig(config);
  delete encryptedConfig.encrypted;
  await fs.promises.writeFile(
    filepath,
    JSON.stringify(encryptedConfig, null, 4)
  );
  if (process.platform === 'win32') {
    await regedit.promisified.putValue({
      'HKCU\\SOFTWARE\\ACM': {
        ConfigPath: {
          value: path.resolve(__dirname, 'config.json'),
          type: 'REG_SZ',
        },
      },
    });
  } else if (process.platform === 'darwin') {
    await fs.promises.writeFile(
      path.resolve('..', 'service', 'config.json'),
      JSON.stringify(encryptedConfig, null, 4)
    );
  }
  sendSaveConfig(decryptConfig(config));
};

export const getConfig = async () => {
  const filepath = path.join(app.getPath('userData'), 'config.json');
  try {
    const config = {
      ...JSON.parse(await (await fs.promises.readFile(filepath)).toString()),
      encrypted: true,
    };
    return decryptConfig(config);
  } catch (err) {
    await writeConfig({ ...defaultConfig });
    return { ...defaultConfig };
  }
};

// SQL Connection Functions
export const disconnect = async (name: 'FPOS' | 'ACM') => {
  try {
    const connection = getConnection(name);
    if (connection.isConnected) {
      await getConnection(name).close();
      sendConnect({
        connected: false,
        name,
        database: connection.options.database as string,
        host: '',
      });
    }
  } catch (err) {
    log(err);
  }
};

export const connect = async (config: SettingsConfig, name: 'FPOS' | 'ACM') => {
  try {
    await disconnect(name);
    const decryptedConfig = decryptConfig(config);
    const entityDirRule = path
      .join(__dirname, 'models', name, '*.ts')
      .toString();
    const connection = await createConnection({
      name,
      type: 'mssql',
      host: decryptedConfig.SQL.host,
      username: decryptedConfig.SQL.user,
      password: decryptedConfig.SQL.password,
      database: name === 'ACM' ? decryptedConfig.appDB : decryptedConfig.fposDB,
      entities: [entityDirRule],
      port: 1433,
      extra: {
        encrypt: false,
        instanceName: decryptedConfig.SQL.host.split('\\')[1],
      },
      synchronize: name === 'ACM',
    });
    sendConnect({
      connected: true,
      name,
      database: connection.options.database as string,
      host: decryptedConfig.SQL.host,
    });
  } catch (err) {
    log(err);
    sendError(
      buildError(
        `Could not connect to ${name} database`,
        'Please confirm that the DB credentials provided are correct.',
        err as Error
      )
    );
  }
};

export const getStatus = async (name: 'ACM' | 'FPOS') => {
  const config = await getConfig();
  const status = { name } as Partial<StatusInfo>;
  const connection = getConnection(name);
  status.connected = connection && connection.isConnected;
  status.database = name === 'ACM' ? config.appDB : config.fposDB;
  status.host = config.SQL.host;
  return status as StatusInfo;
};

// Repo Functions
export const findItems: (
  options: FindManyOptions<Item>
) => Promise<Item[]> = async (
  options = {
    order: { department: 'ASC', itemName: 'ASC' },
  }
) => {
  const connection = getConnection('FPOS');
  if (connection) {
    const repo = connection.getRepository(Item);
    const items = await repo.find(options);
    return items;
  }
  return [] as Item[];
};

export const copyRule: (id: string) => Promise<CouponRule | undefined> = async (
  id
) => {
  const connection = getConnection('ACM');
  if (connection) {
    const ruleRepo = connection.getRepository(CouponRule);
    const rule = await ruleRepo.findOne({ id });
    if (rule) {
      const availabilityRepo = connection.getRepository(
        CouponDailyAvailability
      );
      const itemRepo = connection.getRepository(CouponItem);
      const availability = await availabilityRepo.find({ couponRule: rule });
      const items = await itemRepo.find({ couponRule: rule });
      const newRule = await ruleRepo.save({
        ...rule,
        id: v4(),
        items: [],
        dailyAvailability: [],
      });
      const relationPromises = [] as (
        | Promise<CouponItem>
        | Promise<CouponDailyAvailability>
      )[];
      items.forEach((item) => {
        relationPromises.push(
          itemRepo.save({ ...item, id: v4(), couponRule: newRule })
        );
      });
      availability.forEach((day) => {
        relationPromises.push(
          availabilityRepo.save({ ...day, id: v4(), couponRule: newRule })
        );
      });
      await Promise.all(relationPromises);
      const updatedRule = await ruleRepo.findOne(
        { id: newRule.id },
        { relations: ['dailyAvailability', 'items'] }
      );
      return updatedRule;
    }
    return undefined;
  }
  return undefined;
};

export const createRule: (
  ruleObj: CouponRule,
  itemsArr: CouponItem[],
  dailyAvailabilityArr: CouponDailyAvailability[]
) => Promise<CouponRule | undefined> = async (
  ruleObj,
  itemsArr,
  dailyAvailabilityArr
) => {
  const connection = getConnection('ACM');
  if (connection) {
    const dailyAvailabilityRepo = connection.getRepository(
      CouponDailyAvailability
    );
    const ruleRepo = connection.getRepository(CouponRule);
    const itemRepo = connection.getRepository(CouponItem);

    const rule = await ruleRepo.save({
      ...ruleObj,
      id: v4(),
      items: [],
      dailyAvailability: [],
    });

    const itemSavePromises = [] as Promise<CouponItem>[];
    itemsArr.forEach((item) => {
      itemSavePromises.push(
        itemRepo.save({ ...item, id: v4(), couponRule: rule })
      );
    });
    const dailyAvailabilitySavePromises =
      [] as Promise<CouponDailyAvailability>[];
    dailyAvailabilityArr.forEach((day) => {
      dailyAvailabilitySavePromises.push(
        dailyAvailabilityRepo.save({ ...day, id: v4(), couponRule: rule })
      );
    });
    await Promise.all(itemSavePromises);
    await Promise.all(dailyAvailabilitySavePromises);

    return ruleRepo.findOne(
      { id: rule.id },
      { relations: ['dailyAvailability', 'items'] }
    );
  }
  return undefined;
};

export const deleteRule: (
  id: string
) => Promise<CouponRule | undefined> = async (id) => {
  const connection = getConnection('ACM');
  if (connection) {
    const ruleRepo = connection.getRepository(CouponRule);
    const rule = await ruleRepo.findOne({ id });
    if (rule) {
      const availabilityRepo = connection.getRepository(
        CouponDailyAvailability
      );
      const itemRepo = connection.getRepository(CouponItem);
      const availability = await availabilityRepo.find({ couponRule: rule });
      const items = await itemRepo.find({ couponRule: rule });
      await availabilityRepo.remove(availability);
      await itemRepo.remove(items);
      await ruleRepo.remove([rule]);
      return rule;
    }
    return undefined;
  }
  return undefined;
};

export const findRule: (id: string) => Promise<CouponRule | undefined> = async (
  id
) => {
  const connection = getConnection('ACM');
  if (connection) {
    const repo = connection.getRepository(CouponRule);
    const rule = await repo.findOne(
      { id },
      { relations: ['dailyAvailability', 'items'] }
    );
    return rule;
  }
  return undefined;
};

export const findRules: (
  options: FindManyOptions<CouponRule>
) => Promise<CouponRule[]> = async (
  options = {
    order: { name: 'ASC' },
  }
) => {
  const connection = getConnection('ACM');
  if (connection) {
    const repo = connection.getRepository(CouponRule);
    const rules = await repo.find(options);
    return rules;
  }
  return [] as CouponRule[];
};

export const saveRule: (
  ruleObj: CouponRule,
  itemsArr: CouponItem[],
  dailyAvailabilityArr: CouponDailyAvailability[]
) => Promise<CouponRule | undefined> = async (
  ruleObj,
  itemsArr,
  dailyAvailabilityArr
) => {
  const connection = getConnection('ACM');
  if (connection) {
    const dailyAvailabilityRepo = connection.getRepository(
      CouponDailyAvailability
    );
    const ruleRepo = connection.getRepository(CouponRule);
    const itemRepo = connection.getRepository(CouponItem);

    let rule = await ruleRepo.findOne({ id: ruleObj.id });
    if (rule) {
      rule = await ruleRepo.save({
        ...ruleObj,
        items: [],
        dailyAvailability: [],
      });

      const oldAvailability = await dailyAvailabilityRepo.find({
        couponRule: rule,
      });
      const oldItems = await itemRepo.find({ couponRule: rule });

      const availabilityDeletePromises = oldAvailability.map((availability) => {
        return dailyAvailabilityRepo.remove(availability);
      });
      const itemDeletePromises = oldItems.map((item) => {
        return itemRepo.remove(item);
      });
      await Promise.all([...availabilityDeletePromises, ...itemDeletePromises]);

      const dailyAvailabilitySavePromises = dailyAvailabilityArr.map((day) => {
        return dailyAvailabilityRepo.save({
          ...day,
          id: v4(),
          couponRule: rule,
        });
      });
      const itemSavePromises = itemsArr.map((item) => {
        return itemRepo.save({ ...item, id: v4(), couponRule: rule });
      });
      await Promise.all([
        ...dailyAvailabilitySavePromises,
        ...itemSavePromises,
      ]);

      return ruleRepo.findOne(
        { id: ruleObj.id },
        { relations: ['dailyAvailability', 'items'] }
      );
    }
    return undefined;
  }
  return undefined;
};
