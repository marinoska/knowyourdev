import { TechDocument } from "@/models/types.js";
import { TUploadDataDocument } from "@/models/uploadData.model.js";
import { Schema } from "mongoose";
import { ExtractedCVData } from "@kyd/common/api";
import { TUploadTechProfileDocument } from "@/models/uploadTechProfile.model.js";

export type ExtractionChainInput = {
    cvText: string, techCollection: TechDocument[], uploadId: Schema.Types.ObjectId
};
export type ExtractionChainOutput = {
    cvData: TUploadDataDocument,
    techProfile: TUploadTechProfileDocument
};

export type ExtractionChainParam =
    ExtractionChainInput
    | ExtractionChainInput & { extractedData: ExtractedCVData }
    | ExtractionChainInput & { extractedData: ExtractedCVData } & ExtractionChainOutput;

