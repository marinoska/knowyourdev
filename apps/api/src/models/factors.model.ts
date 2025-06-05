import mongoose from "mongoose";
import { FactorsDocumentType, FactorsModelType } from "@/models/types.js";

// Define Job History Quality Schema
const JobHistoryQualitySchema = new mongoose.Schema(
  {
    hasDetailedJobs: { type: Boolean, required: true },
    hasConsistentSkills: { type: Boolean, required: true },
    hasStructuredTechnologies: { type: Boolean, required: true },
    hasLogicalCareerProgression: { type: Boolean, required: true },
    hasUnexpectedRegressions: { type: Boolean, required: true },
    hasJobDescriptionDetails: { type: Boolean, required: true },
    hasVagueDescriptions: { type: Boolean, required: true },
    hasClearJobDates: { type: Boolean, required: true },
    hasEmploymentGaps: { type: Boolean, required: true },
  },
  { _id: false },
);

// Define Skill Assessment Schema
const SkillAssessmentSchema = new mongoose.Schema(
  {
    hasModernStack: { type: Boolean, required: true },
    hasAgingTechListed: { type: Boolean, required: true },
    hasAgingTechInUse: { type: Boolean, required: true },
    hasJuniorLikeSkills: { type: Boolean, required: true },
    hasGenericSkills: { type: Boolean, required: true },
    hasNonTechnicalItemsInSkills: { type: Boolean, required: true },
    hasFrameworksListed: { type: Boolean, required: true },
    hasOnlyLanguages: { type: Boolean, required: true },
    hasInconsistentLanguageFrameworkPairs: { type: Boolean, required: true },
  },
  { _id: false },
);

// Define AI Content Detection Schema
const AIContentDetectionSchema = new mongoose.Schema(
  {
    hasAIGeneratedContent: { type: Boolean, required: true },
    hasInconsistentPhrasing: { type: Boolean, required: true },
    hasOverlyGenericWriting: { type: Boolean, required: true },
  },
  { _id: false },
);

// Define Main Factors Schema
const FactorsSchema = new mongoose.Schema<
  FactorsDocumentType,
  FactorsModelType
>({
  hash: { type: String, required: true, unique: true },
  cvCompleteness: {
    isITEngineer: { type: Boolean, required: true },
    hasJobHistory: { type: Boolean, required: true },
    hasSkillsListed: { type: Boolean, required: true },
    sectionsNumber: { type: Number },
  },
  // seniorityLevel: {},
  jobHistoryQuality: { type: JobHistoryQualitySchema, default: null },
  skillAssessment: { type: SkillAssessmentSchema, default: null },
  AIContentDetection: { type: AIContentDetectionSchema, default: null },
});

// Create and export Mongoose model
export const FactorsModel = mongoose.model<
  FactorsDocumentType,
  FactorsModelType
>("Factors", FactorsSchema);
