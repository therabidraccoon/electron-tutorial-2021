const { app, ipcMain, BrowserWindow, Notification } = require("electron");

let secondaryWindow;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, //importante per utilizzare ipc renderer nel processo renderer
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

function createSecondaryWindows() {
  secondaryWindow = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  secondaryWindow.setMenu(null);

  secondaryWindow.loadFile("secondary.html");
}

app.whenReady().then(() => {
  createWindow();

  //mac os specific
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("my-notification", (event, notificationBody) => {
  if (Notification.isSupported()) {
    let notif = new Notification({
      title: "Notifica electron!",
      body: notificationBody,
    });
    notif.show();
  }
});

ipcMain.on("open-window", (event, notificationBody) => {
  if (!secondaryWindow) {
    createSecondaryWindows();
  }
});

ipcMain.on("close-window", (event, notificationBody) => {
  secondaryWindow.hide();
  secondaryWindow = null;
});
