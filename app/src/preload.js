import { contextBridge, ipcRenderer } from "electron";

// import { Channels } from "./main/ipc";

contextBridge.exposeInMainWorld("hello", "test");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    // Clear Listeners
    clearConfigSave() {
      ipcRenderer.removeAllListeners("set-config");
    },
    clearConnect() {
      ipcRenderer.removeAllListeners("connect");
    },
    clearError() {
      ipcRenderer.removeAllListeners("error");
    },
    // Rule Methods
    copyRule(id) {
      return ipcRenderer.invoke("copy-rule", id);
    },
    createRule(rule, items, dailyAvailability) {
      return ipcRenderer.invoke("create-rule", rule, items, dailyAvailability);
    },
    deleteRule(id) {
      return ipcRenderer.invoke("delete-rule", id);
    },
    findRule(id) {
      return ipcRenderer.invoke("find-rule", id);
    },
    findRules(
      options = {
        order: { name: "ASC", isActive: "ASC" },
      }
    ) {
      return ipcRenderer.invoke("find-rules", options);
    },
    saveRule(rule, items, dailyAvailability) {
      return ipcRenderer.invoke("save-rule", rule, items, dailyAvailability);
    },
    // FPOS DB Methods
    findItems(
      options = {
        order: { department: "ASC", itemName: "ASC" },
      }
    ) {
      return ipcRenderer.invoke("find-items", options);
    },
    // Config Methods
    getConfig() {
      return ipcRenderer.invoke("get-config");
    },
    setConfig(config) {
      return ipcRenderer.invoke("set-config", config);
    },
    // Status Methods
    getStatus(name) {
      return ipcRenderer.invoke("get-status", name);
    },
    // Listeners
    onConnect(callback) {
      ipcRenderer.on("connect", (_, status) => callback(status));
    },
    onConfigSave(callback) {
      ipcRenderer.on("save-config", (_, config) => callback(config));
    },
    onError(callback) {
      ipcRenderer.on("error", (_, error) => callback(error));
    },
  },
});
