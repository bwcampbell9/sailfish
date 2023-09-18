import { CardContext } from "@/Views/GridView";
import { useDebounce } from "@/utils";
import { LargeTitle, Textarea } from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";


export const TitleCard = ({context}: {context: CardContext}) => {
    const [text, setText] = useState<string>("Task Title");
    const [editing, setEditing] = useState<boolean>(false);
    const inputRef = useRef(null)
    const debouncedSearch = useDebounce(text, 5000);

    useEffect(() => {
        setText(context?.task?.name || "Task Title")
    }, []);

    useEffect(() => {
        context?.card?.instanceId && context.setTitle(text);
    }, [debouncedSearch]);

    useEffect(() => {
        editing && inputRef.current && inputRef.current.focus();
    }, [editing])


    return (
        editing ? (
            <Textarea ref={inputRef} value={text} onChange={(e, data) => setText(data.value)} onFocus={() => console.log("focus")} onBlur={() => setEditing(false)} style={{width: "100%", height: "100%"}}/>
        ) : (
            <div onClick={() => {
                setEditing(true);
            }}>
                <LargeTitle>{text}</LargeTitle>
            </div>
        )
    );
}