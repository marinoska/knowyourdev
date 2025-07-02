import { Schema } from "mongoose";
import { CategoryType, ScopeType, TechCode, TrendType } from "./constants.js";
import { ExtractedCVData, GapEntry, JobEntry } from "./resumeData.js";

export type ResumeTechProfileTechnologiesEntry = {
  techReference: Schema.Types.ObjectId;
  code: TechCode;
  jobs: ResumeTechProfileTechnologiesJobEntry[];
  totalMonths: number;
  recentMonths?: number;
  name: string;
  trend: TrendType;
  popularity: number;
  category: CategoryType;
  scope: ScopeType;
  inSkillsSection?: boolean;
  inProfileSection?: boolean;
};

export type ResumeTechProfileTechnologiesJobEntry = {
  start: Date;
  end: Date;
  role: string;
  company: string;
};

export type ResumeTechProfileJobEntry = Pick<
  JobEntry,
  | "isSoftwareDevelopmentRole"
  | "roleType"
  | "present"
  | "role"
  | "job"
  | "months"
> & {
  start: Date;
  end: Date;
  popularity?: number;
  trending?: number;
  summary: string;
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
  }[];
};

export type TResumeProfile = Pick<ExtractedCVData, "position" | "fullName"> & {
  technologies: ResumeTechProfileTechnologiesEntry[];
  jobs: ResumeTechProfileJobEntry[];
};

export type ScopePeriod = {
  start: Date;
  end: Date;
  totalMonths: number;
  technologies: Array<{
    name: string;
    totalMonths: number;
  }>;
};

export type TScopeActivity = {
  periods: ScopePeriod[];
  years: Record<number, Array<1 | 0>>;
};

export type TScopes = Record<ScopeType, TScopeActivity>;

export type TResumeProfileBaseResponse = TResumeProfile & {
  uploadId: string;
  createdAt: string;
  updatedAt: string;
};

export type TResumeProfileGaps = {
  jobGaps: GapEntry[];
};

export type TResumeProfileCategories = {
  softwareDevelopmentJobs: ResumeTechProfileJobEntry[];
  irrelevantJobs: ResumeTechProfileJobEntry[];
  jobsWithMissingTech: ResumeTechProfileJobEntry[];
  jobsWithFilledTech: ResumeTechProfileJobEntry[];
  earliestJobStart: Date;
};

export type TResumeProfileScopes = {
  scopes: TScopes;
};

export type TResumeProfileResponse = TResumeProfileBaseResponse &
  TResumeProfileGaps &
  TResumeProfileCategories &
  TResumeProfileScopes;
