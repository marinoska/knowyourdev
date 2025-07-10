import {
  GetResumeProfileResponse,
  ResumeProfileTechnologiesEntry,
  TProjectResponse,
  WithCandidateMatch,
} from "@kyd/common/api";

export type TechProfile = Omit<ResumeProfileTechnologiesEntry, "jobs"> & {
  totalMonths: number;
  jobs: {
    start: Date;
    end: Date;
    company: string;
    role: string;
  }[];
};

export type TResumeProfileDTO<T = {}> =
  GetResumeProfileResponse<T>;
export type TProjectDTO = TProjectResponse;
