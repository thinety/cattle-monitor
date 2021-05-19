const fs = require('fs/promises');
const path = require('path');
const { app, BrowserWindow, protocol, ipcMain } = require('electron');

app.on('ready', () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  window.loadFile(path.join(__dirname, '../renderer/out/index.html'));

  protocol.interceptFileProtocol('file', (request, callback) => {
    let filepath = (new URL(request.url)).pathname;

    if (filepath.startsWith('/_next')) {
      filepath = path.join(__dirname, '../renderer/out', filepath);
    }

    callback(filepath);
  });

  const cattleDataFile = path.join(process.env.PORTABLE_EXECUTABLE_DIR, 'data.json');
  ipcMain.handle('get-cattle-data', async (_event) => {
    const cattleDataBuffer = await fs.readFile(cattleDataFile);
    const cattleData = JSON.parse(cattleDataBuffer);
    return cattleData;
  });
  ipcMain.handle('set-cattle-data', async (_event, cattleData) => {
    const cattleDataString = JSON.stringify(cattleData);
    await fs.writeFile(cattleDataFile, cattleDataString);
  });
});
