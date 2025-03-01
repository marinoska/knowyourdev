import { ExtractedCVData, TechDocument } from "@/models/types.js";

export type ExtractionChainParam = { cvText: string } |
    { extractedData: ExtractedCVData };

export type TechNamesMap = Record<TechDocument["code"], TechDocument['name']>;