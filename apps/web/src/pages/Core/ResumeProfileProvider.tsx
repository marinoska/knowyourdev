import { ReactNode, useMemo } from "react";
import { Job, ProcessedUploadProfile } from "@/api/query/types.ts";
import { getJobGaps } from "@/pages/Core/ranges.ts";
import { GAP_JOB, GAP_ROLE, sumRanges } from "@kyd/common";
import { ResumeProfileContext, Gap } from "./ResumeProfileContext.ts";

export function ResumeProfileProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile?: ProcessedUploadProfile;
}) {
  const jobGaps = useMemo<Gap[]>(() => {
    if (!profile?.jobs) {
      return [];
    }

    const sortedJobs = profile.jobs.sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
    const gapsRanges = getJobGaps(sortedJobs);

    return [
      ...gapsRanges.map((range) => ({
        role: GAP_ROLE,
        job: GAP_JOB,
        start: range.start,
        end: range.end,
        months: range.months,
        popularity: 0,
      })),
    ];
  }, [profile?.jobs]);

  const [
    softwareDevelopmentJobs,
    irrelevantJobs,
    jobsWithMissingTech,
    jobsWithFilledTech,
  ] = useMemo(() => {
    const devJobs: Job[] = [];
    const otherJobs: Job[] = [];
    const jobsWithMissingTech: Job[] = [];
    const jobsWithFilledTech: Job[] = [];

    const sortedJobs = profile?.jobs.sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );

    for (const job of sortedJobs || []) {
      if (job.isSoftwareDevelopmentRole) {
        devJobs.push(job);
        if (!job.technologies.length) {
          jobsWithMissingTech.push(job);
        } else {
          jobsWithFilledTech.push(job);
        }
      } else {
        otherJobs.push(job);
      }
    }

    return [devJobs, otherJobs, jobsWithMissingTech, jobsWithFilledTech];
  }, [profile?.jobs]);

  const context = useMemo(
    () => ({
      profile,
      jobGaps,
      softwareDevelopmentJobs,
      irrelevantJobs,
      jobsWithMissingTech,
      jobsWithFilledTech,
      monthsActive: sumRanges(softwareDevelopmentJobs),
    }),
    [
      profile,
      jobGaps,
      irrelevantJobs,
      softwareDevelopmentJobs,
      jobsWithMissingTech,
      jobsWithFilledTech,
    ],
  );

  return (
    <ResumeProfileContext.Provider value={context}>
      {children}
    </ResumeProfileContext.Provider>
  );
}
