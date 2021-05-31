import * as fs from 'fs/promises';
import * as path from 'path';
import { ipcMain, app, BrowserWindow } from 'electron';


const cattleDataFile =
  process.env.NODE_ENV === 'production'
    ? path.join(process.env.PORTABLE_EXECUTABLE_DIR!, 'data.json')
    : path.join(__dirname, 'data.json');

ipcMain.handle('get-cattle-data', async (_event) => {
  const cattleDataBuffer = await fs.readFile(cattleDataFile);
  const cattleDataString = cattleDataBuffer.toString();
  const cattleData = JSON.parse(cattleDataString);
  return cattleData;
});

ipcMain.handle('set-cattle-data', async (_event, data) => {
  const cattleDataString = JSON.stringify(data);
  await fs.writeFile(cattleDataFile, cattleDataString);
});

app.on('ready', () => {
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
