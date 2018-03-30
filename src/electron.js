import { app, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import { exec, spawn } from 'child_process';
import util from 'util';
import DotEnv from 'dotenv';
import ps from 'ps-node';

const execP = util.promisify(exec);
DotEnv.config();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let pid;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file:${__dirname}/../public/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('close', (e) => {
    if (pid != null) {
      e.preventDefault();
      ps.kill(pid, (err) => {
        if (err) {
          console.error(err);
        }
        pid = null;
        mainWindow.close();
      });
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // Launch the daemon
  startBackend()
    .then(p => {
      pid = p;
    })
    .then(() => createWindow());
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const extractWindowsDaemon = () => {
  return execP(`unzip ${__dirname}/../backend/${process.env.DAEMON_RELEASE}-win.zip -d ${__dirname}/../backend/`);
};

const extractLinuxDaemon = () => {
  return execP(`tar -xf ${__dirname}/../backend/${process.env.DAEMON_RELEASE}-x86_64-linux.tar.gz -C ${__dirname}/../backend/`);
};

const startBackend = () => {
  let extract;
  const platform = process.platform;
  switch (platform) {
  case 'linux':
    extract = extractLinuxDaemon();
    break;
  case 'win32':
    extract = extractWindowsDaemon();
    break;
  case 'darwin':
  default:
    // We don't support these platforms. We should probably let the user know.
    extract = new Promise(() => {
      throw Error('Unsupported Platform.');
    });
  }

  const spawnOptions = {
    detached: true,
    cwd: `${__dirname}/../backend/${process.env.BACKEND_DIR}/`,
    env: process.env,
    stdio: 'inherit',
  };

  return extract
    .then(() => execP(`cp ${__dirname}/../backend/polyswarmd.cfg ${__dirname}/../backend/${process.env.BACKEND_DIR}/`))
    .then(() => spawn('./polyswarmd',[], spawnOptions))
    .then((p) => p.pid)
    .catch((error) => {
      console.error(error);
      app.quit();
    });
};