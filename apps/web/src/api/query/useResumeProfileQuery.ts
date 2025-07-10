import { useQuery } from "@tanstack/react-query";
import { TResumeProfileDTO } from "@/api/query/types.ts";
import { uploadsKeys } from "@/api/query/keys.ts";
import { getResumeProfile } from "@/api/query/api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import {
  rangeToDateSafe,
  toDateSafe,
  transformActivityEntries,
  transformMatch,
  transformTechnologies,
} from "@/api/query/helpers.ts";
import {
  TTechUsage,
  TTechFocusUsage,
  WithCandidateMatch,
} from "@kyd/common/api";

/**
 * Transforms resume profile data by converting date strings to Date objects
 * @param data - Resume profile data
 * @returns Transformed resume profile data
 */
export const transformResumeProfile = (
  data: TResumeProfileDTO | TResumeProfileDTO<WithCandidateMatch>,
) => ({
  ...data,
  jobs: rangeToDateSafe(data.jobs),
  jobGaps: rangeToDateSafe(data.jobGaps),
  technologies: transformTechnologies(data.technologies),
  softwareDevelopmentJobs: rangeToDateSafe(data.softwareDevelopmentJobs),
  irrelevantJobs: rangeToDateSafe(data.irrelevantJobs),
  jobsWithMissingTech: rangeToDateSafe(data.jobsWithMissingTech),
  jobsWithFilledTech: rangeToDateSafe(data.jobsWithFilledTech),
  earliestJobStart: toDateSafe(data.earliestJobStart),
  techFocusUsage: transformActivityEntries(
    data.techFocusUsage,
    "periods",
  ) as TTechFocusUsage,
  techUsage: transformActivityEntries(data.techUsage, "periods") as TTechUsage,
  match: "match" in data ? transformMatch(data.match) : undefined,
});

/**
 * Hook for fetching and transforming resume profile data
 * @param uploadId - ID of the uploaded document
 * @param projectId - Optional project ID for matching
 * @returns Query result with transformed profile data
 */
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
    queryKey: uploadsKeys.profile(uploadId, projectId),
    queryFn: () =>
      getResumeProfile({ uploadId, projectId }).then(transformResumeProfile),
    retry: TIMES_THREE,
    enabled: !!uploadId,
  });

  return {
    profile: data,
    ...rest,
  };
};
