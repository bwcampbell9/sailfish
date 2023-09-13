import { FluentProvider, Tab, TabList } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { pages } from "./Pages";
import { ThemeMapping, ThemeName, getThemeName } from "./Themes";
import {
    DockviewReact,
    DockviewReadyEvent,
    IDockviewPanelProps,
} from 'dockview';
import '../node_modules/dockview/dist/styles/dockview.css';

const components = {
    tray: (props: IDockviewPanelProps<{ title: string }>) => {
        props.api.setSize({ width: 50 })
        return (
            <div style={{ padding: '20px', color: 'white' }}>
                {props.params.title}
            </div>
        );
    },
    tree: (props: IDockviewPanelProps<{ title: string }>) => {
        props.api.setSize({ width: 150 })
        return (
            <div style={{ padding: '20px', color: 'white' }}>
                {props.params.title}
            </div>
        );
    },
    body: (props: IDockviewPanelProps<{ title: string }>) => {
        return (
            <div style={{ padding: '20px', color: 'white' }}>
                {props.params.title}
            </div>
        );
    },
};


export const App = () => {
    const [themeName, setThemeName] = useState<ThemeName>(getThemeName());

    useEffect(() => {
        window.ContextBridge.reactAppStarted();
        window.ContextBridge.onNativeThemeChanged(() => setThemeName(getThemeName()));
    }, []);

    const onReady = (event: DockviewReadyEvent) => {
        const tray = event.api.addPanel({
            id: "tray",
            component: "tray",
            params: { title: "Tray" }
        });
        tray.group.locked = true;
        tray.group.header.hidden = true;

        const treeView = event.api.addPanel({
            id: "panel_1",
            component: "tree",
            position: { referencePanel: 'tray', direction: 'right' },
            params: { title: "Panel 1" }
        });

        treeView.group.header.hidden = true;
        treeView.group.locked = true;
      
        event.api.addPanel({
            id: "panel_2",
            component: "body",
            position: { referencePanel: 'panel_1', direction: 'right' },
            params: { title: "Panel 2" }
        });
    };

    return (
        <FluentProvider theme={ThemeMapping[themeName]} style={{ height: "100vh", width: "100vw" }}>
            <div style={{ height: "100%", width: "100%", boxSizing: "border-box", overflowY: "auto" }}>
                <DockviewReact
                components={components}
                onReady={onReady}
                className={'dockview-theme-abyss'}
                />
            </div>
        </FluentProvider>
    );
};
