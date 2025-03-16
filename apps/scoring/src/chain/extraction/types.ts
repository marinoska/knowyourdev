import { TechDocument, TechProfileDocumentType } from "@/models/types";
import { CVDataDocumentType, ExtractedCVData } from "@/models/cvData.model";
import { Schema } from "mongoose";

export type ExtractionChainInput = {
    cvText: string, techCollection: TechDocument[], uploadId: Schema.Types.ObjectId
};
export type ExtractionChainOutput = {
    cvData: CVDataDocumentType,
    techProfile: TechProfileDocumentType
};

export type ExtractionChainParam =
    ExtractionChainInput
    | ExtractionChainInput & { extractedData: ExtractedCVData }
    | ExtractionChainInput & { extractedData: ExtractedCVData } & ExtractionChainOutput;

