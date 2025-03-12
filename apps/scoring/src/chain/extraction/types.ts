import { TechDocument, TechProfileDocumentType } from "@/models/types.ts";
import { CVDataDocumentType, ExtractedCVData } from "@/models/cvData.model.ts";

export type ExtractionChainInput = {
    cvText: string, techCollection: TechDocument[]
};
export type ExtractionChainOutput = {
    cvData: CVDataDocumentType,
    techProfile: TechProfileDocumentType
};

export type ExtractionChainParam =
    ExtractionChainInput
    | ExtractionChainInput & { extractedData: ExtractedCVData }
    | ExtractionChainInput & { extractedData: ExtractedCVData } & ExtractionChainOutput;

