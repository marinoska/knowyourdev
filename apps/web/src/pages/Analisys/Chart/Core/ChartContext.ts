import { createContext, useContext } from "react";
import { Job, ProcessedUploadProfile } from "@/api/query/types.ts";

export type Gap = Pick<
  Job,
  "job" | "role" | "months" | "start" | "end" | "popularity"
>;

type ChartContextType = {
  jobGaps: Gap[];
  softwareDevelopmentJobs: Job[];
  irrelevantJobs: Job[];
  jobsWithMissingTech: Job[];
  jobsWithFilledTech: Job[];
  profile?: ProcessedUploadProfile;
  monthsActive: number;
};

const ChartContext = createContext<ChartContextType>({
  jobGaps: [],
  softwareDevelopmentJobs: [],
  irrelevantJobs: [],
  jobsWithMissingTech: [],
  jobsWithFilledTech: [],
  profile: undefined,
  monthsActive: 0,
});

export const useChartContext = () => {
  return useContext(ChartContext);
};

export { ChartContext };