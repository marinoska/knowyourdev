import { ExtractedCVData, TechDocument } from "@/models/types.js";

export type ExtractionChainInput = {
    cvText: string, techCollection: TechDocument[]
};

export type ExtractionChainParam =
    ExtractionChainInput | ExtractionChainInput & { extractedData: ExtractedCVData };
