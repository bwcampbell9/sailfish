import { Tab, TabList } from "@fluentui/react-components";
import {
    CalendarMonthRegular,
    CalendarMonthFilled,
    bundleIcon,
  } from "@fluentui/react-icons";

  import {
      DockviewReact,
      DockviewReadyEvent,
      IDockviewPanelProps,
    } from 'dockview';
    import '../../node_modules/dockview/dist/styles/dockview.css';
import { ProjectTreeComponent } from "../Views/ProjectTreeComponent";
import { DashboardPage } from "../Pages/DashboardPage";
    
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

const components = {
    tray: (props: IDockviewPanelProps<{ title: string }>) => {
        props.api.group.api.setConstraints({minimumWidth: 0})
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
            <DashboardPage/>
        );
    },
};


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
        <div style={{ height: "100%", width: "100%", boxSizing: "border-box", overflowY: "auto" }}>
            <DockviewReact
            components={components}
            onReady={onReady}
            className={'dockview-theme-abyss'}
            />
        </div>
    );
};
