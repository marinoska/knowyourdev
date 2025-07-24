import { useInfiniteQuery } from "@tanstack/react-query";
import { uploadsKeys } from "./keys.ts";
import { listUploads } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import { GetUploadsListResponse } from "@kyd/common/api";

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
