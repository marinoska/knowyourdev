import {
    UploadTechProfileJobEntry,
    UploadTechProfileResponse,
    UploadTechProfileTechnologiesEntry
} from "@kyd/common/api";

export type Job = Omit<UploadTechProfileJobEntry, 'start' | 'end'> & {
    start: Date;
    end: Date;
};

export type TechProfile = Omit<UploadTechProfileTechnologiesEntry, 'jobs'> & {
    totalMonths: number,
    jobs: {
        start: Date;
        end: Date;
        company: string;
        role: string;
    }[]
};

export type ProcessedUploadProfile = Omit<UploadTechProfileResponse, 'jobs' | 'technologies'>
    & {
    jobs: Job[],
    technologies: TechProfile[]
};
