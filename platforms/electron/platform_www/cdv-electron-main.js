/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

const fs = require('fs');
const path = require('path');
const { cordova } = require('./package.json');
// Module to control application life, browser window and tray.
const {
    app,
    BrowserWindow,
    BrowserView,
    protocol,
    ipcMain,
    Tray,
    Menu,
    autoUpdater, 
    dialog
} = require('electron');

// Electron settings from .json file.
const cdvElectronSettings = require('./cdv-electron-settings.json');
const reservedScheme = require('./cdv-reserved-scheme.json');

const devTools = cdvElectronSettings.browserWindow.webPreferences.devTools
    ? require('electron-devtools-installer')
    : false;

const scheme = cdvElectronSettings.scheme;
const hostname = cdvElectronSettings.hostname;
const isFileProtocol = scheme === 'file';

/**
 * The base url path.
 * E.g:
 * When scheme is defined as "file" the base path is "file://path-to-the-app-root-directory"
 * When scheme is anything except "file", for example "app", the base path will be "app://localhost"
 *  The hostname "localhost" can be changed but only set when scheme is not "file"
 */
const basePath = (() => isFileProtocol ? `file://${__dirname}` : `${scheme}://${hostname}`)();

if (reservedScheme.includes(scheme)) throw new Error(`The scheme "${scheme}" can not be registered. Please use a non-reserved scheme.`);

if (!isFileProtocol) {
    protocol.registerSchemesAsPrivileged([
        { scheme, privileges: { standard: true, secure: true } }
    ]);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
    // Create the browser window.
    let appIcon;
    if (fs.existsSync(path.join(__dirname, 'img/app.png'))) {
        appIcon = path.join(__dirname, 'img/app.png');
    } else if (fs.existsSync(path.join(__dirname, 'img/icon.png'))) {
        appIcon = path.join(__dirname, 'img/icon.png');
    } else {
        appIcon = path.join(__dirname, 'img/logo.png');
    }

    const browserWindowOpts = Object.assign({}, cdvElectronSettings.browserWindow, { icon: appIcon });
    //browserWindowOpts.webPreferences.preload = path.join(app.getAppPath(), 'cdv-electron-preload.js');
    //browserWindowOpts.webPreferences.contextIsolation = false;

    mainWindow = new BrowserWindow(browserWindowOpts);
    const isMac = process.platform === 'darwin'
    const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    // { role: 'editMenu' }
    // { role: 'viewMenu' }
    {
        label: '????????????',
        submenu: [
          { label: '????????????????', role: 'reload' },
          { type: 'separator' },
          { label: '?????????????????????? ????????????????????????', role: 'toggleDevTools' },
        ]
      },
    // { role: 'windowMenu' }
    {
        label: '????????????????????',
        submenu: [
        {
            label: '?? ????????????',
            click: async () => {
                const version = new BrowserWindow(
                    { 
                        width: 600, 
                        height: 400, 
                        title: '?? ????????????', 
                        icon: appIcon, 
                        minimizable: false, 
                        maximizable: false, 
                        resizable: false,
                        alwaysOnTop: true,
                        parent: mainWindow,
                        webPreferences :{
                            devTools: true,
                            nodeIntegration: true,
                            contextIsolation: false
                        },
                    }
                )
                version.setMenuBarVisibility(false)
                version.loadFile('version.html')
            }
        }
        ]
    }
    ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    //mainWindow.setMenuBarVisibility(false)
    // Load a local HTML file or a remote URL.
    const cdvUrl = cdvElectronSettings.browserWindowInstance.loadURL.url;
    const loadUrl = cdvUrl.includes('://') ? cdvUrl : `${basePath}/${cdvUrl}`;
    const loadUrlOpts = Object.assign({}, cdvElectronSettings.browserWindowInstance.loadURL.options);

    mainWindow.loadURL(loadUrl, loadUrlOpts);
        // Open the DevTools.
        //if (cdvElectronSettings.browserWindow.webPreferences.devTools) {
        //    mainWindow.webContents.openDevTools();
        //}

        // Emitted when the window is closed.
        /*mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
            mainWindow = null;
        });*/


    mainWindow.on('close', (ev) => {
        if (mainWindow?.isVisible()) {
          ev.preventDefault();
          mainWindow.hide();
        }
      });

      
}

function createTray() {

    let appIcon;
    if (fs.existsSync(path.join(__dirname, 'img/app.png'))) {
        appIcon = path.join(__dirname, 'img/app.png');
    } else if (fs.existsSync(path.join(__dirname, 'img/icon.png'))) {
        appIcon = path.join(__dirname, 'img/icon.png');
    } else {
        appIcon = path.join(__dirname, 'img/logo.png');
    }


    const contextMenu = Menu.buildFromTemplate([
      {
        label: '?????????????? ????????????????????',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          BrowserWindow.getAllWindows().forEach((w) => w.destroy());
          app.quit();
        }
      }
    ]);
  
    const tray = new Tray(appIcon);
    tray.setToolTip('???????????????? ??????????');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      BrowserWindow.getAllWindows().shift().show();
    });
    mainWindow.tray = tray
  }

function configureProtocol () {
    protocol.registerFileProtocol(scheme, (request, cb) => {
        const url = request.url.substr(basePath.length + 1);
        cb({ path: path.normalize(path.join(__dirname, url)) }); // eslint-disable-line node/no-callback-literal
    });

    protocol.interceptFileProtocol('file', (_, cb) => { cb(null); });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
/*
app.on('ready', () => {
    if (!isFileProtocol) {
        configureProtocol();
    }

    if (devTools && cdvElectronSettings.devToolsExtension) {
        const extensions = cdvElectronSettings.devToolsExtension.map(id => devTools[id] || id);
        devTools.default(extensions) // default = install extension
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    }

    createWindow();
});
*/

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/*
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        if (!isFileProtocol) {
            configureProtocol();
        }

        createWindow();
    }
});*/


app.whenReady().then(() => {
    createWindow();
    createTray();
  });
  
  app.on('activate', () => {
    const window = BrowserWindow.getAllWindows().shift();
    if (window) {
      window.show();
    } else {
      createWindow();
    }
  });

ipcMain.handle('cdv-plugin-exec', async (_, serviceName, action, ...args) => {
    if (cordova && cordova.services && cordova.services[serviceName]) {
        const plugin = require(cordova.services[serviceName]);

        return plugin[action]
            ? plugin[action](args)
            : Promise.reject(new Error(`The action "${action}" for the requested plugin service "${serviceName}" does not exist.`));
    } else {
        return Promise.reject(new Error(`The requested plugin service "${serviceName}" does not exist have native support.`));
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
