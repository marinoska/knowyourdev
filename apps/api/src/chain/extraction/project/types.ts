import {
  RoleType,
  ScopeType,
  TechnologyEntry,
  TechStack,
} from "@kyd/common/api";
import { TResumeProfileDocument } from "@/models/resumeProfileModel.js";

export type ExtractedProjectData = {
  technologies: TechnologyEntry[];
  techStack: TechStack[];
  roleType: RoleType;
  isSoftwareDevelopmentRole: boolean;
  isMobileDevelopmentRole: boolean;
  summary: string;
  scopes: ScopeType[];
};

export type ExtractionChainOutput = {
  // cvData: TResumeDataDocument;
  techProfile: TResumeProfileDocument;
};
