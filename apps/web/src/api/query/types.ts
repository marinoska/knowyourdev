import {
  GetResumeProfileResponse,
  ResumeProfileTechnologiesEntry,
  TProjectResponse,
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

export type TResumeProfileDTO<WithMatch extends boolean = false> =
  GetResumeProfileResponse<WithMatch>;
export type TProjectDTO = TProjectResponse;
