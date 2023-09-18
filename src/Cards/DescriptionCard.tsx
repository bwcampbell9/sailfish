import { MarkdownEditor } from "@/Atoms/MarkdownEditor"
import { CardContext } from "@/Views/GridView";
import { useDebounce } from "@/utils";
import { Title1 } from "@fluentui/react-components";
import { useEffect, useState } from "react";


export const DescriptionCard = ({context}: {context: CardContext}) => {
    const [text, setText] = useState<string>("# Heading\ntext");
    const debouncedSearch = useDebounce(text, 5000);

    console.log(context?.task?.metadata?.["description"]);        
    useEffect(() => {
        setText(context?.task?.metadata?.["description"] || "")
    }, []);

    useEffect(() => {
        context?.card?.instanceId && context.storeMetadata("description", text);
    }, [debouncedSearch]);

    return (
        <div
            style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}
        >
            <Title1 style={{marginBottom: 10}}>Description:</Title1>
            <MarkdownEditor text={text} onChange={setText}/>
        </div>
    )
}