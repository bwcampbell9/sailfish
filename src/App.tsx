import { FluentProvider } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { ThemeMapping, ThemeName, getThemeName } from "./Themes";
import '../node_modules/dockview/dist/styles/dockview.css';
import { Route, Routes, useLocation } from "react-router";
import { MainWindow } from "./Windows/MainWindow";
import { SearchWindow } from "./Windows/SearchWindow";
    
export const App = () => {
    const [themeName, setThemeName] = useState<ThemeName>(getThemeName());

    useEffect(() => {
        window.ContextBridge.reactAppStarted();
        window.ContextBridge.onNativeThemeChanged(() => setThemeName(getThemeName()));
    }, []);

    const location = useLocation();
    console.log(location);

    return (
        <FluentProvider theme={ThemeMapping[themeName]} style={{ height: "100vh", width: "100vw", backgroundColor: "transparent" }}>
            <Routes>
                <Route key={'main'} path={'/'} element={<MainWindow/>} />
                <Route key={'search'} path={'/search'} element={<SearchWindow/>} />
            </Routes>
        </FluentProvider>
    );
};
