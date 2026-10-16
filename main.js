const { app, BrowserWindow, ipcMain, screen } = require('electron');
const { autoUpdater } = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 700,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.loadFile('index.html');

  autoUpdater.checkForUpdatesAndNotify();
}

autoUpdater.on('checking-for-update', () => { console.log('[Updater] Kontrolujem aktualizácie na GitHube...'); });
autoUpdater.on('update-available', (info) => { console.log('[Updater] Našla sa nová verzia aplikácie: ' + info.version); });
autoUpdater.on('update-not-available', (info) => { console.log('[Updater] Žiadna nová aktualizácia nie je k dispozícii.'); });
autoUpdater.on('error', (err) => { console.log('[Updater] Nastala chyba pri aktualizácii: ', err); });
autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = "[Updater] Rýchlosť stiahnutia: " + progressObj.bytesPerSecond;
  logMessage = logMessage + ' - Sťahuje sa ' + progressObj.percent + '%';
  console.log(logMessage);
});
autoUpdater.on('update-downloaded', (info) => {
  console.log('[Updater] Aktualizácia úspešne stiahnutá. Aplikácia sa čoskoro reštartuje...');
  autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('open-identita-window', () => {
    let identitaWin = new BrowserWindow({
      width: 650, height: 550, frame: false, resizable: true, backgroundColor: '#111318',
      webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    identitaWin.loadFile('identita.html');
  });

  ipcMain.on('open-lustracia-window', () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    let lustraciaWin = new BrowserWindow({
      width: 340, height: 680, x: width - 360, y: height - 680,
      frame: false, transparent: true, alwaysOnTop: true, resizable: false,
      webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    lustraciaWin.setAlwaysOnTop(true, 'screen-saver');
    lustraciaWin.loadFile('lustracia.html');
  });

  // --- PRÍKAZ /DRAGER IPC HANDLERE ---
  ipcMain.on('open-drager-panel', () => {
    let panelWin = new BrowserWindow({
      width: 400, height: 300, frame: false, transparent: true, alwaysOnTop: true,
      webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    panelWin.loadFile('drager-panel.html');
  });

  ipcMain.on('open-target-drager-window', (event, data) => {
    let targetWin = new BrowserWindow({
      width: 350, height: 240, frame: false, transparent: true, alwaysOnTop: true,
      webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    targetWin.loadFile('drager-input.html');
    targetWin.webContents.once('did-finish-load', () => {
      targetWin.webContents.send('init-drager-target', data);
    });
  });

  ipcMain.on('open-drager-result-window', (event, value) => {
    let resultWin = new BrowserWindow({
      width: 450, height: 520, frame: false, transparent: true, alwaysOnTop: true,
      webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    resultWin.loadFile('drager.html');
    resultWin.webContents.once('did-finish-load', () => {
      resultWin.webContents.send('set-result-value', value);
    });
  });
  // -----------------------------------

  // --- PRÍKAZ /DRUGWIPE IPC HANDLERE ---
  ipcMain.on('open-drugwipe-panel', () => {
    let panelWin = new BrowserWindow({
      width: 400, height: 300, frame: false, transparent: true, alwaysOnTop: true,
      webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    panelWin.loadFile('drugwipe-panel.html');
  });

  ipcMain.on('open-target-drugwipe-window', (event, data) => {
    let targetWin = new BrowserWindow({
      width: 385, height: 325, frame: false, transparent: true, alwaysOnTop: true,
      webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    targetWin.loadFile('drugwipe-input.html');
    targetWin.webContents.once('did-finish-load', () => {
      targetWin.webContents.send('init-drugwipe-target', data);
    });
  });

  ipcMain.on('open-drugwipe-result-window', (event, selectedItems) => {
    let resultWin = new BrowserWindow({
      width: 450, height: 480, frame: false, transparent: true, alwaysOnTop: true,
      webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    resultWin.loadFile('drugwipe.html');
    resultWin.webContents.once('did-finish-load', () => {
      resultWin.webContents.send('set-drugwipe-results', selectedItems);
    });
  });

  // -----------------------------------

  ipcMain.on('open-admin-window', () => {
    let adminWin = new BrowserWindow({
      width: 600, height: 500,
      webPreferences: { nodeIntegration: true, contextIsolation: false },
      autoHideMenuBar: true, title: "Admin Panel"
    });
    adminWin.loadFile('admin.html');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});