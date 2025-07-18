import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "./api.ts";
import { PatchProjectBody } from "@kyd/common/api";
import { projectsKeys } from "./keys.ts";
import { TProjectDTO } from "@/api/query/types.ts";

export const useProjectUpdateMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    TProjectDTO,
    Error,
    {
      projectId: string;
      projectData: PatchProjectBody;
    }
  >({
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

      void queryClient.invalidateQueries({
        queryKey: projectsKeys.list(),
      });
    },
  });
};

//return query.mutate({ projectId, projectData });
