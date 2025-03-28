import { CategoryType, ScopeType, TechCode, TrendType } from "./constants.js";

export type TechCodeType = string;
export type TechType = {
    name: string;
    code: TechCodeType;
    usage2024?: number;
    usage2016?: number;
    trend: TrendType;
    category: CategoryType;
    scope: ScopeType;
};

export type TechStack = {
    stackName: string,
    matchedComponents: TechCode[],
    matchPercentage: number
}