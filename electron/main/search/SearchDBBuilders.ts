import { VaultFolder, VaultTask } from "../Vault";
import { SearchResultDB } from "./search";


export const buildVaultSearchDB = (folder: VaultFolder): SearchResultDB => {
    return Object.values(folder).reduce((accumulator: SearchResultDB, value) => (typeof value?.name === "string" ?
        {...accumulator, [(value as VaultTask).path]: {
            title: value.name,
            icon: 'task',
            command: 'sailfish.openTask',
            args: [value.path]
        }} :
        {...accumulator, ...buildVaultSearchDB(value as VaultFolder)}
    ), {})
}