const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

const UPDATE_URL = "https://app.hamusata.f5.si/setupfiles";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL("https://hamusata.f5.si/");
}

async function checkForUpdates() {
  if (!app.isPackaged) return;

  autoUpdater.setFeedURL({
    provider: "generic",
    url: UPDATE_URL
  });

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-available", () => {
    console.log("Update available");
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "アップデート",
        message: "新しいバージョンがダウンロードされました。",
        detail: "アプリを再起動してアップデートを適用します。",
        buttons: ["今すぐ再起動", "後で"]
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.on("error", (error) => {
    console.error("Update error:", error);
  });

  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    console.error("Update check failed:", error);
  }
}

app.whenReady().then(async () => {
  createWindow();
  await checkForUpdates();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
