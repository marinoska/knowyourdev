import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { uploadsKeys } from "./keys.ts";
import { getUploadProfile, listUploads } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import { TResumeProfile } from "@/api/query/types.ts";
import { GetUploadsListResponse, ScopeType, TScopes } from "@kyd/common/api";
import { rangeToDate } from "@/utils/dates.ts";

export const useUploadsQuery = ({
  page,
  limit,
  projectId,
}: {
  page: number;
  limit: number;
  projectId?: string;
}) => {
  const { data, ...rest } = useInfiniteQuery<GetUploadsListResponse, Error>({
    queryKey: uploadsKeys.paginate(page, projectId),
    queryFn: ({ pageParam }: { pageParam: number | unknown }) =>
      listUploads({ page: Number(pageParam), limit, projectId }),
    initialPageParam: 1,
    retry: TIMES_THREE,
    refetchInterval: (query) => {
      const data = query.state.data;
      const allUploads = data?.pages?.flatMap((page) => page.uploads) || [];
      const hasPendingUploads = allUploads.some(
        (upload) => upload.parseStatus === "pending",
      );
      return hasPendingUploads ? 5000 : false; // Poll every 5 seconds if needed
    },
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.currentPage > 1 ? firstPage.currentPage - 1 : undefined,
  });

  const allData = data ? data.pages.flatMap((page) => page.uploads) : [];

  return {
    data: allData,
    ...rest,
  };
};

export const useResumeProfileQuery = ({ uploadId }: { uploadId?: string }) => {
  const { data, ...rest } = useQuery<TResumeProfile, Error>({
    queryKey: uploadsKeys.profile(uploadId!), // we dont use the query params for now so default it to 0
    queryFn: () =>
      getUploadProfile({ uploadId: uploadId! }).then((data) => ({
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
        earliestJobStart: new Date(data.earliestJobStart || ""),
        scopes: Object.entries(data.scopes).reduce((acc, [key, value]) => {
          acc[key as ScopeType] = {
            ...value,
            periods: rangeToDate(value.periods),
          };
          return acc;
        }, {} as TScopes),
      })),
    retry: TIMES_THREE,
    enabled: !!uploadId,
  });

  return {
    profile: data,
    ...rest,
  };
};
