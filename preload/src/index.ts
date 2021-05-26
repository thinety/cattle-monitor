import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('getCattleData', async () => {
  const data = await ipcRenderer.invoke('get-cattle-data');
  return data;
});

contextBridge.exposeInMainWorld('setCattleData', async (cattleData: any) => {
  await ipcRenderer.invoke('set-cattle-data', cattleData);
});
