import { useMutation } from "@tanstack/react-query";
import { ApiResponse, uploadCV, UploadCVRequestType } from "./api.js";
import { MAXIMUM_UPLOAD_SIZE_BYTES } from "../../utils/files.js";

export const useUploadMutation = () => {
    const {mutate, ...results} = useMutation<ApiResponse, Error, UploadCVRequestType>(
        {
            mutationFn: uploadCV,
            onError: (err) => {
                console.log(err.toString());
            }
        }
    );

    const handleFileUpload = (file: File, name: string = '', role: string = '') => {
        const isValidFileSize = file.size <= MAXIMUM_UPLOAD_SIZE_BYTES;

        // TODO
        if (!isValidFileSize) throw Error(`Invalid file size ${file.toString()}`);

        return mutate({file, name, role});
    };

    return {
        handleFileUpload,
        ...results,
    };
};
