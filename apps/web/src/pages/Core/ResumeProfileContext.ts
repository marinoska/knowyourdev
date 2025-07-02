import { createContext, useContext } from "react";
import { TScopes } from "@kyd/common/api";
import { TResumeProfile } from "@/api/query/types.ts";

export type ResumeProfileType = {
  profile: TResumeProfile;
  monthsActive: number;
};

export const defaultProfile = {
  uploadId: "",
  position: "",
  fullName: "",
  jobs: [],
  jobGaps: [],
  technologies: [],
  softwareDevelopmentJobs: [],
  irrelevantJobs: [],
  jobsWithMissingTech: [],
  jobsWithFilledTech: [],
  earliestJobStart: new Date(),
  scopes: {} as TScopes,
  createdAt: Date(),
  updatedAt: Date(),
};
export const ResumeProfileContext = createContext<ResumeProfileType>({
  profile: { ...defaultProfile },
  monthsActive: 0,
});

export const useResumeProfileContext = () => {
  return useContext(ResumeProfileContext);
};
