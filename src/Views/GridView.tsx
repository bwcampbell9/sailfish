import React, { useEffect, useRef } from "react";
import { Button, Card } from "@fluentui/react-components";
import { Rnd } from "react-rnd";

import "./GridView.css"
import {
    CaretDownRight16Filled,
  } from "@fluentui/react-icons";
import { LayoutCard } from "@/Pages/DashboardPage";
import { VaultTask } from "electron/main/Vault";

const GridWidth = 50;
const GridHeight = 50;

export interface CardContext {
    card: LayoutCard,
    task: VaultTask,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storeMetadata: (key: string, value: any) => void,
    setTitle: (value: string) => void,
}

export const GridView = ({ cards, editing, task, onCardMoved, onCardSized }: {
    cards: LayoutCard[]
    editing: boolean
    task: VaultTask
    onCardMoved?: (card: LayoutCard, NewLocation: {x: number, y: number}) => void
    onCardSized?: (card: LayoutCard, NewSize: {width: number, height: number}) => void
}) => {
    const updatePosition = (card, data) => {
        console.log(data);

        onCardMoved && onCardMoved(card, {
            x: Math.round(data.x / GridWidth),
            y: Math.round(data.y / GridHeight),
        });
    };
    
    const updateSize = (card, ref: HTMLElement) => {
        onCardSized && onCardSized(card, {
            width: Math.round(ref.clientWidth / GridWidth),
            height: Math.round(ref.clientHeight / GridHeight),
        });
    };

    const createCardContext = (card: LayoutCard): CardContext => {
        return {
            card: card,
            task: task,
            storeMetadata: (key: string, value: object) => {window.ContextBridge.executeCommand("sailfish.setTaskMetadata", task.path ,key, value);},
            setTitle: (value: string) => {window.ContextBridge.executeCommand("sailfish.setTaskTitle", task.path, value);},
        }
    };
    
    return (
        <div style={{height: "100%", width: "100%", padding: 10}}>
            <div className="circle-grid" style={{height: "100%", width: "100%", backgroundSize: `${GridWidth}px ${GridHeight}px`}}>
                {cards.map(card => (
                <Rnd className="drag-card" 
                    key={"drag-" + card.instanceId}
                    default={{
                        x: card.layout.x * GridWidth,
                        y: card.layout.y * GridHeight,
                        width: card.layout.width * GridWidth,
                        height: card.layout.height * GridHeight,
                    }}
                    resizeGrid={[GridWidth, GridHeight]}
                    dragGrid={[GridWidth, GridHeight]}
                    disableDragging={!editing}
                    onDragStop={(e, data) => updatePosition(card, data)}
                    onResizeStop={(e, dir, ref) => updateSize(card, ref)}
                    bounds="parent"
                    style={{padding: 5}}
                    enableResizing={{ top:false, right:false, bottom:false, left:false, topRight:editing, bottomRight:editing, bottomLeft:editing, topLeft:editing }}
                    resizeHandleComponent={{
                        bottomRight: <CaretDownRight16Filled primaryFill="#444444"/>
                    }}
                    >
                    <Card className="card" style={{height: "100%", width: "100%"}}>
                        {React.createElement(card.element, { key: card.instanceId, context: createCardContext(card) })}
                    </Card>
                </Rnd>))}
            </div >
        </div>
    );
}