import { useQuery } from "@tanstack/react-query";
import { uploadsKeys } from "./keys.ts";
import { listUploads } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import { useState } from "react";

export const useUploadsListQuery = () => {
    const [showError, setShowError] = useState(false);
    const {data, isError, error, ...rest} = useQuery(
        {
            queryKey: uploadsKeys.list(), // we dont use the query params for now so default it to 0
            queryFn: () => listUploads(),
            retry: TIMES_THREE,
        },
    );

    if (isError) {
        console.error(error);
        setShowError(true);
    }

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