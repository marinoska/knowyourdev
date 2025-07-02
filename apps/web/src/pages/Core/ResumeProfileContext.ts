import { createContext, useContext } from "react";
import { ProcessedUploadProfile } from "@/api/query/types.ts";

export type ResumeProfileType = {
  profile?: ProcessedUploadProfile;
  monthsActive: number;
};

export const ResumeProfileContext = createContext<ResumeProfileType>({
  profile: undefined,
  monthsActive: 0,
});

export const useResumeProfileContext = () => {
  return useContext(ResumeProfileContext);
};
