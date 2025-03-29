import { TechDocument, TechProfileDocumentType } from "@/models/types";
import { UploadDataDocumentType } from "@/models/uploadData.model";
import { Schema } from "mongoose";
import { ExtractedCVData } from "@kyd/common/api";

export type ExtractionChainInput = {
    cvText: string, techCollection: TechDocument[], uploadId: Schema.Types.ObjectId
};
export type ExtractionChainOutput = {
    cvData: UploadDataDocumentType,
    techProfile: TechProfileDocumentType
};

export type ExtractionChainParam =
    ExtractionChainInput
    | ExtractionChainInput & { extractedData: ExtractedCVData }
    | ExtractionChainInput & { extractedData: ExtractedCVData } & ExtractionChainOutput;

