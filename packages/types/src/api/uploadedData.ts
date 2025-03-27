import { Schema } from "mongoose";
import { ProficiencyType, ScopeType, SECTIONS, TechCode } from "./constants";
import { TechStack, TechType } from "./tech";

export type TechnologyEntry = {
    original: string; // Exact name as found in the job description
    normalized: string | ""; // Name from TechList by AI
    code: TechCode | ""; // Code of normalized name
    proficiency: ProficiencyType;
    techReference: Schema.Types.ObjectId | TechType & {
        _id: Schema.Types.ObjectId
    } | null;
};
export type RoleType = "SE" | "QA" | "UI/UX" | "PM" | "DO" | "";

export type JobEntry = {
    _id: Schema.Types.ObjectId;
    role: string;
    roleType: RoleType,
    isSoftwareDevelopmentRole: boolean,
    softwareDevelopmentScope: ScopeType | "",
    summary: string,
    job: string;
    start: string; // Format: 'mm-yyyy'
    end: string;   // Format: 'mm-yyyy'
    months: number;
    present: boolean;
    text: string;
    technologies: TechnologyEntry[];
    techStack: TechStack[];
};

export type SectionsNames = typeof SECTIONS[number];

export type ExtractedCVData = {
    // technologies: TechnologiesEntry[],
    // techStack: TechStack[];
    position: string;
    sections: SectionsNames[];
    fullName: string;
    profileSection: {
        text: string;
        technologies: TechnologyEntry[];
        techStack: TechStack[];
    };
    skillSection: {
        text: string;
        technologies: TechnologyEntry[];
        techStack: TechStack[];
    }
    jobs: JobEntry[];
};