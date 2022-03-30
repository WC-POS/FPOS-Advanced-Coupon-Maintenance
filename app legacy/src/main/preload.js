const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    clearConfigSave() {
      ipcRenderer.removeAllListeners('save-config');
    },
    clearConnect() {
      ipcRenderer.removeAllListeners('connect');
    },
    clearError() {
      ipcRenderer.removeAllListeners('error');
    },
    copyRule(id) {
      return ipcRenderer.invoke('copy-rule', id);
    },
    createRule(rule, items, dailyAvailability) {
      return ipcRenderer.invoke('create-rule', rule, items, dailyAvailability);
    },
    deleteRule(id) {
      return ipcRenderer.invoke('delete-rule', id);
    },
    getConfig() {
      return ipcRenderer.invoke('get-config');
    },
    getStatus(name) {
      return ipcRenderer.invoke('get-status', name);
    },
    findItems(options = { order: { department: 'ASC', itemName: 'ASC' } }) {
      return ipcRenderer.invoke('find-items', options);
    },
    findRule(id) {
      return ipcRenderer.invoke('find-rule', id);
    },
    findRules(options = { order: { name: 'ASC', isActive: 'ASC' } }) {
      return ipcRenderer.invoke('find-rules', options);
    },
    saveRule(rule, items, dailyAvailability) {
      return ipcRenderer.invoke('save-rule', rule, items, dailyAvailability);
    },
    setConfig(config) {
      return ipcRenderer.invoke('set-config', config);
    },
    onConnect(callback) {
      ipcRenderer.on('connect', (event, status) => callback(status));
    },
    onConfigSave(callback) {
      ipcRenderer.on('save-config', (event, config) => callback(config));
    },
    onError(callback) {
      ipcRenderer.on('error', (event, error) => callback(error));
    },
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
