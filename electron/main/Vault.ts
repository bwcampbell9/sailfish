import { app } from "electron";
import fs from 'fs'
import { join } from 'path';

export interface VaultTask {
    name: string;
    metadata: object;
}

export interface VaultFolder {
    [objectId: string]: VaultTask | VaultFolder;
}

export default class Vault {
    vaultPath: string;
    vault: VaultFolder;

    constructor(vaultPath: string) {
        this.vaultPath = vaultPath;
        this.vault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
    }

    getVault() {
        return this.vault;
    }

    addTask(path: string, taskId: string, task: VaultTask) {
        let parentFolder = this.vault;
        for(const segment in path.split('/')){
            parentFolder = parentFolder[segment] as VaultFolder;
        }
        parentFolder[taskId] = task;
        this.writeVault();
    }

    addFolder(path: string, folderId: string) {
        let parentFolder = this.vault;
        for(const segment in path.split('/')){
            parentFolder = parentFolder[segment] as VaultFolder;
        }
        parentFolder[folderId] = {};
        this.writeVault();
    }

    writeVault() {
        fs.writeFileSync(this.vaultPath, JSON.stringify(this.vault));
    }

}