import { Tab, TabList } from "@fluentui/react-components";
import {
    CalendarMonthRegular,
    CalendarMonthFilled,
    bundleIcon,
    LineHorizontal120Regular,
  } from "@fluentui/react-icons";

  import {
      DockviewReact,
      DockviewReadyEvent,
      IDockviewPanelProps,
    } from 'dockview';
    import '../../node_modules/dockview/dist/styles/dockview.css';
import { ProjectTreeComponent } from "../Views/ProjectTreeComponent";
import { TabView } from "@/Views/TabView";
import './MainWindow.css'

export interface TaskMetadata {
    id: string;
    name: string;
}

const CalendarMonth = bundleIcon(CalendarMonthFilled, CalendarMonthRegular);
const renderTabs = () => {
    return (
      <>
        <Tab icon={<CalendarMonth />} value="tab1" aria-label="First Tab" />
        <Tab icon={<CalendarMonth />} value="tab2" aria-label="Second Tab" />
        <Tab icon={<CalendarMonth />} value="tab3" aria-label="Third Tab" />
        <Tab icon={<CalendarMonth />} value="tab4" aria-label="Fourth Tab" />
      </>
    );
};

const Watermark = () => {
    return (<div style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    }}>No views to show</div>)
}

const DragTab = () => (
    <div style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    }}><LineHorizontal120Regular /></div>
);

const components = {
    tray: (props: IDockviewPanelProps<{ title: string }>) => {
        props.api.group.api.setConstraints({minimumWidth: 0, maximumWidth: 60})
        props.api.setSize({width: 60})
        return (
            <TabList style={{padding: 10}} defaultSelectedValue="tab1" vertical size="large">
                {renderTabs()}
            </TabList>
        );
    },
    tree: (props: IDockviewPanelProps<{ title: string }>) => {
        props.api.setSize({ width: 150 })
        return (
            <ProjectTreeComponent />
        );
    },
    body: (props: IDockviewPanelProps<{ title: string }>) => {
        return (
            <TabView/>
        );
    },
    watermark: (props: IDockviewPanelProps<{ title: string }>) => {
        return (
            <Watermark/>
        );
    },
};

const tabComponents = {
    dragTab: DragTab,
}

export const MainWindow = () => {
    const onReady = (event: DockviewReadyEvent) => {
        const tray = event.api.addPanel({
            id: "tray",
            component: "tray",
            params: { title: "Tray" }
        });
        tray.group.locked = true;
        tray.group.header.hidden = true;

        const treeView = event.api.addPanel({
            id: "tree-view",
            component: "tree",
            position: { referencePanel: 'tray', direction: 'right' },
            params: { title: "Panel 1" }
        });

        treeView.group.header.hidden = true;
        treeView.group.locked = true;
        
        const mainPanel = event.api.addPanel({
            id: "body",
            component: "body",
            tabComponent: "dragTab",
            position: { referencePanel: 'tree-view', direction: 'right' },
            params: { title: "Panel 2" }
        });
        mainPanel.group.locked = true;
    };

    return (
        <div style={{ height: "100%", width: "100%", boxSizing: "border-box", overflowY: "auto" }}>
            <DockviewReact
            components={components}
            onReady={onReady}
            tabComponents={tabComponents}
            className={'dockview-theme-abyss skinny-tabs'}
            watermarkComponent={Watermark}
            singleTabMode="fullwidth"
            />
        </div>
    );
};
