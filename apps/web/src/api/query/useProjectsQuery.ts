import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { projectsKeys } from "./keys.ts";
import { getProjectProfile, listProjects } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import { useEffect, useState } from "react";
import { GetProjectsListResponse, ProjectsItem } from "@kyd/common/api";

export const useProjectsQuery = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const [showError, setShowError] = useState(false);

  const { data, isError, error, ...rest } = useInfiniteQuery<
    GetProjectsListResponse,
    Error
  >({
    queryKey: projectsKeys.paginate(page),
    queryFn: ({ pageParam }: { pageParam: number | unknown }) =>
      listProjects({ page: Number(pageParam), limit }),
    initialPageParam: 1,
    retry: TIMES_THREE,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.currentPage > 1 ? firstPage.currentPage - 1 : undefined,
  });

  const allData = data ? data.pages.flatMap((page) => page.projects) : [];

  useEffect(() => {
    if (isError) {
      console.error("Projects Error:", error);
      setShowError(true);
    }
  }, [isError, error]);

  return {
    data: allData,
    isError,
    error,
    showError,
    dismissError: () => setShowError(false),
    ...rest,
  };
};

export const useProjectProfileQuery = ({ projectId }: { projectId?: string }) => {
  const [showError, setShowError] = useState(false);
  const { data, isError, error, ...rest } = useQuery<
    ProjectsItem,
    Error
  >({
    queryKey: projectsKeys.profile(projectId!),
    queryFn: () => getProjectProfile({ projectId: projectId! }),
    retry: TIMES_THREE,
    enabled: !!projectId,
  });

  useEffect(() => {
    if (isError) {
      console.error(error);
      setShowError(true);
    }
  }, [isError, error]);

  return {
    profile: data,
    isError,
    error,
    showError,
    dismissError: () => setShowError(false),
    ...rest,
  };
};
