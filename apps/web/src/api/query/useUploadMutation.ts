import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadCV } from "./api.js";
import { DocumentUploadRequestType, DocumentUploadResponse, GetUploadsListResponse, UploadItem } from "@kyd/common/api";
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
            onSuccess: async (upload) => {
                void queryClient.setQueryData(
                    uploadsKeys.list(),
                    (uploadsPages: GetUploadsListResponse | null) => {
                        console.log("Uploads", uploadsPages);
                        return {...uploadsPages, uploads: [...uploadsPages?.uploads || [], upload]}
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
