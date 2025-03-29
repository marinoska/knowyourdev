import { TechDocument } from "@/models/types.js";
import { UploadDataDocumentType } from "@/models/uploadData.model.js";
import { Schema } from "mongoose";
import { ExtractedCVData } from "@kyd/common/api";
import { UploadTechProfileDocumentType } from "@/models/uploadTechProfile.model.js";

export type ExtractionChainInput = {
    cvText: string, techCollection: TechDocument[], uploadId: Schema.Types.ObjectId
};
export type ExtractionChainOutput = {
    cvData: UploadDataDocumentType,
    techProfile: UploadTechProfileDocumentType
};

export type ExtractionChainParam =
    ExtractionChainInput
    | ExtractionChainInput & { extractedData: ExtractedCVData }
    | ExtractionChainInput & { extractedData: ExtractedCVData } & ExtractionChainOutput;

