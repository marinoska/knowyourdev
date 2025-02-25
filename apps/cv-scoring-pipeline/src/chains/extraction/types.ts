import { ExtractedCVData, TechDocument } from "@/models/types.js";

export type ExtractionChainParam = { cvText: string, techNamesMap: TechNamesMap, techNamesString: string } |
    { techNamesMap: TechNamesMap, extractedData: ExtractedCVData, techNamesString: string };

export type TechNamesMap = Record<TechDocument["code"], TechDocument['name']>;