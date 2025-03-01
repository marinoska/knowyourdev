import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractCVData } from "@/chains/extraction/CVData/extractCVData.chain.js";
import { ExtractedCVData } from "@/models/types.js";
import { pipe } from "@/utils/func.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";
import { extractTechnologies } from "@/chains/extraction/techs/extractTechnologies.chain.js";
import { aggregateAndSave } from "@/chains/extraction/aggregateAndSave.js";
import { TechModel } from "@/models/tech.model.js";

async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

export async function runCVDataExtraction(filePath: string): Promise<ExtractedCVData> {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }
    const techCollection = await TechModel.find().lean();

    const inputData: ExtractionChainParam = {
        cvText,
        techCollection
    };

    const output = await pipe<ExtractionChainParam>(
        inputData,
        extractCVData,
        extractTechnologies,
        aggregateAndSave
    );

    // @ts-ignore
    return output.extractedData;
}

// Example Usage
// const ranges = [
//     { start: new Date(2023, 0, 1), end: new Date(2023, 2, 31) }, // Jan - Mar 2023
//     { start: new Date(2023, 1, 1), end: new Date(2023, 3, 30) }, // Feb - Apr 2023 (overlaps)
//     { start: new Date(2023, 5, 1), end: new Date(2023, 6, 31) }, // Jun - Jul 2023
// ];
//
// const mergedRanges = mergeRanges(ranges); // Merge the overlapping ranges
// const totalMonths = calculateTotalMonths(mergedRanges); // Calculate total unique months
//
// console.log("Merged Ranges: ", mergedRanges);
// console.log("Total Unique Months: ", totalMonths);