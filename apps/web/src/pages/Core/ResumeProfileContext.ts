import { createContext, useContext } from "react";
import { Job, ProcessedUploadProfile } from "@/api/query/types.ts";
import { GapEntry, ScopeType, TScopes } from "@kyd/common/api";

export type Selection = {
  scope: ScopeType;
  periodIndex: number;
  selectedTechnologies?: string[]; // Optional array of selected technology names
};

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
