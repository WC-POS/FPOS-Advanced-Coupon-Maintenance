import { BrowserWindow } from "electron";
import { Channels } from "../../main/ipc";

function sendSave(config: SettingsConfig) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.webContents.send(Channels.onSave, config);
}

export default sendSave;
