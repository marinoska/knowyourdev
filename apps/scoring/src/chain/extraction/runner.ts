import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractCVData } from "@/chain/extraction/cvData/extractCVData.chain.ts";
import { pipe } from "@/utils/func.ts";
import { ExtractionChainParam } from "@/chain/extraction/types.ts";
import { extractTechnologies } from "@/chain/extraction/techs/extractTechnologies.chain.ts";
import { aggregateAndSave } from "@/chain/extraction/aggregateAndSave.ts";
import { TechModel } from "@/models/tech.model.ts";
import { ExtractedCVData } from "@/models/cvData.model.ts";

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
