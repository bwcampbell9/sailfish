import { app, BrowserWindow, ipcMain, IpcMainEvent, nativeTheme, net, protocol } from "electron";
import { join } from "path";
import ExtensionManager from "./ExtensionManager";
import AppFramework from "./AppFramework";
import { AppContext } from "./ExtensionTypes";

const pluginManager: ExtensionManager = new ExtensionManager();
const appFramework: AppFramework = new AppFramework();

const createBrowserWindow = (appIsPackaged: boolean): BrowserWindow => {
    const preloadScriptFilePath = appIsPackaged
        ? join(__dirname, "..", "..", "dist-electron", "preload", "index.js")
        : join(__dirname, "..", "preload", "index.js");

    return new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: preloadScriptFilePath,
        },
    });
};

const loadFileOrUrl = (browserWindow: BrowserWindow, appIsPackaged: boolean) => {
    appIsPackaged
        ? browserWindow.loadFile(join(__dirname, "..", "..", "dist", "index.html"))
        : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
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

const initAppFramework = () => {
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


(async () => {
    await app.whenReady();
    registerFileProtocol();
    initAppFramework();
    loadExtensions();
    const mainWindow = createBrowserWindow(app.isPackaged);
    loadFileOrUrl(mainWindow, app.isPackaged);
    registerIpcEventListeners();
    registerNativeThemeEventListeners(BrowserWindow.getAllWindows());
})();

export const getAppContext = (): AppContext => { return { appFramework } };