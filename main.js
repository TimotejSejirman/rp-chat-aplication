const { app, BrowserWindow, ipcMain, screen } = require('electron');
const { autoUpdater } = require('electron-updater');

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
      x: width - 360, // Pravý dolný roh s malým okrajom
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

  // Pridaj tento IPC listener do svojho main.js:
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