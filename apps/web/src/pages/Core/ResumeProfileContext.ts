import { createContext, useContext } from "react";
import { Job, ProcessedUploadProfile } from "@/api/query/types.ts";
import { GapEntry, ScopeType } from "@kyd/common/api";

export type ScopePeriod = {
  startDate: Date;
  endDate: Date;
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

export type Selection = {
  scope: ScopeType;
  periodIndex: number;
  selectedTechnologies?: string[]; // Optional array of selected technology names
};

export type TScopes = Record<ScopeType, TScopeActivity>;

export type ResumeProfileType = {
  jobGaps: GapEntry[];
  softwareDevelopmentJobs: Job[];
  irrelevantJobs: Job[];
  jobsWithMissingTech: Job[];
  jobsWithFilledTech: Job[];
  profile?: ProcessedUploadProfile;
  monthsActive: number;
  scopes: TScopes;
  earliestJobStart: Date | null;
};

export const ResumeProfileContext = createContext<ResumeProfileType>({
  jobGaps: [],
  softwareDevelopmentJobs: [],
  irrelevantJobs: [],
  jobsWithMissingTech: [],
  jobsWithFilledTech: [],
  profile: undefined,
  monthsActive: 0,
  scopes: {} as TScopes,
  earliestJobStart: null,
});

export const useResumeProfileContext = () => {
  return useContext(ResumeProfileContext);
};
