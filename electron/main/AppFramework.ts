import { ipcMain, app, ipcRenderer, BrowserWindow } from "electron";
import fs from 'fs'
import { join, resolve } from 'path';
import Vault, { VaultTask } from "./Vault";
import { SearchCategory } from "./search/search";
import { buildVaultSearchDB } from "./search/SearchDBBuilders";

export interface View {
    name: string;
    description?: string;
    component: (unknown) => JSX.Element;
}

export interface PanelView extends View {

}

export interface CardView extends View {
    widthRange?: [number, number];
    heightRange?: [number, number];
}

export interface PopupView extends View {

}

export interface MenuGroupView extends View {

}

export interface SearchResultView extends View {

}

export interface Command {
    execute: (...args: unknown[]) => void;
    name: string;
    visibility: "public" | "protected" | "private"; // Public: executable in command pallete and by other extensions, Protected: executable by other extension, Private: exacutable only by this extension
    description?: string;
    icon?: string;
}

export interface UserSetting<T> {
    name: "Project Vault Root",
    description: "Folder containing the project vault",
    type: "filepath" | "string" | "number" | "boolean" | "option",
    defaultValue: T,
    value: T
}

export default class AppFramework {
    views: {
        panels: {
            [viewId: string]: PanelView
        },
        cards: {
            [viewId: string]: CardView
        },
        popups: {
            [viewId: string]: View
        },
        menuGroups: {
            [viewId: string]: View
        },
        searchResults: {
            [viewId: string]: View
        }
    };
    commands: {
        [commandId: string]: Command
    };
    settings: {
        [settingId: string]: UserSetting<unknown>
    }
    vault: Vault
    search: SearchCategory
    mainWindow: BrowserWindow
    searchWindow: BrowserWindow
    
    constructor(mainWindow: BrowserWindow, searchWindow: BrowserWindow) {
        this.views = {
            panels: {},
            cards: {},
            popups: {},
            menuGroups: {},
            searchResults: {},
        };
        this.mainWindow = mainWindow;
        this.searchWindow = searchWindow;
        const appPath = app.getAppPath();
        this.commands = {};
        this.vault = new Vault(join(appPath, 'vault.json'));
        this. settings = JSON.parse(fs.readFileSync(join(appPath, "usersettings.json"), 'utf-8'));
        this.setupAppCommands();
        this.search = new SearchCategory(buildVaultSearchDB(this.vault.getVault()));
    }

    setupAppCommands() {
        this.registerCommand("sailfish", "ping", {
            name: "Ping command for testing",
            visibility: "protected",
            execute: () => {
                console.log("pong");
                return "pong";
            }
        });
        this.registerCommand("sailfish", "getVault", {
            name: "Get Vault",
            visibility: "protected",
            execute: () => {
                return this.vault.getVault();
            }
        });
        this.registerCommand("sailfish", "addFolder", {
            name: "Add folder",
            visibility: "protected",
            execute: (event, path: string, folderId: string) => {
                return this.vault.addFolder(path, folderId);
            }
        });
        this.registerCommand("sailfish", "addTask", {
            name: "Add task",
            visibility: "protected",
            execute: (event, path: string, taskId: string, task: VaultTask) => {
                return this.vault.addTask(path, taskId, task);
            }
        });
        this.registerCommand("sailfish", "getTask", {
            name: "Get task",
            visibility: "protected",
            execute: (event, path: string) => {
                return this.vault.getTask(path);
            }
        });
        this.registerCommand("sailfish", "setTaskMetadata", {
            name: "set task metadata",
            visibility: "protected",
            execute: (event, path: string, key: string, value: object) => {
                return this.vault.setMetadata(path, key, value);
            }
        });
        this.registerCommand("sailfish", "setTaskTitle", {
            name: "set task title",
            visibility: "protected",
            execute: (event, path: string, value: string) => {
                return this.vault.setTitle(path, value);
            }
        });
        this.registerCommand("sailfish", "search", {
            name: "Global search",
            visibility: "protected",
            execute: (event, query: string, count: number) => {
                return this.search.search(query, count);
            }
        });
        this.registerCommand("sailfish", "closeSearch", {
            name: "Close search window",
            visibility: "protected",
            execute: () => {
                this.searchWindow.hide();
            }
        });
        this.registerCommand("sailfish", "openTask", {
            name: "Open a task or switch to it",
            visibility: "protected",
            execute: (event, taskPath: string) => {
                const task = this.vault.getTask(taskPath);
                this.mainWindow.webContents.send("handle::sailfish.openTask", task);
                if (this.mainWindow.isMinimized()) {
                    this.mainWindow.restore();
                }
                this.mainWindow.focus();
            }
        });
    }

    public willQuit(): void {
        console.log("closing all");
        this.mainWindow.webContents.closeDevTools();
        this.mainWindow.close();
        this.searchWindow.webContents.closeDevTools();
        this.searchWindow.close();
    }

    public registerCard(extensionId: string, cardId: string, cardProps: CardView) {
        const fullCardId = extensionId + '.' + cardId;
        console.log("Registering card: " + fullCardId);
        this.views.cards[fullCardId] = cardProps;
    }

    public registerCommand(extensionId: string, commandId: string, command: Command) {
        const fullCommandId = extensionId + '.' + commandId;
        this.commands[fullCommandId] = command;
        ipcMain.handle("command::" + fullCommandId, command.execute);
        console.log("Registering command: " + fullCommandId);
    }
}