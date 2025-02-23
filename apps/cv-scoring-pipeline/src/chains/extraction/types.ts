import { ExtractedCVData, TechName } from "@/models/types.js";

export type ExtractionChainParam = { cvText: string, referenceTechList: TechName[] } |
    { referenceTechList: TechName[], extractedData: ExtractedCVData };
