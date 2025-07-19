import { RoleType, TechnologyEntry, TechStack } from "@kyd/common/api";
import { TResumeProfileDocument } from "@/models/resumeProfileModel.js";

export type InferredProjectData = {
  technologies: TechnologyEntry[];
  techStack: TechStack[];
  roleType: RoleType;
  isSoftwareDevelopmentRole: boolean;
  isMobileDevelopmentRole: boolean;
  summary: string;
  reasoning?: string;
};
export type SuggestedProjectTechnologies = {
  suggestedTechnologies: TechnologyEntry[];
  suggestedTechStack: TechStack[];
  reasoning: string;
};

export type ExtractionChainOutput = {
  // cvData: TResumeDataDocument;
  techProfile: TResumeProfileDocument;
};
