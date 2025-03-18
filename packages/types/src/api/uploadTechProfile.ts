import { Schema } from "mongoose";
import { CategoryType, ScopeType, TechCode, TrendType } from "./constants";

export type TechProfileTechnologiesEntry = {
    techReference: Schema.Types.ObjectId;
    code: TechCode;
    jobs: TechProfileTechnologiesJobEntry[];
    totalMonths?: number;
    recentMonths?: number;
    name: string;
    trend: TrendType;
    category: CategoryType;
    scope: ScopeType;
    inSkillsSection?: boolean;
    inProfileSection?: boolean;
};

export type TechProfileTechnologiesJobEntry = {
    start?: Date;
    end?: Date;
    role: string;
    company: string;
};

export type TechProfileJobEntry =
// Pick<
//     JobEntry,
//     "job"
//     | "summary"
//     | "months"
//     | "present"
//     | "role"
//     | "roleType"
//     | "isSoftwareDevelopmentRole"
//     | "softwareDevelopmentScope"
// >
// &
    {
        start?: Date;
        end?: Date;
        months: number;
        popularity?: number;
        trending?: number;
        techStack?: {
            ref: Schema.Types.ObjectId;
            name: string;
            popularity: number;
            trending: number;
        };
        technologies: {
            ref: Schema.Types.ObjectId;
            name: string;
            popularity: number;
            trending: number;
        }[]
    };

export type TechProfileType = {
    fullName: string;
    technologies: TechProfileTechnologiesEntry[],
    jobs: TechProfileJobEntry[],
    position: string;
};