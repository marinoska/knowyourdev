import {
  GetResumeProfileResponse,
  ResumeProfileTechnologiesEntry,
  TProjectPopulated,
  TProject,
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

export type TResumeProfileDTO<T = object> = GetResumeProfileResponse<T>;
export type TProjectDTO = TProject<string, string>; // all Ids are strings
export type TProjectPopulatedDTO = TProjectPopulated<string>; // all Ids are strings
