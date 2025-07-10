import { Schema } from "mongoose";
import { Range } from "../utils/index.js";
import { CategoryType, ScopeType, TechCode, TrendType } from "./constants.js";
import { ExtractedCVData, GapEntry, JobEntry } from "./resumeData.js";
import { TCandidateMatch } from "./match.js";

export type ResumeProfileTechnologiesEntry = {
  techReference: Schema.Types.ObjectId;
  code: TechCode;
  jobs: ResumeProfileTechnologiesJobEntry[];
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

export type ResumeProfileTechnologiesJobEntry = {
  start: Date;
  end: Date;
  role: string;
  company: string;
};

export type ResumeProfileJobEntry = Pick<
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
  technologies: ResumeProfileTechnologiesEntry[];
  jobs: ResumeProfileJobEntry[];
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
  softwareDevelopmentJobs: ResumeProfileJobEntry[];
  irrelevantJobs: ResumeProfileJobEntry[];
  jobsWithMissingTech: ResumeProfileJobEntry[];
  jobsWithFilledTech: ResumeProfileJobEntry[];
  earliestJobStart: Date;
  monthsActiveInSE: number;
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

export type WithCandidateMatch = {
  match: TCandidateMatch;
};

export type GetResumeProfileResponse<T = {}> = Omit<
  TResumeProfile,
  "uploadId"
> & {
  uploadId: string;
  createdAt: string;
  updatedAt: string;
} & T &
  TResumeProfileMetrics;
