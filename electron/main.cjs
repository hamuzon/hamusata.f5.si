
const {
  app,
  BrowserWindow,
  dialog,
  Menu
} = require("electron");

const { autoUpdater } = require("electron-updater");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");

const UPDATE_URL = "https://app.hamusata.f5.si/setupfiles";
const SITE_ROOT = path.resolve(__dirname, "..");
const HOST = "127.0.0.1";

let mainWindow = null;
let localServer = null;
let localPort = null;
let navigationMenu = null;

// ─────────────────────────────
// MIMEタイプ
// ─────────────────────────────

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf"
};

// ─────────────────────────────
// ローカルHTTPサーバー
// ─────────────────────────────

async function startLocalServer() {
  localServer = http.createServer(async (req, res) => {
    try {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, {
          "Content-Type": "text/plain; charset=utf-8",
          "Allow": "GET, HEAD"
        });
        res.end("Method Not Allowed");
        return;
      }

      const requestUrl = new URL(
        req.url,
        `http://${HOST}`
      );

      let pathname = decodeURIComponent(requestUrl.pathname);

      if (!pathname || pathname === "/") {
        pathname = "/index.html";
      }

      const filePath = path.resolve(
        SITE_ROOT,
        "." + pathname
      );

      const relativePath = path.relative(
        SITE_ROOT,
        filePath
      );

      // サイトルート外へのアクセスを禁止
      if (
        relativePath.startsWith("..") ||
        path.isAbsolute(relativePath)
      ) {
        res.writeHead(403, {
          "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("Forbidden");
        return;
      }

      let targetPath = filePath;

      try {
        const stats = await fs.stat(targetPath);

        if (stats.isDirectory()) {
          targetPath = path.join(
            targetPath,
            "index.html"
          );
        }
      } catch {
        if (!path.extname(targetPath)) {
          targetPath = path.join(
            targetPath,
            "index.html"
          );
        }
      }

      const file = await fs.readFile(targetPath);
      const ext = path.extname(targetPath).toLowerCase();

      res.writeHead(200, {
        "Content-Type":
          MIME_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "no-cache"
      });

      if (req.method === "HEAD") {
        res.end();
        return;
      }

      res.end(file);

    } catch (error) {
      console.error("Local server error:", req.url, error);

      const statusCode =
        error.code === "ENOENT" ? 404 : 500;

      res.writeHead(statusCode, {
        "Content-Type": "text/plain; charset=utf-8"
      });

      res.end(
        statusCode === 404 ? "Not Found" : "Internal Server Error"
      );
    }
  });

  await new Promise((resolve, reject) => {
    localServer.once("error", reject);

    localServer.listen(0, HOST, () => {
      localServer.removeListener("error", reject);

      localPort = localServer.address().port;

      console.log(
        `Local server: http://${HOST}:${localPort}`
      );

      resolve();
    });
  });
}

// ─────────────────────────────
// ローカルサイトURL
// ─────────────────────────────

function getLocalSiteURL(page = "index.html") {
  return `http://${HOST}:${localPort}/${page}`;
}

// ─────────────────────────────
// ナビゲーション
// ─────────────────────────────

function goBack() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const history = mainWindow.webContents.navigationHistory;

  if (history.canGoBack()) {
    history.goBack();
  }
}

function goForward() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const history = mainWindow.webContents.navigationHistory;

  if (history.canGoForward()) {
    history.goForward();
  }
}

function reloadPage() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  mainWindow.webContents.reload();
}

function goHome() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  mainWindow.loadURL(getLocalSiteURL("index.html"));
}

// ─────────────────────────────
// ウィンドウタイトル更新
// ─────────────────────────────

function updateWindowTitle(pageTitle) {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const currentURL = mainWindow.webContents.getURL();

  try {
    const url = new URL(currentURL);

    // 自分のサイトはアプリ名だけ表示
    if (
      url.hostname === HOST &&
      url.port === String(localPort)
    ) {
      mainWindow.setTitle("hamusata");
      return;
    }

    // 外部サイトのドメイン
    const domain = url.hostname;

    // ページタイトルを取得
    const currentTitle =
      typeof pageTitle === "string"
        ? pageTitle
        : mainWindow.webContents.getTitle();

    const siteName = String(currentTitle || "").trim();

    // ページタイトルが取得できない場合はドメインを使用
    const displayName =
      siteName &&
      siteName.toLowerCase() !== domain.toLowerCase()
        ? siteName
        : domain;

    // 外部サイトのタイトル
    mainWindow.setTitle(
      `${displayName} - ${domain} | hamusata`
    );

  } catch {
    mainWindow.setTitle("hamusata");
  }
}

// ─────────────────────────────
// ナビゲーションメニュー状態更新
// ─────────────────────────────

function updateNavigationMenu() {
  if (!navigationMenu) return;
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const history = mainWindow.webContents.navigationHistory;

  const backItem =
    navigationMenu.getMenuItemById("nav-back");

  const forwardItem =
    navigationMenu.getMenuItemById("nav-forward");

  if (backItem) {
    backItem.enabled = history.canGoBack();
  }

  if (forwardItem) {
    forwardItem.enabled = history.canGoForward();
  }
}

// ─────────────────────────────
// Electronネイティブメニュー
// ─────────────────────────────

function createNativeMenu() {
  const template = [
    {
      label: "ナビゲーション",
      submenu: [
        {
          id: "nav-back",
          label: "戻る",
          accelerator: "Alt+Left",
          enabled: false,
          click: () => goBack()
        },
        {
          id: "nav-forward",
          label: "進む",
          accelerator: "Alt+Right",
          enabled: false,
          click: () => goForward()
        },
        { type: "separator" },
        {
          id: "nav-reload",
          label: "更新",
          accelerator: "F5",
          click: () => reloadPage()
        },
        {
          id: "nav-home",
          label: "ホーム",
          accelerator: "Ctrl+Home",
          click: () => goHome()
        }
      ]
    }
  ];

  navigationMenu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(navigationMenu);
}

// ─────────────────────────────
// キーボード操作
// ─────────────────────────────

function registerKeyboard() {
  mainWindow.webContents.on(
    "before-input-event",
    (event, input) => {
      if (input.type !== "keyDown") return;

      // Ctrl + R で更新
      if (
        input.control &&
        !input.alt &&
        input.key.toLowerCase() === "r"
      ) {
        event.preventDefault();
        reloadPage();
      }
    }
  );
}

// ─────────────────────────────
// ウィンドウ作成
// ─────────────────────────────

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 800,
    minHeight: 600,

    title: "hamusata",

    // Windows標準タイトルバー
    frame: true,

    // ネイティブメニューを表示
    autoHideMenuBar: false,

    backgroundColor: "#ffffff",

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // ネイティブメニュー
  createNativeMenu();

  // ホームページ
  mainWindow.loadURL(getLocalSiteURL("index.html"));

  // ───────────────────────────
  // 外部リンクもアプリ内で表示
  // ───────────────────────────

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL(url);
    }

    return { action: "deny" };
  });

  // ───────────────────────────
  // ページ移動時の処理
  // ───────────────────────────

  // ページ移動
  mainWindow.webContents.on("did-navigate", () => {
    updateWindowTitle();
    updateNavigationMenu();
  });

  // ページ内移動
  mainWindow.webContents.on("did-navigate-in-page", () => {
    updateWindowTitle();
    updateNavigationMenu();
  });

  // ページ読み込み完了
  mainWindow.webContents.on("did-finish-load", () => {
    updateWindowTitle();
    updateNavigationMenu();
  });

  // ページタイトル変更
  mainWindow.webContents.on(
    "page-title-updated",
    (event, title) => {
      // Electron標準のタイトル上書きを防止
      event.preventDefault();

      updateWindowTitle(title);
    }
  );

  // キーボード操作
  registerKeyboard();

  // ウィンドウ終了
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ─────────────────────────────
// 自動アップデート
// ─────────────────────────────

async function checkForUpdates() {
  if (!app.isPackaged) return;

  autoUpdater.setFeedURL({
    provider: "generic",
    url: UPDATE_URL
  });

  autoUpdater.autoDownload = true;
  autoUpdater.disableDifferentialDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-available", () => {
    console.log("Update available");
  });

  autoUpdater.on("update-not-available", () => {
    console.log("No updates available");
  });

  autoUpdater.on("update-downloaded", async () => {
    const result = await dialog.showMessageBox({
      type: "info",
      title: "アップデート",
      message: "新しいバージョンがダウンロードされました。",
      detail: "アプリを再起動してアップデートを適用します。",
      buttons: ["今すぐ再起動", "後で"],
      defaultId: 0,
      cancelId: 1
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
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

// ─────────────────────────────
// 起動
// ─────────────────────────────

app.whenReady().then(async () => {
  try {
    await startLocalServer();

    createNativeMenu();

    createWindow();

    await checkForUpdates();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

  } catch (error) {
    console.error("Application startup failed:", error);
    app.quit();
  }
});

// ─────────────────────────────
// アプリ終了
// ─────────────────────────────

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (localServer) {
    localServer.close();
    localServer = null;
  }
});

