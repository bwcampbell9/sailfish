import { GridView } from "@/Views/GridView";
import { Button, ToggleButton, Card, Subtitle1, Divider, Subtitle2Stronger, Caption1Stronger} from "@fluentui/react-components";
import {
    Add24Filled,
    Edit24Filled,
    Dismiss24Regular
} from "@fluentui/react-icons";
import React, { useEffect } from "react";
import {
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    DrawerOverlay,
  } from "@fluentui/react-components/unstable";
import { nanoid } from 'nanoid'
import { AllCards, ReactElement } from "@/Cards/AllCards";
import { LayoutDimensions, Layouts } from "../../electron/base-extensions/LayoutManager/LayoutManager"
import "./DashboardPage.css"
import { useIsMounted } from "@/utils";
import { VaultTask } from "electron/main/Vault";

export interface LayoutCard {
    instanceId: string;
    element: ReactElement;
    layout: LayoutDimensions
}

export const DashboardPage = ({layoutPath, task}: {layoutPath: string, task?: VaultTask}) => {

    const [cards, setCards] = React.useState<LayoutCard[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [editing, setEditing] = React.useState(false);
    const [resolvedLayoutPath, setResolvedLayoutPath] = React.useState(":default");
    const isMounted = useIsMounted();

    const setLayout = (layout: Layouts) => {
        // TODO: make layouts responsive by chosing correct one here
        layout && Object.values(layout)[0] &&
        setCards(Object.entries(Object.values(layout)[0])?.map(([key, value]: [ string, LayoutDimensions ]) => {
            // Layout fullCard Id is cardGroup.cardId
            const cardGroup = value.typeId.slice(0, key.indexOf('.'));
            const cardId = value.typeId.slice(key.indexOf('.') + 1);
            return {
                instanceId: key,
                element: AllCards.find(c => c.id === cardGroup).cards.find(c => c.id === cardId).component,
                layout: value,
            }
        }));
    }

    useEffect(() => {
        console.log(layoutPath);
        console.log(task);
        window.ContextBridge.executeCommand("layout-manager.getTaskLayout", layoutPath)
        .then(([resolvedPath, result]: [string, Layouts]) => {
            isMounted && setLayout(result);
            isMounted && setResolvedLayoutPath(resolvedPath);
          })
    }, [layoutPath])

    const onClickAddComponent = React.useCallback(() => {
        setIsOpen(true);
    }, []);

    const addNewCardToView = (element: ReactElement, typeId: string) => {
        const newLayout = {
            typeId: typeId,
            x: 0,
            y: 0,
            width: 8,
            height: 5,
        }
        const newId = typeId + "-" + nanoid();
        window.ContextBridge.executeCommand("layout-manager.setTaskLayout", resolvedLayoutPath, 0, newId, newLayout);
        setCards([...cards, {element, instanceId: newId, layout: newLayout}]);
    }

    // TODO: when using reactive size update it in these too
    const handleCardMoved = (card: LayoutCard, position: {x: number, y: number}) => {
        window.ContextBridge.executeCommand("layout-manager.setTaskLayout", resolvedLayoutPath, 0, card.instanceId, position);
    };
    
    const handleCardSized = (card: LayoutCard, size: {width: number, height: number}) => {
        window.ContextBridge.executeCommand("layout-manager.setTaskLayout", resolvedLayoutPath, 0, card.instanceId, size);
    };

    const getCardGroups = () => AllCards.map(cardGroup => {
            return (
                <div style={{marginTop: 20}} key={cardGroup.id}>
                    <Subtitle1>{cardGroup.name}</Subtitle1>
                    {cardGroup.cards.map(card =>(
                        <div key={card.id} style={{display: "flex", flexDirection: "column", marginTop: 10}}>
                            <Subtitle2Stronger>{card.name}</Subtitle2Stronger>
                            <Caption1Stronger style={{marginBottom: 10}}>{card.description}</Caption1Stronger>
                            <div className="card-shop-container" style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10}}>
                                <Button style={{marginRight: 10}} onClick={() => addNewCardToView(card.component, cardGroup.id + "." + card.id)} size="large" shape="circular" appearance="subtle" icon={<Add24Filled />}/>
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
            <GridView cards={cards} editing={editing} task={task} onCardMoved={handleCardMoved} onCardSized={handleCardSized}/>
        </div>
    );
};
