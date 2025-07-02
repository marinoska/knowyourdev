import { Schema } from "mongoose";
import {
  ProficiencyType,
  RoleType,
  ScopeType,
  SECTIONS,
  TechCode,
} from "./constants.js";
import { TechStack, TechType } from "./tech.js";
import { GAP_ROLE, GAP_JOB } from "../utils/index.js";

export type TechnologyEntry = {
  original: string; // Exact name as found in the job description
  normalized: string | ""; // Name from TechList by AI
  code: TechCode | ""; // Code of normalized name
  proficiency: ProficiencyType;
  techReference:
    | Schema.Types.ObjectId
    | (TechType & {
        _id: Schema.Types.ObjectId;
      })
    | null;
};

export type JobEntry = {
  _id: Schema.Types.ObjectId;
  role: string;
  roleType: RoleType;
  isSoftwareDevelopmentRole: boolean;
  softwareDevelopmentScope: ScopeType | "";
  summary: string;
  job: string;
  start: string; // Format: 'mm-yyyy'
  end: string; // Format: 'mm-yyyy'
  months: number;
  present: boolean;
  text: string;
  technologies: TechnologyEntry[];
  techStack: TechStack[];
};

export type EnhancedJobEntry = Omit<JobEntry, "start" | "end"> & {
  start: Date;
  end: Date;
};

export type SectionsNames = (typeof SECTIONS)[number];

export type GapEntry = {
  role: typeof GAP_ROLE;
  job: typeof GAP_JOB;
  start: Date;
  end: Date;
  months: number;
  popularity: 0;
};

export type ExtractedCVData<TJob = JobEntry> = {
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
  };
  jobs: TJob[];
};
