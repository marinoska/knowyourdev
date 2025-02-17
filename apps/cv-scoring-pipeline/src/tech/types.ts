import { Document, Schema } from "mongoose";

export const TREND = ['SD', 'D', 'S', 'T', 'HT'] as const;  //string decline, decline, steady, trending, highly trending
export const CATEGORY = ['Lang', 'DB', 'Framework', 'Tool', 'Other-FW', 'Cloud'] as const;
export type TrendType = typeof TREND;
export type CategoryType = typeof CATEGORY;
export type TechDocument = Document & {
    _id: Schema.Types.ObjectId;
    name: string;
    code: string;
    usage2024?: number;
    usage2016?: number;
    trend: TrendType;
    category: CategoryType;
}

export const TECH_STACK_CATEGORY =
    [
        'Full-Stack Development',
        "Backend Development",
        "Mobile Development (Cross-Platform)",
        "Mobile Development (iOS)",
        "Mobile Development (Android)",
        "Mobile Development (Hybrid)",
        "Front-End Development",
        "Enterprise Development",
        "CMS",
    ] as const;

export type TechStackCategory = typeof TECH_STACK_CATEGORY;

export type TechStackDocument = Document & {
    _id: Schema.Types.ObjectId;
    name: string;
    recommended: number;
    components: {
        'and': TechDocument["code"][],
        'or': TechDocument["code"][][]
    },
    trend: TrendType;
    popularity: number;
    languages: TechDocument["code"][];
    relations: TechDocument["code"][];
    category: CategoryType;
    description: string;
    useCases: string;
    purpose: string;
    frontEnd: string;
    bestFor: string;
    typicalUseCases: string;
}