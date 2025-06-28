import { Schema } from "mongoose";
import { CategoryType, ScopeType, TechCode, TrendType } from "./constants.js";
import { ExtractedCVData, JobEntry } from "./resumeData.js";

export type ResumeTechProfileTechnologiesEntry = {
  techReference: Schema.Types.ObjectId;
  code: TechCode;
  jobs: ResumeTechProfileTechnologiesJobEntry[];
  totalMonths?: number;
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
  start?: Date;
  end?: Date;
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

export type ResumeTechProfileType = Pick<
  ExtractedCVData,
  "position" | "fullName"
> & {
  technologies: ResumeTechProfileTechnologiesEntry[];
  jobs: ResumeTechProfileJobEntry[];
};

export type ResumeTechProfileResponse = {
  uploadId: string;
  createdAt: string;
  updatedAt: string;
} & ResumeTechProfileType;
