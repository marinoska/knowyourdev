import { useQuery } from "@tanstack/react-query";
import { projectsKeys } from "./keys.ts";
import { getProjectsProps } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";

type ProjectPropsResponse = {
  names: string[];
};

export const useProjectPropsQuery = () => {
  return useQuery<ProjectPropsResponse, Error>({
    queryKey: projectsKeys.props(),
    queryFn: () => getProjectsProps(),
    retry: TIMES_THREE,
  });
};
