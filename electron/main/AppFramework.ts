import { ipcMain, contextBridge, ipcRenderer, BrowserWindow } from "electron";
import { createRoot } from 'react-dom/client';
import { serialize } from "react-serialize";
import React from "react";

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
    description?: string;
    icon?: string;
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
    
    constructor() {
        this.views = {
            panels: {},
            cards: {},
            popups: {},
            menuGroups: {},
            searchResults: {},
        };
        this.commands = {};

        this.setupAppCommands();
    }
    
    setupAppCommands() {
        this.registerCommand("sailfish", "renderCard", {
            name: "Render Card",
            execute: (event, cardId: string, elementId: string) => {
                console.log("Getting card: " + cardId);
                console.log(React.createElement(this.views.cards[cardId].component, {message: "Hello World"}));
                // const root = createRoot(document.getElementById(elementId));
                // root.render(React.createElement(this.views.cards[cardId].component, {message: "Hello World"}));
            }
        })
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