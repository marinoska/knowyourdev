import { Document, Model, Schema } from "mongoose";

export const TREND = ['SD', 'D', 'S', 'T', 'HT'] as const;  //string decline, decline, steady, trending, highly trending
export const CATEGORY = ['Lang', 'DB', 'Framework', 'Tool', 'Other-FW', 'Cloud'] as const;
export type TrendType = typeof TREND;
export type CategoryType = typeof CATEGORY;
export type TechName = string;

export type TechCodeType = string;
export type TechDocument = Document & {
    _id: Schema.Types.ObjectId;
    name: string;
    code: TechCodeType;
    usage2024?: number;
    usage2016?: number;
    trend: TrendType;
    category: CategoryType;
}

export const TECH_STACK_CATEGORY =
    [
        'Full-Stack Development',
        "Backend Development",
        "Mobile Development (Cross-Platform)",
        "Mobile Development (iOS)",
        "Mobile Development (Android)",
        "Mobile Development (Hybrid)",
        "Front-End Development",
        "Enterprise Development",
        "CMS",
    ] as const;

export type TechStackCategory = typeof TECH_STACK_CATEGORY;

export type StackComponents = {
    'and': TechName[],
    'or': TechName[][]
};

export type TechStack = {
    stackName: string,
    matchedComponents: TechName[],
    matchPercentage: number
}
export type TechStackDocumentType = Document & {
    name: string;
    recommended: number;
    components: StackComponents,
    componentsString: string;
    trend: TrendType;
    popularity: number;
    languages: TechCodeType[];
    relations: TechCodeType[];
    category: TechStackCategory;
    description: string;
    useCases: string;
    purpose: string;
    frontEnd: string;
    bestFor: string;
    typicalUseCases: string;
} & {
    matchTechList: (techNamesSet: Set<TechName>) => Promise<TechStack | null>;
}

export type TechStackModelType = Model<TechStackDocumentType> & {
    identifyStack: (techNames: TechName[]) => Promise<TechStack[]>;
};

export type TechModelType = Model<TechDocument>;

export type JobEntry = {
    role: string;
    job: string;
    start: string; // Format: 'mm-yyyy'
    end: string;   // Format: 'mm-yyyy'
    months: number;
    present: boolean;
    description: string;
    technologies?: TechName[];
    stack?: TechStack[];
};

export type TechnologiesEntry = {
    originalName: string; // Exact name as found in the job description
    name: string; // Normalized name from TechList
    proficiency?: "skilled" | "expert" | "familiar";
    skill?: boolean;
    inTechList: boolean; // True if it's a recognized technology from TechList
};

export type ExtractedCVData = {
    technologies: TechnologiesEntry[],
    techStack: TechStack[];
    jobs: JobEntry[];
    fullName: string;
};

export type CVDataDocumentType = Document & {
    hash: string;
} & ExtractedCVData;

export type CVDataModelType = Model<CVDataDocumentType>;
