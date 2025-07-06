import { useQuery } from "@tanstack/react-query";
import { TResumeProfile } from "@/api/query/types.ts";
import { uploadsKeys } from "@/api/query/keys.ts";
import { getResumeProfile } from "@/api/query/api.ts";
import { rangeToDate } from "@/utils/dates.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import {
  ActivityPeriod,
  ScopeType,
  TTechFocusUsage,
  TTechTimeline,
  TTechFocusTimeline,
  TTechUsage,
} from "@kyd/common/api";

export const useResumeProfileQuery = ({ uploadId }: { uploadId?: string }) => {
  const { data, ...rest } = useQuery<TResumeProfile, Error>({
    queryKey: uploadsKeys.profile(uploadId!), // we dont use the query params for now so default it to 0
    queryFn: () =>
      getResumeProfile({ uploadId: uploadId! }).then((data) => ({
        ...data,
        jobs: rangeToDate(data.jobs),
        jobGaps: rangeToDate(data.jobGaps),
        technologies: data.technologies.map((tech) => ({
          ...tech,
          totalMonths: tech.totalMonths || 0,
          jobs: rangeToDate(tech.jobs),
        })),
        softwareDevelopmentJobs: rangeToDate(data.softwareDevelopmentJobs),
        irrelevantJobs: rangeToDate(data.irrelevantJobs),
        jobsWithMissingTech: rangeToDate(data.jobsWithMissingTech),
        jobsWithFilledTech: rangeToDate(data.jobsWithFilledTech),
        earliestJobStart: data.earliestJobStart
          ? new Date(data.earliestJobStart)
          : new Date(),
        techFocusUsage: Object.entries(data.techFocusUsage).reduce(
          objectWithPeriodsToDate<
            TTechFocusTimeline,
            ScopeType,
            TTechFocusUsage
          >,
          {} as TTechFocusUsage,
        ),
        techUsage: Object.entries(data.techUsage).reduce(
          objectWithPeriodsToDate<TTechTimeline, string, TTechUsage>,
          {} as TTechUsage,
        ),
      })),
    retry: TIMES_THREE,
    enabled: !!uploadId,
  });

  return {
    profile: data,
    ...rest,
  };
};

const objectWithPeriodsToDate = <
  T extends { periods: ActivityPeriod[] },
  M extends string,
  K extends Record<M, T>,
>(
  acc: K,
  [key, value]: [string, T],
): K => {
  const transformedValue = {
    ...value,
    periods: rangeToDate(value.periods),
  };

  acc[key as M] = transformedValue as unknown as K[M];

  return acc;
};
