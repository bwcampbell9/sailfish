import React, { useEffect, useRef } from "react";
import { Button, Card } from "@fluentui/react-components";
import { Rnd } from "react-rnd";

import "./GridView.css"
import { SkeletonCard } from "@/Cards/SkeletonCard";
import {
    CaretDownRight16Filled,
  } from "@fluentui/react-icons";


export const GridView = ({ cards, editing }) => {
    console.log(editing);
    return (
        <div style={{height: "100%", width: "100%", padding: 10}}>
            <div className="circle-grid" style={{height: "100%", width: "100%", backgroundSize: "50px 50px"}}>
                {cards.map(card => (
                <Rnd className="card" 
                    key={"drag-" + card.id}
                    default={{
                        x: 0,
                        y: 0,
                        width: 300,
                        height: 200,}}
                    resizeGrid={[50, 50]}
                    dragGrid={[50, 50]}
                    disableDragging={!editing}
                    
                    bounds="parent"
                    style={{padding: 5}}
                    enableResizing={{ top:false, right:false, bottom:false, left:false, topRight:editing, bottomRight:editing, bottomLeft:editing, topLeft:editing }}
                    resizeHandleComponent={{
                        bottomRight: <CaretDownRight16Filled primaryFill="#444444"/>
                    }}
                    >
                    <Card style={{height: "100%", width: "100%"}}>
                        {React.createElement(card.element, { key: card.id })}
                    </Card>
                </Rnd>))}
            </div >
        </div>
    );
}