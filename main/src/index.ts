import fs from 'fs/promises';
import path from 'path';
import { app, ipcMain, BrowserWindow } from 'electron';


const cattleDataFile =
  process.env.NODE_ENV === 'production'
    ? path.join(process.env.PORTABLE_EXECUTABLE_DIR!, 'data.json')
    : path.join(__dirname, 'data.json');

app.on('ready', () => {
  ipcMain.handle('get-cattle-data', async (_event) => {
    const cattleDataBuffer = await fs.readFile(cattleDataFile);
    const cattleDataString = cattleDataBuffer.toString();
    const cattleData = JSON.parse(cattleDataString);
    return cattleData;
  });
  ipcMain.handle('set-cattle-data', async (_event, cattleData) => {
    const cattleDataString = JSON.stringify(cattleData);
    await fs.writeFile(cattleDataFile, cattleDataString);
  });

  const window = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  window.loadFile(path.join(__dirname, 'index.html'));
});
