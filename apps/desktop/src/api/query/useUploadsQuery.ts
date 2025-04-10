import { useQuery } from "@tanstack/react-query";
import { uploadsKeys } from "./keys.ts";
import { getUploadProfile, listUploads } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import { useEffect, useState } from "react";
import { Job, ProcessedUploadProfile } from "@/api/query/types.ts";
import { endOfMonth, startOfMonth } from "date-fns";

export const useUploadsQuery = () => {
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

export const useUploadProfileQuery = ({uploadId}: { uploadId?: string }) => {
    const [showError, setShowError] = useState(false);
    const {data, isError, error, ...rest} = useQuery<ProcessedUploadProfile, Error>(
        {
            queryKey: uploadsKeys.profile(uploadId!), // we dont use the query params for now so default it to 0
            queryFn: () => getUploadProfile({uploadId: uploadId!}).then(
                (data) => ({
                    ...data,
                    jobs: data.jobs?.map<Job>(
                        job => ({
                            ...job, start: startOfMonth(new Date(job.start)), end: endOfMonth(new Date(job.end))
                        })) || [],
                    technologies: data.technologies.map(tech => ({
                        ...tech,
                        totalMonths: tech.totalMonths || 0,
                        jobs: tech.jobs.map(job => ({
                            ...job,
                            start: startOfMonth(job.start ? new Date(job.start) : new Date()),
                            end: endOfMonth(job.end ? new Date(job.end) : new Date())
                        })) || [],
                    }))
                })),
            retry: TIMES_THREE,
            enabled: !!uploadId,
        },
    );

    useEffect(() => {
        if (isError) {
            console.error(error);
            setShowError(true);
        }
    }, [isError, error])


    return {
        profile: data,
        isError,
        error,
        showError,
        dismissError: () => setShowError(false),
        ...rest
    };
}