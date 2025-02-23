import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { parseCV } from "@/chains/extraction/CVData/parseCV.chain.js";
import { extractTechPerJob } from "@/chains/extraction/jobData/extractTechPerJob.chain.js";
import { TechModel } from "@/models/tech.model.js";
import { ExtractedCVData } from "@/models/types.js";
import { hash } from "@/utils/crypto.js";
import { pipe } from "@/utils/func.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";

async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

export async function runCVDataExtraction(filePath: string): Promise<{
    hash: string;
} & ExtractedCVData> {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }

    const techDocList = await TechModel.find({}, {name: 1}).lean();
    const referenceTechList = techDocList.map(({name}) => name);

    const inputData: ExtractionChainParam = {cvText, referenceTechList};
    const output = await pipe<ExtractionChainParam>(inputData, parseCV, extractTechPerJob);
    // type narrowing here
    if (!("extractedData" in output)) {
        throw new Error("extractedData cannot be empty");
    }

    return {...output.extractedData, hash: hash(output.extractedData.fullName)};
}
