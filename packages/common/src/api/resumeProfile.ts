import { Schema } from "mongoose";
import { Range } from "../utils/index.js";
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
  uploadId: Schema.Types.ObjectId;
  technologies: ResumeTechProfileTechnologiesEntry[];
  jobs: ResumeTechProfileJobEntry[];
};

export type ActivityPeriod = Range & {
  totalMonths: number;
  technologies: Array<{
    name: string;
    totalMonths: number;
  }>;
};

export type TTechFocusTimeline = {
  periods: ActivityPeriod[];
  years: Record<number, Array<1 | 0>>;
};

export type TTechTimeline = {
  periods: ActivityPeriod[];
  years: Record<number, Array<1 | 0>>;
};

export type TTechFocusUsage = Record<ScopeType, TTechFocusTimeline>;
export type TTechUsage = Record<string, TTechTimeline>;

export type TResumeProfileGaps = {
  jobGaps: GapEntry[];
};

export type TResumeProfileJobDuration = {
  averageJobDuration: number;
};

export type TResumeProfileCategories = {
  softwareDevelopmentJobs: ResumeTechProfileJobEntry[];
  irrelevantJobs: ResumeTechProfileJobEntry[];
  jobsWithMissingTech: ResumeTechProfileJobEntry[];
  jobsWithFilledTech: ResumeTechProfileJobEntry[];
  earliestJobStart: Date;
};

export type TResumeProfileTechFocusUsage = {
  techFocusUsage: TTechFocusUsage;
};

export type TResumeProfileTechUsage = {
  techUsage: TTechUsage;
};

export type TResumeProfileMetrics = TResumeProfileGaps &
  TResumeProfileJobDuration &
  TResumeProfileCategories &
  TResumeProfileTechFocusUsage &
  TResumeProfileTechUsage;

export type GetResumeProfileResponse = Omit<TResumeProfile, "uploadId"> & {
  uploadId: string;
  createdAt: string;
  updatedAt: string;
} & TResumeProfileMetrics;
