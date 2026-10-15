const { app, BrowserWindow, ipcMain, screen } = require('electron');
const { autoUpdater } = require('electron-updater');

// Nastavenie logovania pre autoUpdater (výpisy priamo do konzoly)
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

  // Automatická kontrola aktualizácií
  autoUpdater.checkForUpdatesAndNotify();
}

// Sledovanie priebehu aktualizácie cez logy
autoUpdater.on('checking-for-update', () => {
  console.log('[Updater] Kontrolujem aktualizácie na GitHube...');
});

autoUpdater.on('update-available', (info) => {
  console.log('[Updater] Našla sa nová verzia aplikácie: ' + info.version);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('[Updater] Žiadna nová aktualizácia nie je k dispozícii.');
});

autoUpdater.on('error', (err) => {
  console.log('[Updater] Nastala chyba pri aktualizácii: ', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = "[Updater] Rýchlosť stiahnutia: " + progressObj.bytesPerSecond;
  logMessage = logMessage + ' - Sťahuje sa ' + progressObj.percent + '%';
  logMessage = logMessage + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(logMessage);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('[Updater] Aktualizácia úspešne stiahnutá. Aplikácia sa čoskoro reštartuje...');
  // Automaticky nainštaluje aktualizáciu a reštartuje aplikáciu
  autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
  createWindow();

  // Otvorenie samostatného okna pre /identita
  ipcMain.on('open-identita-window', () => {
    let identitaWin = new BrowserWindow({
      width: 650,
      height: 550,
      frame: false,
      resizable: true,
      backgroundColor: '#111318',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    identitaWin.loadFile('identita.html');
  });

  // Otvorenie samostatného mobilného okna pre /lustrovat v pravom dolnom rohu
  ipcMain.on('open-lustracia-window', () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    let lustraciaWin = new BrowserWindow({
      width: 340,
      height: 680,
      x: width - 360,
      y: height - 680,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    lustraciaWin.setAlwaysOnTop(true, 'screen-saver');
    lustraciaWin.loadFile('lustracia.html');
  });

  // Otvorenie admin okna
  ipcMain.on('open-admin-window', () => {
    let adminWin = new BrowserWindow({
      width: 600,
      height: 500,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      autoHideMenuBar: true,
      title: "Admin Panel"
    });

    adminWin.loadFile('admin.html');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});