import {
  GapEntry,
  ResumeTechProfileJobEntry,
  TResumeProfileResponse,
  ResumeTechProfileTechnologiesEntry,
} from "@kyd/common/api";

export type Job = Omit<ResumeTechProfileJobEntry, "start" | "end"> & {
  start: Date;
  end: Date;
};

export type TechProfile = Omit<ResumeTechProfileTechnologiesEntry, "jobs"> & {
  totalMonths: number;
  jobs: {
    start: Date;
    end: Date;
    company: string;
    role: string;
  }[];
};

export type ProcessedUploadProfile = Omit<
  TResumeProfileResponse,
  "jobs" | "technologies"
> & {
  jobs: Job[];
  jobGaps: GapEntry[];
  technologies: TechProfile[];
};
