import { ComponentClass, FunctionComponent } from "react";
import { SkeletonCard } from "./SkeletonCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactElement = string | FunctionComponent<any> | ComponentClass<any, any>;

interface CardViewInfo {
    name: string;
    id: string;
    description?: string;
    component: ReactElement;
}

interface CardVeiwGroup {
    name: string;
    id: string;
    cards: CardViewInfo[]
}


export const AllCards: CardVeiwGroup[] = [
    {
        name: 'Test Cards',
        id: 'test-cards',
        cards: [
            {
                name: 'Skeleton Card',
                id: 'skeleton-card',
                description: 'Renders a simple skeleton for testing card layouts',
                component: SkeletonCard,
            },
            {
                name: 'Skeleton Card 2',
                id: 'skeleton-card-2',
                description: 'Renders a simple skeleton for testing card layouts but now there are two',
                component: SkeletonCard,
            }
        ],
    },
    {
        name: 'Test Cards 2',
        id: "test-cards-2",
        cards: [
            {
                name: 'Skeleton Card 3',
                id: 'skeleton-card-3',
                description: 'Renders a simple skeleton for testing card layouts 3?',
                component: SkeletonCard,
            },
            {
                name: 'Skeleton Card 4',
                id: 'skeleton-card-4',
                description: 'Renders a simple skeleton for testing card layouts but now there are four',
                component: SkeletonCard,
            }
        ],
    }
]