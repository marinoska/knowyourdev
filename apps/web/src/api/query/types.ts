import {
  GetResumeProfileResponse,
  ResumeTechProfileTechnologiesEntry,
  TProjectResponse,
} from "@kyd/common/api";

export type TechProfile = Omit<ResumeTechProfileTechnologiesEntry, "jobs"> & {
  totalMonths: number;
  jobs: {
    start: Date;
    end: Date;
    company: string;
    role: string;
  }[];
};

export type TResumeProfile = GetResumeProfileResponse;
export type TProject = TProjectResponse;
