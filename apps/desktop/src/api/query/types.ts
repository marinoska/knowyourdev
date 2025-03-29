import { UploadTechProfileJobEntry, UploadTechProfileResponse } from "@kyd/common/api";

export type Job = Omit<UploadTechProfileJobEntry, 'start' | 'end'> & {
    start: Date;
    end: Date;
};

export type ProcessedUploadProfile = Omit<UploadTechProfileResponse, 'jobs'> & { jobs: Job[] }
