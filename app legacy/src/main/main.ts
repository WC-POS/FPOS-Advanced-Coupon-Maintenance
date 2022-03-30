/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { BrowserWindow, app, ipcMain, shell } from 'electron';
import { IPCChannels, SettingsConfig } from '../types';
import {
  connect,
  copyRule,
  createRule,
  deleteRule,
  disconnect,
  findItems,
  findRule,
  findRules,
  getConfig,
  getStatus,
  resolveHtmlPath,
  saveRule,
  writeConfig,
} from './util';
import log, { log as electronLog } from 'electron-log';

import { CouponDailyAvailability } from './models/ACM/CouponDailyAvailability';
import { CouponItem } from './models/ACM/CouponItem';
import { CouponRule } from './models/ACM/CouponRule';
import { FindManyOptions } from 'typeorm';
import { Item } from './models/FPOS/Item';
import MenuBuilder from './menu';
import { autoUpdater } from 'electron-updater';
import path from 'path';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle(IPCChannels.copyRule, async (_, id) => {
  return copyRule(id);
});

ipcMain.handle(
  IPCChannels.createRule,
  async (
    _,
    ruleObj: CouponRule,
    itemsArr: CouponItem[],
    dailyAvailabilityArr: CouponDailyAvailability[]
  ) => {
    return createRule(ruleObj, itemsArr, dailyAvailabilityArr);
  }
);

ipcMain.handle(IPCChannels.deleteRule, async (_, id: string) => {
  return deleteRule(id);
});

ipcMain.handle(IPCChannels.getConfig, async () => {
  const config = await getConfig();
  return config;
});

ipcMain.handle(IPCChannels.getStatus, async (_, name: 'ACM' | 'FPOS') => {
  const status = await getStatus(name);
  return status;
});

ipcMain.handle(IPCChannels.setConfig, async (_, config: SettingsConfig) => {
  await writeConfig(config);
  await disconnect('ACM');
  await disconnect('FPOS');
  const decryptedConfig = await getConfig();
  await connect(decryptedConfig, 'ACM');
  await connect(decryptedConfig, 'FPOS');
  return decryptedConfig;
});

ipcMain.handle(
  IPCChannels.findItems,
  async (_, options: FindManyOptions<Item>) => {
    return findItems(options);
  }
);

ipcMain.handle(IPCChannels.findRule, async (_, id: string) => {
  return findRule(id);
});

ipcMain.handle(
  IPCChannels.findRules,
  async (_, options: FindManyOptions<CouponRule>) => {
    return findRules(options);
  }
);

ipcMain.handle(
  IPCChannels.saveRule,
  async (
    _,
    ruleObj: CouponRule,
    itemsArr: CouponItem[],
    dailyAvailabilityArr: CouponDailyAvailability[]
  ) => {
    return saveRule(ruleObj, itemsArr, dailyAvailabilityArr);
  }
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minHeight: 420,
    minWidth: 420,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    getConfig()
      .then((config) => {
        connect(config, 'ACM');
        connect(config, 'FPOS');
      })
      .catch((err) => electronLog(err));

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
