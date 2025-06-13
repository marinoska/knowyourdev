import { useQuery } from "@tanstack/react-query";
import { projectsKeys } from "./keys.ts";
import { getProjectsProps } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import { useEffect, useState } from "react";

type ProjectPropsResponse = {
  names: string[];
};

export const useProjectPropsQuery = () => {
  const [showError, setShowError] = useState(false);

  const { data, isError, error, ...rest } = useQuery<
    ProjectPropsResponse,
    Error
  >({
    queryKey: projectsKeys.props(),
    queryFn: () => getProjectsProps(),
    retry: TIMES_THREE,
  });

  useEffect(() => {
    if (isError) {
      console.error("Project Props Error:", error);
      setShowError(true);
    }
  }, [isError, error]);

  return {
    data,
    isError,
    error,
    showError,
    dismissError: () => setShowError(false),
    ...rest,
  };
};