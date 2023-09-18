import { Textarea } from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeHightlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import "highlight.js/styles/base16/edge-dark.css";

export const MarkdownEditor = ({text, onChange}: {text: string, onChange: (newText: string) => void}) => {
    const [editing, setEditing] = useState<boolean>(false);
    const inputRef = useRef(null)

    useEffect(() => {
        editing && inputRef.current && inputRef.current.focus();
    }, [editing])

    return (
        editing ? (
            <Textarea ref={inputRef} value={text} onChange={(e, data) => onChange(data.value)} onFocus={() => console.log("focus")} onBlur={() => setEditing(false)} style={{width: "100%", height: "100%"}}/>
        ) : (
            <div onClick={() => {
                setEditing(true);
            }}
            style={{width: "100%", height: "100%"}}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeHightlight, rehypeKatex]}
                >{text}</ReactMarkdown>
            </div>
        )
    );
}