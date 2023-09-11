export type ContextBridge = {
    reactAppStarted: () => void;
    onNativeThemeChanged: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    executeCommand: (commandId: string, ...args: unknown[]) => Promise<unknown>;
};
