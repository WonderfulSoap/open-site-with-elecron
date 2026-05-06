const { app, BrowserWindow } = require('electron');

if (app) {
  app.setAppUserModelId('com.example.testelectron');
}

const DEFAULT_URL = 'https://example.com';

let mainWindow = null;
let lastOpenedUrl = DEFAULT_URL;

function getUserArgs(argv) {
  const firstUserArgIndex = process.defaultApp ? 2 : 1;
  return argv.slice(firstUserArgIndex);
}

function hasSingletonFlag(argv) {
  const userArgs = getUserArgs(argv);
  return userArgs.includes('singleton') || userArgs.includes('--singleton');
}

function getStartupUrl(argv) {
  const userArgs = getUserArgs(argv);
  const candidate = userArgs.find(
    (arg) => arg !== 'singleton' && arg !== '--singleton' && !arg.startsWith('-')
  );

  if (!candidate) {
    return DEFAULT_URL;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // Ignore invalid URLs and fall back to the default page.
  }

  return DEFAULT_URL;
}

function openUrlInMainWindow(url) {
  lastOpenedUrl = url;

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.loadURL(url);
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
}

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      sandbox: true
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  openUrlInMainWindow(url);
}

function startApp() {
  if (hasSingletonFlag(process.argv)) {
    const hasSingleInstanceLock = app.requestSingleInstanceLock();
    if (!hasSingleInstanceLock) {
      app.quit();
      return;
    }

    app.on('second-instance', (_event, argv) => {
      const nextUrl = getStartupUrl(argv);

      if (mainWindow && !mainWindow.isDestroyed()) {
        openUrlInMainWindow(nextUrl);
        return;
      }

      app.whenReady().then(() => {
        createWindow(nextUrl);
      });
    });
  }

  app.whenReady().then(() => {
    createWindow(getStartupUrl(process.argv));

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(lastOpenedUrl);
      } else {
        openUrlInMainWindow(lastOpenedUrl);
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

if (require.main === module) {
  startApp();
}

module.exports = {
  getStartupUrl,
  hasSingletonFlag
};
