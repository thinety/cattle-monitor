import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('CattleMonitor', {
  getCattleData: () => {
    return ipcRenderer.invoke('get-cattle-data');
  },
  setCattleData: (data: any) => {
    return ipcRenderer.invoke('set-cattle-data', data);
  },
});
