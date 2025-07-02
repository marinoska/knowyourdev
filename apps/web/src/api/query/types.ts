import {
  TResumeProfileResponse,
  ResumeTechProfileTechnologiesEntry,
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

export type TResumeProfile = TResumeProfileResponse;
