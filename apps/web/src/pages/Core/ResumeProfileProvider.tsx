import { ReactNode, useMemo } from "react";
import { ProcessedUploadProfile } from "@/api/query/types.ts";
import { sumRanges } from "@kyd/common";
import { TScopes } from "@kyd/common/api";
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
      jobGaps: profile?.jobGaps || [],
      softwareDevelopmentJobs: profile?.softwareDevelopmentJobs || [],
      irrelevantJobs: profile?.irrelevantJobs || [],
      jobsWithMissingTech: profile?.jobsWithMissingTech || [],
      jobsWithFilledTech: profile?.jobsWithFilledTech || [],
      earliestJobStart: profile?.earliestJobStart
        ? new Date(profile.earliestJobStart)
        : null,
      monthsActive: sumRanges(profile?.softwareDevelopmentJobs || []),
      scopes: profile?.scopes || ({} as TScopes),
    }),
    [profile],
  );

  return (
    <ResumeProfileContext.Provider value={context}>
      {children}
    </ResumeProfileContext.Provider>
  );
}
