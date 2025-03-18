import { Schema } from "mongoose";
import { CategoryType, ScopeType, TechCode, TrendType } from "./constants";

export type UploadTechProfileTechnologiesEntry = {
    techReference: Schema.Types.ObjectId;
    code: TechCode;
    jobs: UploadTechProfileTechnologiesJobEntry[];
    totalMonths?: number;
    recentMonths?: number;
    name: string;
    trend: TrendType;
    category: CategoryType;
    scope: ScopeType;
    inSkillsSection?: boolean;
    inProfileSection?: boolean;
};

export type UploadTechProfileTechnologiesJobEntry = {
    start?: Date;
    end?: Date;
    role: string;
    company: string;
};

export type UploadTechProfileJobEntry =
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

export type UploadTechProfileType = {
    fullName: string;
    technologies: UploadTechProfileTechnologiesEntry[],
    jobs: UploadTechProfileJobEntry[],
    position: string;
};

export type UploadTechProfileResponse = {
    uploadId: string;
    createdAt: string;
    updatedAt: string;
} & UploadTechProfileType;
