import { TechName } from "../../tech/types.js";

export type JobEntry = {
    role: string;
    job: string;
    start: string; // Format: 'mm-yyyy'
    end: string;   // Format: 'mm-yyyy'
    months: number;
    present: boolean;
    description: string;
    technologies?: TechName[];
    stack: TechStack;
};

export type TechnologiesEntry = {
    originalName: string; // Exact name as found in the job description
    name: string; // Normalized name from TechList
    code?: string; // Normalized name from TechList
    proficiency?: "skilled" | "expert" | "familiar";
    skill?: boolean;
    inTechList: boolean; // True if it's a recognized technology from TechList
};

export type ExtractedCVData = {
    technologies: TechnologiesEntry[],
    techStack: TechStack[];
    jobs: JobEntry[]
};

export type TechStack = {
    stackName: string,
    matchedComponents: TechName[],
    matchPercentage: number
}