import { ReactNode, useMemo } from "react";
import { ProcessedUploadProfile } from "@/api/query/types.ts";
import { sumRanges } from "@kyd/common";
import { ResumeProfileContext } from "./ResumeProfileContext.ts";

export function ResumeProfileProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile?: ProcessedUploadProfile;
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
