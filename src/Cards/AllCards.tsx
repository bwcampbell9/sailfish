import { ComponentClass, FunctionComponent } from "react";
import { SkeletonCard } from "./SkeletonCard";
import { MarkdownCard } from "./MarkdownCard";
import { GitCard } from "./GitCard";
import { DescriptionCard } from "./DescriptionCard";
import { TitleCard } from "./TitleCard";

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
        name: 'Sailfish Default',
        id: "sailfish",
        cards: [
            {
                name: 'Title Card',
                id: 'title-card',
                description: 'The task title',
                component: TitleCard,
            },
            {
                name: 'Description Card',
                id: 'description-card',
                description: 'The task description in markdown',
                component: DescriptionCard,
            },
            {
                name: 'Markdown Card',
                id: 'markdown-card',
                description: 'Renders markdown text',
                component: MarkdownCard,
            },
            {
                name: 'Git Card',
                id: 'git-card',
                description: 'exposes git functionality',
                component: GitCard,
            },
        ],
    }
]