const fs = require('fs/promises');
const path = require('path');
const { app, ipcMain, BrowserWindow } = require('electron');

app.on('ready', () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'browser', 'preload.js'),
    },
  });

  window.loadFile(path.join(__dirname, 'browser', 'index.html'));
});

module.exports = (cattleDataFile) => {
  ipcMain.handle('get-cattle-data', async (_event) => {
    const cattleDataBuffer = await fs.readFile(cattleDataFile);
    const cattleData = JSON.parse(cattleDataBuffer);
    return cattleData;
  });
  
  ipcMain.handle('set-cattle-data', async (_event, cattleData) => {
    const cattleDataString = JSON.stringify(cattleData);
    await fs.writeFile(cattleDataFile, cattleDataString);
  });
};
