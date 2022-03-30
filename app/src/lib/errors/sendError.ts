import { BrowserWindow } from "electron";
import { Channels } from "../../main/ipc";

function sendError(error: ErrorMsg) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.webContents.send(Channels.onError, error);
}

export default sendError;
