import { TechDocument } from "@/models/types.js";
import { TResumeDataDocument } from "@/models/resumeDataModel.js";
import { Schema } from "mongoose";
import { ExtractedCVData } from "@kyd/common/api";
import { TResumeTechProfileDocument } from "@/models/resumeTechProfileModel.js";

export type ExtractionChainInput = {
  cvText: string;
  techCollection: TechDocument[];
  uploadId: Schema.Types.ObjectId;
};
export type ExtractionChainOutput = {
  // cvData: TResumeDataDocument;
  techProfile: TResumeTechProfileDocument;
};

export type ExtractionChainParam =
  | ExtractionChainInput
  | (ExtractionChainInput & { extractedData: ExtractedCVData })
  | (ExtractionChainInput & {
      extractedData: ExtractedCVData;
    } & ExtractionChainOutput);
