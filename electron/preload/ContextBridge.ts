import { IpcRendererEvent } from "electron";

export type ContextBridge = {
    reactAppStarted: () => void;
    onNativeThemeChanged: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    executeCommand: (commandId: string, ...args: unknown[]) => Promise<unknown>;
    handleCommand: (commandId: string, callback: (event: IpcRendererEvent, ...args: unknown[]) => void) => void;
};
