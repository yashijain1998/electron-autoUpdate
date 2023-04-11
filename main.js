const { app, BrowserWindow, globalShortcut,dialog, ipcMain  } = require("electron");
const { autoUpdater } = require('electron-updater');

const createWindow = () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      nodeIntegration: true
    },
  });
  /*
  let winTwo = new BrowserWindow({
   backgroundColor: '#D3D3D3', // for providing background color to browser window
   frame: false, // for remove border and frame
   parent: win, // for craeting chold window whose parent is win
   modal: true  //parent window is only click once action(like accept T&C) is done in child window
  })
  */

  win.loadFile('index.html')

  //open dev tools
  win.webContents.openDevTools();

  win.on("close", () => {
    win = null;
  });

  //when window is ready then show, for better User experience
  win.once("ready-to-show", () => {
    win.show();
    autoUpdater.checkForUpdatesAndNotify();
  });
};

//create browser window when app is ready
app.whenReady().then(() => {
  console.log("creating browser window");
  createWindow();
  globalShortcut.register('ctrl+n', () => {
    // let wintwo = new BrowserWindow();
    dialog.showOpenDialog({
      buttonLabel: 'select file',
    });
  })
});

//force quit app when all window are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

//when click on icon , if no browser window is created then create one for macOs
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });