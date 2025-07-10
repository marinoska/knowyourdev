import { useQuery } from "@tanstack/react-query";
import { TResumeProfileDTO } from "@/api/query/types.ts";
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
  TTechMatch,
  TTechFocusMatch,
  TCandidateMatch,
  WithCandidateMatch,
} from "@kyd/common/api";

export const useResumeProfileQuery = ({
  uploadId,
  projectId,
}: {
  uploadId: string;
  projectId?: string;
}) => {
  const { data, ...rest } = useQuery<
    typeof projectId extends string
      ? TResumeProfileDTO<WithCandidateMatch>
      : TResumeProfileDTO,
    Error
  >({
    queryKey: uploadsKeys.profile(uploadId, projectId), // Include projectId in the query key
    queryFn: () =>
      getResumeProfile({ uploadId, projectId }).then((data) => ({
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
          >("periods"),
          {} as TTechFocusUsage,
        ),
        techUsage: Object.entries(data.techUsage).reduce(
          objectWithPeriodsToDate<TTechTimeline, string, TTechUsage>("periods"),
          {} as TTechUsage,
        ),
        match:
          "match" in data && data.match
            ? {
                ...data.match,
                techMatch: Object.entries(
                  (data.match as TCandidateMatch).techMatch,
                ).reduce(
                  objectWithPeriodsToDate<
                    TTechMatch,
                    string,
                    Record<string, TTechMatch>
                  >("descActivityPeriods"),
                  {} as Record<string, TTechMatch>,
                ),
                techFocusMatch: Object.entries(
                  (data.match as TCandidateMatch).techFocusMatch,
                ).reduce(
                  objectWithPeriodsToDate<
                    TTechFocusMatch,
                    string,
                    Record<string, TTechFocusMatch>
                  >("descActivityPeriods"),
                  {} as Record<string, TTechFocusMatch>,
                ),
              }
            : undefined,
      })),
    retry: TIMES_THREE,
    enabled: !!uploadId,
  });

  return {
    profile: data,
    ...rest,
  };
};

const objectWithPeriodsToDate =
  <
    T extends
      | { periods: ActivityPeriod[] }
      | { descActivityPeriods: ActivityPeriod[] },
    M extends string,
    K extends Record<M, T>,
  >(
    fieldName: "periods" | "descActivityPeriods",
  ) =>
  (acc: K, [key, value]: [string, unknown]): K => {
    const typedValue = value as T;

    // Create a type guard to check if the property exists
    const hasField = (
      obj: unknown,
      field: string,
    ): obj is { [key: string]: ActivityPeriod[] } => {
      // @ts-ignore
      return <boolean>obj && field in obj;
    };

    // Only proceed if the field exists in the object
    if (hasField(typedValue, fieldName)) {
      const transformedValue = {
        ...typedValue,
        // @ts-ignore
        [fieldName]: rangeToDate(typedValue[fieldName]),
      };

      acc[key as M] = transformedValue as unknown as K[M];
    }

    return acc;
  };
