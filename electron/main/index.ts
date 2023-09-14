import { app, BrowserWindow, globalShortcut, ipcMain, IpcMainEvent, nativeTheme, net, protocol } from "electron";
import { join } from "path";
import ExtensionManager from "./ExtensionManager";
import AppFramework from "./AppFramework";
import { AppContext } from "./ExtensionTypes";
import Positioner from "electron-positioner";

const pluginManager: ExtensionManager = new ExtensionManager();
let appFramework: AppFramework = undefined;

const createBrowserWindow = (appIsPackaged: boolean): BrowserWindow => {
    const preloadScriptFilePath = appIsPackaged
        ? join(__dirname, "..", "..", "dist-electron", "preload", "index.js")
        : join(__dirname, "..", "preload", "index.js");

    const win = new BrowserWindow({
        backgroundColor: "#000000",
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: preloadScriptFilePath,
        },
    });
    win.webContents.openDevTools({mode: 'undocked'})
    return win;
};

const createSearchBrowserWindow = (appIsPackaged: boolean): BrowserWindow => {
    const preloadScriptFilePath = appIsPackaged
        ? join(__dirname, "..", "..", "dist-electron", "preload", "index.js")
        : join(__dirname, "..", "preload", "index.js");

    const window = new BrowserWindow({
        width: 800,
        height: 350,
        autoHideMenuBar: true,
        frame: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        closable: false,
        alwaysOnTop: false,
        fullscreenable: false,
        skipTaskbar: true,
        title: "Sailfish Search",
        show: false,
        transparent: true,
        backgroundColor: "#00000000",
        webPreferences: {
            enablePreferredSizeMode: true,
            preload: preloadScriptFilePath,
        },
    });

    window.on('blur', () => window.hide());
    window.webContents.openDevTools({mode: 'undocked'})
    const positioner = new Positioner(window);
    positioner.move('center'); 
    window.setMenuBarVisibility(false);
    loadFileOrUrl(window, app.isPackaged, "search");

    return window;
};

const loadFileOrUrl = (browserWindow: BrowserWindow, appIsPackaged: boolean, path: string = "") => {
    console.log(appIsPackaged);
    console.log(process.env.VITE_DEV_SERVER_URL + `${path}`);
    appIsPackaged
        ? browserWindow.loadFile(join(__dirname, "..", "..", "dist", `index.html?${path}`))
        : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL + path);
};

const registerIpcEventListeners = () => {
    ipcMain.on("reactAppStarted", () => console.log("React app started"));

    ipcMain.on("themeShouldUseDarkColors", (event: IpcMainEvent) => {
        event.returnValue = nativeTheme.shouldUseDarkColors;
    });
};

const registerNativeThemeEventListeners = (allBrowserWindows: BrowserWindow[]) => {
    nativeTheme.addListener("updated", () => {
        for (const browserWindow of allBrowserWindows) {
            browserWindow.webContents.send("nativeThemeChanged");
        }
    });
};

const loadExtensions = () => {
    pluginManager.loadExtensionsInPaths();
}

const registerFileProtocol = () => {
    app.whenReady().then(() => {
        protocol.handle('file', async (request) => {
          console.log("file request");
          console.log(request);
          return new Response('Hello World')
        });
    });
}

const registerSearchService = (searchWindow: BrowserWindow) => {
    globalShortcut.register('Alt+E', () => {
        console.log('Search is pressed')
        searchWindow.show();
    });
}


(async () => {
    await app.whenReady();
    registerFileProtocol();
    loadExtensions();
    const mainWindow = createBrowserWindow(app.isPackaged);
    mainWindow.maximize();
    mainWindow.on('ready-to-show', function() {
        mainWindow.show();
        mainWindow.focus();
    });
    const searchWindow = createSearchBrowserWindow(app.isPackaged)
    appFramework = new AppFramework(mainWindow, searchWindow);
    registerSearchService(searchWindow);
    loadFileOrUrl(mainWindow, app.isPackaged);
    registerIpcEventListeners();
    registerNativeThemeEventListeners(BrowserWindow.getAllWindows());
})();

app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  })

export const getAppContext = (): AppContext => { return { appFramework } };