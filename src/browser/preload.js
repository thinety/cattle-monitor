const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('getCattleData', async () => {
  const data = await ipcRenderer.invoke('get-cattle-data');
  return data;
});

contextBridge.exposeInMainWorld('setCattleData', async (cattleData) => {
  await ipcRenderer.invoke('set-cattle-data', cattleData);
});
