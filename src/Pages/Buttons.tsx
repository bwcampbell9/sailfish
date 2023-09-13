/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Text } from "@fluentui/react-components";
import { AddCircle24Regular } from "@fluentui/react-icons";
import { Section } from "./Section";
import { useEffect, useState } from "react";
import CardComponent from "@/Views/CardComponent";

export const Buttons = () => {
    const [message, setMessage] = useState<string>("no message yet");

    useEffect(() => {
        window.ContextBridge.executeCommand("sailfish.renderCard", "ado.skeletonCard", "card-tst");
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 10, boxSizing: "border-box" }}>
            <Text size={600}>Buttons</Text>
            <Section
                title={message}
                content={
                    <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                        <Button shape="circular" onClick={() =>  window.ContextBridge.executeCommand("ado.helloWorld", "circular button").then(m => setMessage(m as string))}>Circular</Button>
                        <Button shape="rounded" onClick={() => window.ContextBridge.executeCommand("ado.helloWorld", "rounded button").then(m => setMessage(m as string))}>Rounded</Button>
                        <Button shape="square" onClick={() => window.ContextBridge.executeCommand("ado.helloWorld", "square button").then(m => setMessage(m as string))}>Square</Button>
                    </div>
                }
            />
            <Section
                title="Appearance"
                content={<div id="card-tst"/>}
            />
            <Section
                title="Icons"
                content={
                    <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                        <Button icon={<AddCircle24Regular />} iconPosition="before">
                            Icon before
                        </Button>
                        <Button icon={<AddCircle24Regular />} iconPosition="after">
                            Icon after
                        </Button>
                        <Button icon={<AddCircle24Regular />} />
                    </div>
                }
            />
            <Section
                title="Size"
                content={
                    <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "row", gap: 10 }}>
                        <Button size="small">Small</Button>
                        <Button size="medium">Medium</Button>
                        <Button size="large">Large</Button>
                    </div>
                }
            />
            <Section
                title="Disabled"
                content={
                    <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "row", gap: 10 }}>
                        <Button>Enabled</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                }
            />
        </div>
    );
};
