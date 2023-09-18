import { DashboardPage } from "@/Pages/DashboardPage";
import { DockviewApi, DockviewReact, DockviewReadyEvent, IDockviewPanelProps } from "dockview";
import { VaultTask } from "electron/main/Vault";

const components = {
    body: (props: IDockviewPanelProps<VaultTask>) => {
        return (
            <DashboardPage layoutPath={props.params.path} task={props.params}/>
        );
    },
    home: (props: IDockviewPanelProps<VaultTask>) => {
        return (
            <DashboardPage layoutPath={":dashboard"} task={props.params}/>
        )
    },
};


export const TabView = (props) => {
    const addHomePanel = async (api: DockviewApi) => api.addPanel({
            id: "home_panel",
            component: "home",
            params: await window.ContextBridge.executeCommand('sailfish.getTask', ":dashboard"),
        });

    const onReady = (event: DockviewReadyEvent) => {
        event.api.onDidRemovePanel(() => {
            if(event.api.panels.length === 0) {
                addHomePanel(event.api);
            }
        }),

        window.ContextBridge.handleCommand('sailfish.openTask', (e, task: VaultTask) => {
            const existingPanel = event.api.getPanel(task.path);
            if(existingPanel) {
                existingPanel.api.setActive();
            } else {
                const newPanel = event.api.addPanel({
                    id: task.path,
                    title: task.name,
                    component: "body",
                    params: task,
                });
                newPanel.api.setActive();
            }
        });

        addHomePanel(event.api)
    };

    return (
        <DockviewReact
        components={components}
        onReady={onReady}
        className={'dockview-theme-abyss'}
        singleTabMode="fullwidth"
        />
    );
}