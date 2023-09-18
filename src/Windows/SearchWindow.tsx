import { useDebounce, useIsMounted } from "@/utils";
import { Button, Caption1, Card, CardHeader, Field, Label, Link, Text, useArrowNavigationGroup, useFocusableGroup } from "@fluentui/react-components";
import { SearchBox } from "@fluentui/react-search-preview";
import { useEffect, useRef, useState } from "react";
import {
    MoreHorizontal20Regular,
    ClipboardTask24Filled,
    WindowConsole20Filled,
    Tag24Filled,
} from "@fluentui/react-icons";

import "./SearchWindow.css"

interface SearchResult {
    title: string;
    id: string;
    icon?: string;
    command: string;
    args?: unknown[];
}

const getIconFromName = (name: string) => {
    switch (name) {
        case "task":
            return <ClipboardTask24Filled />
        case "command":
            return <WindowConsole20Filled />
        default:
            return <Tag24Filled />
    }
}

export const ResultCard = ({result, focus}) => {
    return (
        <Card className={`result-card ${focus ? 'result-card-focused' : ''}`}>
        <CardHeader
          image={getIconFromName(result.icon)}
          header={<Text weight="semibold">{result.title}</Text>}
          description={
            <Caption1>Sailfish</Caption1>
          }
          action={
            <Button
                tabIndex={1}
                appearance="transparent"
                icon={<MoreHorizontal20Regular />}
                aria-label="More options"
            />
          }
        />
      </Card>
    )
}

export const SearchWindow = () => {
    const searchRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [searchHasFocus, setSearchHasFocus] = useState<boolean>(true);
    const isMounted = useIsMounted();
    const debouncedSearch = useDebounce(searchTerm, 100);

    useEffect(() => {
        searchRef.current.focus();
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                window.ContextBridge.executeCommand("sailfish.closeSearch");
                event.preventDefault();
            }
         };
         window.addEventListener('keydown', handleEsc);
     
         return () => {
           window.removeEventListener('keydown', handleEsc);
         };
      }, []);

    useEffect(() => { 
        searchTerm ? window.ContextBridge.executeCommand("sailfish.search", searchTerm, 4).then((results: unknown) => {
            isMounted && setResults(results as SearchResult[])
          }) : setResults([]);
    }, [debouncedSearch]);

    const executeResult = (result: SearchResult) => {
        window.ContextBridge.executeCommand(result.command, ...result.args);
        window.ContextBridge.executeCommand("sailfish.closeSearch");
        searchRef.current.focus();
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            executeResult(results[0]);
        }}>
            <Field role="search" style={{width: "100%", overflow: "hidden"}} aria-label="Sailfish Global Search">
                <SearchBox 
                style={{maxWidth: "none", width: "100%"}} 
                size="large" value={searchTerm} 
                onChange={(e, d) => setSearchTerm(d.value)} 
                onBlur={()=> setSearchHasFocus(false)} 
                onFocus={(e)=> {
                    e.target.select();
                    setSearchHasFocus(true)
                }} 
                ref={searchRef} />
            </Field>
            {results.map((result: SearchResult, index) => (
                <a 
                    href="search" 
                    onClick={(e) => {
                        e.preventDefault();
                        executeResult(result);
                    }} 
                    style={{width: "100%"}} key={result.id} 
                    className="search-result-link result-focus" 
                    tabIndex={0}>
                    <ResultCard result={result} focus={searchHasFocus && index === 0}/>
                </a>
            ))}
        </form>
    )
}