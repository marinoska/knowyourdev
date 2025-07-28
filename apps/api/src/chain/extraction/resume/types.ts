import { TechDocument } from "@/models/types.js";
import { Schema } from "mongoose";
import { ExtractedResumeData } from "@kyd/common/api";

export type ExtractionChainInput = {
  cvText: string;
  techCollection: TechDocument[];
  uploadId: Schema.Types.ObjectId;
};

export type ExtractedData = ExtractionChainInput & {
  extractedData: ExtractedResumeData;
};
