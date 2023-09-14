import { GridView } from "@/Views/GridView";
import { Button, ToggleButton, Card, Subtitle1, Divider, Subtitle2Stronger, Caption1Stronger} from "@fluentui/react-components";
import {
    Add24Filled,
    Edit24Filled,
    Dismiss24Regular
} from "@fluentui/react-icons";
import React, { ComponentClass, FunctionComponent } from "react";
import {
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    DrawerOverlay,
    DrawerProps,
  } from "@fluentui/react-components/unstable";
import { nanoid } from 'nanoid'
import { AllCards, ReactElement } from "@/Cards/AllCards";
import { Rnd } from "react-rnd";
import "./DashboardPage.css"

export const DashboardPage = () => {

    const [cards, setCards] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [editing, setEditing] = React.useState(false);

    const onClickAddComponent = React.useCallback(() => {
        setIsOpen(true);
    }, []);

    const addCardToView = (element: ReactElement, id: string) => {
        setCards([...cards, {element, id}]);
    }

    const getCardGroups = () => AllCards.map(cardGroup => {
            return (
                <div style={{marginTop: 20}} key={cardGroup.id}>
                    <Subtitle1>{cardGroup.name}</Subtitle1>
                    {cardGroup.cards.map(card =>(
                        <div key={card.id} style={{display: "flex", flexDirection: "column", marginTop: 10}}>
                            <Subtitle2Stronger>{card.name}</Subtitle2Stronger>
                            <Caption1Stronger style={{marginBottom: 10}}>{card.description}</Caption1Stronger>
                            <div className="card-shop-container" style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10}}>
                                <Button style={{marginRight: 10}} onClick={() => addCardToView(card.component, card.id + "-" + nanoid())} size="large" shape="circular" appearance="subtle" icon={<Add24Filled />}/>
                                <Card className="card-shop-card" style={{height: "100%", width: "100%"}}>
                                    {React.createElement(card.component)}
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            )
        });

    return (
        <div style={{ width: "100%", height: "100%", }}>
            <DrawerOverlay
                position={"end"}
                modalType="non-modal"
                size="medium"
                open={isOpen}
                onOpenChange={(_, { open }) => setIsOpen(open)}
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={<Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Dismiss24Regular />}
                            onClick={() => setIsOpen(false)} />}
                    >
                        Add Card
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody>
                    <Divider/>
                    {getCardGroups()}
                </DrawerBody>
            </DrawerOverlay>
            <div style={{ padding: 5, display: "flex", alignItems: "center", justifyContent: "end" }}>
                <ToggleButton checked={editing} onClick={() => setEditing(!editing)} shape="circular" appearance={editing? "primary" : "subtle"} icon={<Edit24Filled />} />
                {editing && <Button style={{marginLeft: 5}} onClick={onClickAddComponent} shape="circular" appearance="subtle" icon={<Add24Filled />} />}
            </div>
            <GridView cards={cards} editing={editing}/>
        </div>
    );
};
