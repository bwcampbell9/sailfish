import { MarkdownEditor } from "@/Atoms/MarkdownEditor"
import { CardContext } from "@/Views/GridView";
import { useDebounce } from "@/utils";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";


export const MarkdownCard = ({context}: {context: CardContext}) => {
    const [text, setText] = useState<string>("# Heading\ntext");
    const debouncedSearch = useDebounce(text, 5000);
    
    useEffect(() => {
        setText(context?.task?.metadata?.[context?.card?.instanceId + "-textMD"] || "")
    }, []);
    
    useEffect(() => {
        context?.card?.instanceId && context.storeMetadata(context.card.instanceId + "-textMD", text);
    }, [debouncedSearch]);

    if(!context) {
        return <ReactMarkdown>{"# Markdown card\nPut whatever *markdown* **you** want!"}</ReactMarkdown>
    }

    return (
        <MarkdownEditor text={text} onChange={setText}/>
    )
}