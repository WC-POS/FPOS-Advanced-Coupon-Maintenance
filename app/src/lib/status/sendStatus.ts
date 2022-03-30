import { BrowserWindow } from "electron";
import { Channels } from "../../main/ipc";

function sendStatus(status: StatusInfo) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.webContents.send(Channels.onConnect, status);
}

export default sendStatus;
