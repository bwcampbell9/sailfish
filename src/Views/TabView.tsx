import { DashboardPage } from "@/Pages/DashboardPage";
import { DockviewReact, DockviewReadyEvent, IDockviewPanelProps } from "dockview";
import { VaultTask } from "electron/main/Vault";

const components = {
    body: (props: IDockviewPanelProps<{ title: string }>) => {
        return (
            <DashboardPage/>
        );
    },
    home: (props: IDockviewPanelProps<{ title: string }>) => {
        return (
            <DashboardPage/>
        )
    },
};

const HomePanel = {
    id: "home_panel",
    component: "home",
    params: { title: "Home" },
}

export const TabView = (props) => {
    const onReady = (event: DockviewReadyEvent) => {
        event.api.onDidRemovePanel(() => {
            console.log(event.api.panels.length);
            if(event.api.panels.length === 0) {
                event.api.addPanel(HomePanel);
            }
        }),

        window.ContextBridge.handleCommand('sailfish.openTask', (e, task: VaultTask) => {
            console.log(task.name);
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
        event.api.addPanel(HomePanel);
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