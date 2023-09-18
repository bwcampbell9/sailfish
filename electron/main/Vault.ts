import { app } from "electron";
import fs from 'fs'
import { join } from 'path';

export interface VaultTask {
    name: string;
    path: string;
    metadata: object;
}

export interface VaultFolder {
    [objectPath: string]: VaultTask | VaultFolder;
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

    addTask(folderPath: string, taskId: string, task: VaultTask) {
        let parentFolder = this.vault;
        for(const segment in folderPath.split('/')){
            parentFolder = parentFolder[segment] as VaultFolder;
        }
        parentFolder[taskId] = task;
        this.writeVault();
    }

    getTask(taskPath: string): VaultTask {
        let item: VaultFolder | VaultTask = this.vault;
        for(const segment of taskPath.split('/')){
            item = item[segment];
        }
        return item as VaultTask;
    }

    setMetadata(taskPath: string, key: string, value: object): void {
        let item: VaultFolder | VaultTask = this.vault;
        for(const segment of taskPath.split('/')){
            item = item[segment];
        }
        item.metadata[key] = value;
        this.writeVault();
    }

    setTitle(taskPath: string, value: string): void {
        let item: VaultFolder | VaultTask = this.vault;
        for(const segment of taskPath.split('/')){
            item = item[segment];
        }
        item.name = value;
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