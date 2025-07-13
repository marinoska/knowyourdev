import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "./api.ts";
import { TProject, TProjectResponse } from "@kyd/common/api";
import { projectsKeys } from "./keys.ts";

type ProjectUpdateParams = {
  projectId: string;
  projectData: Partial<TProject>;
};

export const useProjectUpdateMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  const query = useMutation<TProjectResponse, Error, ProjectUpdateParams>({
    mutationFn: updateProject,
    onError: (err) => {
      console.error("ProjectUpdateMutation error:", err.toString());
    },
    onSuccess: async (updatedProject) => {
      // Update the project in the cache
      void queryClient.setQueryData(
        projectsKeys.profile(projectId),
        updatedProject,
      );

      // Invalidate the projects list to ensure it reflects the updated project
      void queryClient.invalidateQueries({
        queryKey: projectsKeys.list(),
      });
    },
  });

  const handleProjectUpdate = (projectData: Partial<TProject>) => {
    return query.mutate({ projectId, projectData });
  };

  return {
    ...query,
    handleProjectUpdate,
  };
};
