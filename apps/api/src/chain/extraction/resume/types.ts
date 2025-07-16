import { TechDocument } from "@/models/types.js";
import { Schema } from "mongoose";
import { ExtractedResumeData } from "@kyd/common/api";
import { TResumeProfileDocument } from "@/models/resumeProfileModel.js";

export type ExtractionChainInput = {
  cvText: string;
  techCollection: TechDocument[];
  uploadId: Schema.Types.ObjectId;
};
export type ExtractionChainOutput = {
  // cvData: TResumeDataDocument;
  techProfile: TResumeProfileDocument;
};

export type ExtractionChainParam =
  | ExtractionChainInput
  | (ExtractionChainInput & { extractedData: ExtractedResumeData })
  | (ExtractionChainInput & {
      extractedData: ExtractedResumeData;
    } & ExtractionChainOutput);
