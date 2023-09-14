import { ipcMain, app, ipcRenderer, BrowserWindow } from "electron";
import fs from 'fs'
import { join, resolve } from 'path';
import Vault, { VaultTask } from "./Vault";
import { SearchCategory } from "./search";

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
        this.search = new SearchCategory({
            'task-1': {
                title: 'Task 1',
                icon: 'task',
                command: 'sailfish.ping'
            },
            'task-2': {
                title: 'Task 2',
                icon: 'task',
                command: 'sailfish.ping'
            },
            'task-3': {
                title: 'Task 3',
                icon: 'task',
                command: 'sailfish.ping'
            },
            'task-4': {
                title: 'Task 4',
                icon: 'task',
                command: 'sailfish.ping'
            },
            'task-5': {
                title: 'Task 5',
                icon: 'task',
                command: 'sailfish.ping'
            },
            'task-6': {
                title: 'Task 6',
                icon: 'task',
                command: 'sailfish.ping'
            },
            'command-1': {
                title: 'Command 1',
                icon: 'command',
                command: 'sailfish.ping'
            },
            'command-2': {
                title: 'Command 2',
                icon: 'command',
                command: 'sailfish.ping'
            },
            'command-3': {
                title: 'Command 3',
                icon: 'command',
                command: 'sailfish.ping'
            },
            'command-4': {
                title: 'Command 4',
                icon: 'command',
                command: 'sailfish.ping'
            },
            'command-5': {
                title: 'Command 5',
                icon: 'command',
                command: 'sailfish.ping'
            },
            'command-6': {
                title: 'Command 6',
                icon: 'command',
                command: 'sailfish.ping'
            },
            'other-1': {
                title: 'Other 1',
                icon: 'other',
                command: 'sailfish.ping'
            },
            'other-2': {
                title: 'Other 2',
                icon: 'other',
                command: 'sailfish.ping'
            }
        });
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