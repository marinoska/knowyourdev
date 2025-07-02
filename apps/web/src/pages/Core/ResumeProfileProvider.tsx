import { ReactNode, useMemo } from "react";
import { TResumeProfile } from "@/api/query/types.ts";
import { sumRanges } from "@kyd/common";
import {
  ResumeProfileContext,
  defaultProfile,
} from "./ResumeProfileContext.ts";

export function ResumeProfileProvider({
  children,
  profile = { ...defaultProfile },
}: {
  children: ReactNode;
  profile?: TResumeProfile;
}) {
  const context = useMemo(
    () => ({
      profile,
      monthsActive: sumRanges(profile?.softwareDevelopmentJobs || []),
    }),
    [profile],
  );

  return (
    <ResumeProfileContext.Provider value={context}>
      {children}
    </ResumeProfileContext.Provider>
  );
}
