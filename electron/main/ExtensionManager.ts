import { app } from 'electron';
import { join } from 'path';
import fs from 'fs'
import { getAppContext } from '.';
import { Command, CardView } from './AppFramework';
import { init as initLayoutManager } from '../base-extensions/LayoutManager/LayoutManager'

interface ExtensionManifest {
    version: string;
    name: string;
    displayName?: string;
    main: string; // Main entrypoint of extension. Can define init (App load), cleanup (App close)
}

export interface ExtensionContext {
    registerCard: (cardId: string, card: CardView) => void;
    registerCommand: (commandId: string, command: Command) => void;
}

interface Extension {
    init: (context: ExtensionContext) => void;
    cleanup: (context: ExtensionContext) => void;
}

export default class ExtensionRepository {
    loadedExtensions: ExtensionManifest[];

    constructor() {
        this.loadedExtensions = [];
    }


    get extensionPaths() {
        const appPath = app.getAppPath();
        const paths = [
            join(appPath, "../extensions"),
        ];

        return paths;
    }

    // Remove eventually by adding base extension folder to extension paths
    loadBaseExtensions() {
        initLayoutManager(this.buildExtensionContext("layout-manager"));
    }

    loadExtensionsInPaths() {
        this.extensionPaths.forEach(path => {
            const extensions = fs.readdirSync(path);
    
            extensions.forEach(extension => {
                console.log("Loading extension: " + extension);
                this.loadExtension(extension, path).catch(err => console.error(err));
            })
        });
    }

    async loadExtension(extension, path) {
        const extensionPath = join(path, extension);
        const extensionPathPackageJson = join(extensionPath, 'package.json');
    
        if (! await fs.existsSync(extensionPathPackageJson)) {
            console.warn(`Extension package json ${extensionPathPackageJson} does not exist`);
            return;
        }
    
        let extensionInfo = JSON.parse(fs.readFileSync(extensionPathPackageJson, 'utf-8'));
        extensionInfo = Object.assign(extensionInfo, {
            extensionPath,
            main: join(extensionPath, extensionInfo.main),
        })
        
        await this.requireExtension(extensionInfo);
    }

    async requireExtension(extensionInfo: ExtensionManifest) {
        try {
            console.log("Loading extension " + 'file://' + extensionInfo.main);
            const extensionObject: Extension = await import('file://' + extensionInfo.main);
            extensionObject.init?.(this.buildExtensionContext(extensionInfo.name));
    
            this.loadedExtensions.push(extensionInfo);
        } catch (err) {
            console.error("Error loading extension " + extensionInfo.main + " :: " + err);
        }
    }

    buildExtensionContext(extensionId: string): ExtensionContext {
        return {
            registerCard: (cardId:string, card: CardView) => {
                getAppContext().appFramework.registerCard(extensionId, cardId, { ...card });
            },
            registerCommand: (commandId: string, command: Command) => {
                getAppContext().appFramework.registerCommand(extensionId, commandId, command);
            }
        }
    }
}