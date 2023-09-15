import { contextBridge, ipcRenderer } from "electron";
import { ContextBridge } from "./ContextBridge";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    reactAppStarted: () => ipcRenderer.send("reactAppStarted"),
    onNativeThemeChanged: (callback: () => void) => ipcRenderer.on("nativeThemeChanged", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    executeCommand: (commandId: string, ...args: unknown[]) => {
        console.log("Got command: " + commandId + " args: " + args);
        return ipcRenderer.invoke("command::" + commandId, ...args);
    },
    handleCommand: (commandId: string, callback) => {
        ipcRenderer.on("handle::" + commandId, callback);
    }
});
