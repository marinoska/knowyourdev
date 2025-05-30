import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadCV } from "./api.js";
import { DocumentUploadRequestType, DocumentUploadResponse, GetUploadsListResponse } from "@kyd/common/api";
import { MAXIMUM_UPLOAD_SIZE_BYTES } from "@/utils/const.ts";
import { uploadsKeys } from "@/api/query/keys.ts";


export const useUploadMutation = () => {
    const queryClient = useQueryClient();
    const {mutate, ...results} = useMutation<DocumentUploadResponse, Error, DocumentUploadRequestType>(
        {
            mutationFn: uploadCV,
            onError: (err) => {
                console.log("UploadMutation error:", err.toString());
            },
            onSuccess: async (newUpload) => {
                console.log("useUploadsMutation", uploadsKeys.paginate(1));
                void queryClient.setQueryData(
                    uploadsKeys.paginate(1),

                    (uploadsPages: GetUploadsListResponse | null) => {

                        console.log("Uploads", uploadsPages);
                        if (!uploadsPages) return uploadsPages; // If no data exists yet, return it untouched

                        return {
                            ...uploadsPages, // Keep the overall structure of the data
                            pages: uploadsPages.pages.map((page, index) => {
                                // Only modify the first page (index 0)
                                if (index === 0) {
                                    return {
                                        ...page,
                                        uploads: [newUpload, ...page.uploads], // Prepend the new upload to the first page
                                    };
                                }
                                return page; // Leave other pages unchanged
                            }),
                        };


                    }
                )
            }
        }
    );

    const handleFileUpload = (file: File, name: string = '', role: string = '') => {
        const isValidFileSize = file.size <= MAXIMUM_UPLOAD_SIZE_BYTES;

        if (!isValidFileSize) throw Error(`Invalid file size ${file.toString()}`);

        return mutate({file, name, role});
    };

    return {
        handleFileUpload,
        ...results,
    };
};
