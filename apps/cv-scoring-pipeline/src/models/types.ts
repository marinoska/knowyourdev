import { Document, Model } from "mongoose";

export const TREND = ['SD', 'D', 'S', 'T', 'HT'] as const;  //string decline, decline, steady, trending, highly trending
export const CATEGORY = ['Lang', 'DB', 'Framework', 'Tool', 'Other-FW', 'Cloud'] as const;
export const PROFICIENCY = ['skilled', 'expert', 'familiar'] as const;
export type ProficiencyType = typeof PROFICIENCY[ number];
export type TrendType = typeof TREND;
export type CategoryType = typeof CATEGORY;
export type TechCode = string;

export type TechCodeType = string;
export type TechDocument = Document & {
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
    'and': TechCode[],
    'or': TechCode[][]
};

export type TechStack = {
    stackName: string,
    matchedComponents: TechCode[],
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
    matchTechList: (techNamesSet: Set<TechCode>) => Promise<TechStack | null>;
}

export type TechStackModelType = Model<TechStackDocumentType> & {
    identifyStack: (techNames: TechCode[]) => Promise<TechStack[]>;
};

export type TechModelType = Model<TechDocument>;

export type JobEntry = {
    role: string;
    // roleType?: "SE" | "QA" | "UI/UX" | "PM",
    // softwareDevelopmentScope?: "BE" | "FE" | "FS",
    // isSoftwareDevelopmentRole: boolean,
    // isMobileDevelopmentRole: boolean,
    summary: string,
    job: string;
    start: string; // Format: 'mm-yyyy'
    end: string;   // Format: 'mm-yyyy'
    months: number;
    present: boolean;
    text: string;
    technologies: TechnologyEntry[];
    stack: TechStack[];
};

export type TechnologyEntry = {
    original: string; // Exact name as found in the job description
    normalized: string | ""; // Name from TechList by AI
    code: TechCode | ""; // Code of normalized name
    proficiency: ProficiencyType;
};

export type ExtractedCVData = {
    // technologies: TechnologiesEntry[],
    // techStack: TechStack[];
    fullName: string;
    profileSection: {
        text: string;
        technologies: TechnologyEntry[];
        stack: TechStack[];
    };
    skillSection: {
        text: string;
        technologies: TechnologyEntry[];
        stack: TechStack[];
    }
    jobs: JobEntry[];
};

export type CVDataDocumentType = Document & {
    hash: string;
} & ExtractedCVData;

export type CVDataModelType = Model<CVDataDocumentType>;
