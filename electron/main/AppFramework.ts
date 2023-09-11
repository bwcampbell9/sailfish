import { ipcMain, contextBridge, ipcRenderer } from "electron";

export interface View {

}

export interface Command {
    execute: (...args: unknown[]) => void;
    name: string;
    description?: string;
    icon?: string;
}

export default class AppFramework {
    views: {
        panels: {
            [viewId: string]: View
        },
        popups: {
            [viewId: string]: View
        },
        menuGroups: {
            [viewId: string]: View
        },
        sideBars: {
            [viewId: string]: View
        },
        searchResults: {
            [viewId: string]: View
        }
    };
    commands: {
        [commandId: string]: Command
    };

    constructor() {
        this.views = {
            panels: {},
            popups: {},
            menuGroups: {},
            sideBars: {},
            searchResults: {},
        };
        this.commands = {};
    }

    public registerView(viewId: string, view: View) {
        this.views[viewId] = view;
    }

    public registerCommand(extensionId: string, commandId: string, command: Command) {
        const fullCommandId = extensionId + '.' + commandId;
        this.commands[fullCommandId] = command;
        ipcMain.handle("command::" + fullCommandId, command.execute);
        console.log("Registering command: " + fullCommandId);
    }
}