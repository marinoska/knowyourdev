import { Document, Model, Schema } from "mongoose";
import { JobEntry } from "@/models/cvData.model";
import { CategoryType, ScopeType, TechCode, TechProfileType, TrendType } from "@kyd/types/api";

export type TechCodeType = string;
export type TechType = {
    name: string;
    code: TechCodeType;
    usage2024?: number;
    usage2016?: number;
    trend: TrendType;
    category: CategoryType;
    scope: ScopeType;
};

export type TechDocument = Document<unknown, unknown, TechType> & TechType & {
    _id: Schema.Types.ObjectId
};

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

export const SECTIONS = [
    "Contacts",
    "Summary",
    "Education",
    "Skills",
    "Professional experience/work history",
    "Certifications",
    "Publications",
    "Languages",
] as const;
export type SectionsNames = typeof SECTIONS[number];

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

export type RoleType = JobEntry["roleType"];

export type TechProfileDocumentType = Document & TechProfileType & {
    uploadRef: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export type TechProfileModelType = Model<TechProfileDocumentType>;

export type JobHistoryQuality = {
    hasDetailedJobs: boolean; // Confirms that job descriptions contain enough detail, not just titles
    hasConsistentSkills: boolean; // Checks if listed skills align with technologies used in job history
    hasStructuredTechnologies: boolean; // Validates if technologies are grouped logically (e.g., languages, frameworks, tools)
    hasLogicalCareerProgression: boolean; // Ensures job transitions follow a natural progression (e.g., Junior -> Senior)
    hasUnexpectedRegressions: boolean; // Flags sudden drops in job titles (e.g., Senior → Junior)
    hasJobDescriptionDetails: boolean; // Checks if job descriptions provide meaningful insights, not just job titles
    hasVagueDescriptions: boolean; // Flags descriptions that are too generic (e.g., "Worked on various projects")
    hasClearJobDates: boolean; // Ensures that start and end dates are present for each job
    hasEmploymentGaps: boolean; // Detects long gaps between jobs without explanation
};

export type SkillAssessment = {
    hasModernStack: boolean; // Checks if the candidate actively uses modern technologies
    hasAgingTechListed: boolean; // Flags legacy technologies that may indicate outdated skills
    hasAgingTechInUse: boolean; // Differentiates between listing old tech vs. actively using it
    hasJuniorLikeSkills: boolean; // Flags skill lists that resemble entry-level candidates
    hasGenericSkills: boolean; // Detects non-technical or overly broad terms (e.g., "Software Development")
    hasNonTechnicalItemsInSkills: boolean; // Flags items in the skills section that are not actual technical skills (e.g., "Agile," "APIs")
    hasFrameworksListed: boolean; // Ensures frameworks/libraries are listed and not just programming languages
    hasOnlyLanguages: boolean; // Flags cases where only programming languages are listed without frameworks/tools
    hasInconsistentLanguageFrameworkPairs: boolean; // Detects mismatches like PHP with React or Express.js with Java
};

export type AIContentDetection = {
    hasAIGeneratedContent: boolean; // Flags AI-generated text if present
    hasInconsistentPhrasing: boolean; // Detects signs of LLM-generated responses (e.g., awkward phrasing, redundant sections)
    hasOverlyGenericWriting: boolean; // Flags text that is too templated or generic
};

// Main type referencing modular sections
export type FactorsType = {
    hash: string;
    cvCompleteness: {
        isITEngineer: boolean; // Determines if the resume belongs to an IT professional based on job roles and context
        hasJobHistory: boolean; // Ensures at least one job/project is listed
        hasSkillsListed: boolean; // Ensures skills are explicitly mentioned in the resume
        sectionsNumber: number;
    }
    experienceProgression?: {},
    jobHistoryQuality?: JobHistoryQuality;
    skillAssessment?: SkillAssessment;
    AIContentDetection?: AIContentDetection;
};

export type FactorsDocumentType = Document & FactorsType;
export type FactorsModelType = Model<FactorsDocumentType>;
