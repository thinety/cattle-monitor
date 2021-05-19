import fs from 'fs/promises';
import path from 'path';
import { app, ipcMain, protocol, BrowserWindow } from 'electron';

app.on('ready', () => {
  const cattleDataFile = path.join(process.env.PORTABLE_EXECUTABLE_DIR!, 'data.json');
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

  protocol.interceptFileProtocol('file', (request, callback) => {
    const requestUrl = new URL(request.url);
    let filepath = requestUrl.pathname;

    if (filepath.substring(3).startsWith('/_next')) {
      filepath = path.join(__dirname, '../../renderer/out', filepath.substring(4));
    }

    callback(filepath);
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
  window.loadFile(path.join(__dirname, '../../renderer/out/index.html'));
});
