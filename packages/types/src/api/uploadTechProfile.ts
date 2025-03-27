import { Schema } from "mongoose";
import { CategoryType, ScopeType, TechCode, TrendType } from "./constants";
import { ExtractedCVData, JobEntry } from "./uploadedData";

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
    Pick<JobEntry, 'isSoftwareDevelopmentRole' | 'roleType' | 'present' | 'role' | 'job' | 'months' | 'start' | 'end'>
    & {
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

export type UploadTechProfileType =
    Pick<ExtractedCVData, 'position' | 'fullName'> & {
    technologies: UploadTechProfileTechnologiesEntry[],
    jobs: UploadTechProfileJobEntry[],
};

export type UploadTechProfileResponse = {
    uploadId: string;
    createdAt: string;
    updatedAt: string;
} & Partial<UploadTechProfileType>;
