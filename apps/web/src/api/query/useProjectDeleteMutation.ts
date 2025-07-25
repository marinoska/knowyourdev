import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "./api.ts";
import { projectsKeys } from "./keys.ts";

export const useProjectDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: deleteProject,
    onError: (err) => {
      console.error("ProjectDeleteMutation error:", err.toString());
    },
    onSuccess: async () => {
      void queryClient.invalidateQueries({
        queryKey: projectsKeys.list(),
      });
    },
  });
};
