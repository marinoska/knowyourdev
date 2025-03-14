import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractCVData } from "@/chain/extraction/cvData/extractCVData.chain";
import { pipe } from "@/utils/func";
import { ExtractionChainParam } from "@/chain/extraction/types";
import { extractTechnologies } from "@/chain/extraction/techs/extractTechnologies.chain";
import { aggregateAndSave } from "@/chain/extraction/aggregateAndSave";
import { TechModel } from "@/models/tech.model";
import { ExtractedCVData } from "@/models/cvData.model";

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
