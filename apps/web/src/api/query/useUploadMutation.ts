import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteUploadList, uploadCV } from "./api.ts";
import {
  DocumentUploadRequestType,
  DocumentUploadResponse,
} from "@kyd/common/api";
import { MAXIMUM_UPLOAD_SIZE_BYTES } from "@/utils/const.ts";
import { uploadsKeys } from "@/api/query/keys.ts";

export const useUploadMutation = () => {
  const queryClient = useQueryClient();
  const { mutate, ...results } = useMutation<
    DocumentUploadResponse,
    Error,
    DocumentUploadRequestType
  >({
    mutationFn: uploadCV,
    onError: (err) => {
      console.log("UploadMutation error:", err.toString());
    },
    onSuccess: async (newUpload) => {
      console.log("useUploadsMutation", uploadsKeys.paginate(1));
      void queryClient.setQueryData(
        uploadsKeys.paginate(1),

        (uploadsPages: InfiniteUploadList | null) => {
          if (!uploadsPages) return uploadsPages;

          return {
            ...uploadsPages,
            pages: uploadsPages.pages.map((page, index) => {
              // Only modify the first page (index 0)
              if (index === 0) {
                return {
                  ...page,
                  uploads: [newUpload, ...page.uploads],
                };
              }
              return page;
            }),
          };
        },
      );
    },
  });

  const handleFileUpload = (
    file: File,
    name: string = "",
    role: string,
  ) => {
    const isValidFileSize = file.size <= MAXIMUM_UPLOAD_SIZE_BYTES;

    if (!isValidFileSize) throw Error(`Invalid file size ${file.toString()}`);
    if (!role) throw Error(`Project is required`);

    return mutate({ file, name, role });
  };

  return {
    handleFileUpload,
    ...results,
  };
};
