const { contextBridge, ipcRenderer } = require('electron');

// Expõe API segura para o renderer se comunicar com o main process
contextBridge.exposeInMainWorld('electronAPI', {
  exportSite: (siteData) => ipcRenderer.invoke('export-site', siteData),
  platform: process.platform
});
