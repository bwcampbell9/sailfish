import { app } from "electron";
import { ExtensionContext } from "../../main/ExtensionManager";
import fs from 'fs';
import { join } from 'path';

export interface LayoutDimensions {
    typeId: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Layout {
    // fullCardId: "cardGroup.cardId"
    [fullCardId: string]: LayoutDimensions
}

export interface Layouts {
    // Screen size in grid unit width. Largest one should be taken that can fit entirely in the screen else smallest one available
    [screenSize: number]: Layout;
}

export interface LayoutDB {
    [layoutPath: string]: Layouts;
}

const dbPath = join(app.getAppPath(), 'layouts.json')

// Layouts are stored by path
//  the layout for active/auth/task-1 is stored at that key
//  if a layout does not exist for that key the last segment is removed until the path is empty
//   -> active/auth is checked
//   -> active is checked
//   -> the default layout is returned
//  the dashboard layout is stored at ":dashboard"
//  the default layout is stored at ":default"
const layoutDB = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const reducePath = (path: string) => {
    const lastIndex = path.lastIndexOf('/');
    return lastIndex < 0 ? "" : path.substring(0, lastIndex);
}

export const init = (context: ExtensionContext) => {
    
    const writeVault = () => {
        fs.writeFileSync(dbPath, JSON.stringify(layoutDB));
    }
    
    context.registerCommand("getTaskLayout", {
        name: "Get task layout",
        visibility: "protected",
        execute: (event, taskPath: string): Layouts => {
            let currentPath = taskPath;
            while(currentPath && !(currentPath in layoutDB)) {
                currentPath = reducePath(currentPath);
            }
            return currentPath ? [currentPath, layoutDB[currentPath]] : [":default", layoutDB[":default"]];
        }
    });

    context.registerCommand("setTaskLayout", {
        name: "Set task layout",
        visibility: "protected",
        execute: (event, layoutPath: string, size: number, cardId: string, layout: Layout) => {
            layoutDB[layoutPath][size][cardId] = {...layoutDB[layoutPath][size][cardId], ...layout};
            writeVault();
        }
    });
}
