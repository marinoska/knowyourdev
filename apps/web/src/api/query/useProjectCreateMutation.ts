import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, PostProjectBody } from "./api.ts";
import { projectsKeys } from "./keys.ts";
import { TProjectDTO } from "@/api/query/types.ts";

export const useProjectCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<TProjectDTO, Error, PostProjectBody>({
    mutationFn: createProject,
    onError: (err) => {
      console.error("ProjectCreateMutation error:", err.toString());
    },
    onSuccess: async (createdProject) => {
      // Update the project in the cache
      void queryClient.setQueryData(
        projectsKeys.profile(createdProject._id),
        createdProject,
      );

      // Invalidate the projects list query to reflect the new project
      void queryClient.invalidateQueries({
        queryKey: projectsKeys.list(),
      });
    },
  });
};