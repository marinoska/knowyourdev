import { useQuery } from "@tanstack/react-query";
import { uploadsKeys } from "./keys.ts";
import { getUploadProfile, listUploads } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import { useEffect, useState } from "react";

export const useUploadListQuery = () => {
    const [showError, setShowError] = useState(false);
    const {data, isError, error, ...rest} = useQuery(
        {
            queryKey: uploadsKeys.list(), // we dont use the query params for now so default it to 0
            queryFn: () => listUploads(),
            retry: TIMES_THREE,
        },
    );

    useEffect(() => {
        if (isError) {
            console.error(error);
            setShowError(true);
        }
    }, [isError, error])

    // if (data) console.log({data});

    return {
        data,
        isError,
        error,
        showError,
        dismissError: () => setShowError(false),
        ...rest
    };
}


export const useUploadProfileQuery = ({uploadId}: { uploadId: string }) => {
    const [showError, setShowError] = useState(false);
    const {data, isError, error, ...rest} = useQuery(
        {
            queryKey: uploadsKeys.profile(uploadId), // we dont use the query params for now so default it to 0
            queryFn: () => getUploadProfile({uploadId}),
            retry: TIMES_THREE,
        },
    );

    useEffect(() => {
        if (isError) {
            console.error(error);
            setShowError(true);
        }
    }, [isError, error])


    return {
        data,
        isError,
        error,
        showError,
        dismissError: () => setShowError(false),
        ...rest
    };
}