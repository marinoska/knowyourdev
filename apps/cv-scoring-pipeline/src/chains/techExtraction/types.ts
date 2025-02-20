export type JobEntry = {
    role: string;
    job: string;
    start: string; // Format: 'dd-mm-yyyy'
    end: string;   // Format: 'dd-mm-yyyy'
    months: number;
    description: string;
    technologies?: string[];
};

export type TechnologiesEntry = {
    originalName: string; // Exact name as found in the job description
    name: string; // Normalized name from TechList
    proficiency?: "skilled" | "expert" | "familiar";
    skill?: boolean;
    inTechList: boolean; // True if it's a recognized technology from TechList
};

export type ExtractedTech = {
    technologies: TechnologiesEntry[],
    jobs: JobEntry[]
};
