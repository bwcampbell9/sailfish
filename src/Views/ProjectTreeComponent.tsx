import { Button, Tree, TreeItem, TreeItemLayout } from "@fluentui/react-components";
import { VaultFolder } from "electron/main/Vault";
import { useEffect, useState } from "react";
import {
    Add16Regular,
    Home24Filled,
    Search24Filled,
    Settings24Filled,
  } from "@fluentui/react-icons";


export const ProjectTreeComponent = () => {
    const [vault, setVault] = useState<VaultFolder>(undefined);

    const openTask = (itemPath) => {
        window.ContextBridge.executeCommand("sailfish.openTask", itemPath);
    }

    useEffect(() => {
        (async () => setVault(await window.ContextBridge.executeCommand("sailfish.getVault") as VaultFolder))();
    }, []);

    const makeFolderComponent = (folderId, children) => (<TreeItem key={folderId} itemType="branch">
        <TreeItemLayout aside={<Button appearance="subtle" onClick={(e) => e.stopPropagation()} shape="circular" size="small" icon={<Add16Regular />} />}>{folderId}</TreeItemLayout>
        {children}
    </TreeItem>);
    const makeItemComponent = (itemId, item) => (<TreeItem onClick={() => openTask(item.path)} key={itemId} itemType="leaf">
        <TreeItemLayout>{item.name}</TreeItemLayout>
    </TreeItem>);

    const buildVaultTree = (folder: VaultFolder) => {
        return (
            <Tree style={{width: "100%"}}>
                {Object.entries(folder).map(([key, value]) => (typeof value?.name === "string" ?
                    makeItemComponent(key, value) :
                    makeFolderComponent(key, buildVaultTree(value as VaultFolder))
                ))}
            </Tree>
        );
    }
    return (<div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
        <div style={{padding: 5, width: "100%"}}>
            <Button style={{margin: 5}} appearance="subtle" shape="circular" size="medium" icon={<Home24Filled />} />
            <Button style={{margin: 5}} appearance="subtle" shape="circular" size="medium" icon={<Search24Filled />} />
            <Button style={{margin: 5}} appearance="subtle" shape="circular" size="medium" icon={<Settings24Filled />} />
        </div>
        {vault ? buildVaultTree(vault) : <div>Loading...</div>}
        <Button style={{margin: 5, flex: "center"}} appearance="subtle" shape="circular" size="medium" icon={<Add16Regular />} />
    </div>);
};
