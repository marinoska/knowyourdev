import { TechDocument } from "@/models/types.js";
import { Schema } from "mongoose";
import {
  ExtractedResumeData,
  RoleType,
  TechnologyEntry,
  TechStack,
} from "@kyd/common/api";
import { TResumeProfileDocument } from "@/models/resumeProfileModel.js";

export type ExtractedJobData = {
  technologies: TechnologyEntry[];
  techStack: TechStack[];
  roleType: RoleType;
  isSoftwareDevelopmentRole: boolean;
  isMobileDevelopmentRole: boolean;
  summary: string;
};

export type ExtractionChainInput = {
  description: string;
  title: string;
  techCollection: TechDocument[];
  projectId: Schema.Types.ObjectId;
};

export type ExtractionChainOutput = {
  // cvData: TResumeDataDocument;
  techProfile: TResumeProfileDocument;
};

export type ExtractionChainParam =
  | ExtractionChainInput
  | (ExtractionChainInput & { extractedJobData: ExtractedJobData })
  | (ExtractionChainInput & {
      extractedData: ExtractedResumeData;
    } & ExtractionChainOutput);
