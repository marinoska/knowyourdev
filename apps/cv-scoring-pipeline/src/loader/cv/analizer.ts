import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { parseCV } from "@/chains/extraction/CVData/parseCV.chain.js";
import { extractTechPerJob } from "@/chains/extraction/jobData/extractTechPerJob.chain.js";
import { TechModel } from "@/models/tech.model.js";
import { ExtractedCVData } from "@/models/types.js";
import { hash } from "@/utils/crypto.js";

async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

export async function analyzeCV(filePath: string): Promise<{
    hash: string;
} & ExtractedCVData> {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }

    const techDocList = await TechModel.find({}, {name: 1}).lean();
    const referenceTechList = techDocList.map(({name}) => name);

    const extractedData = await parseCV({cvText, referenceTechList});
    const enrichedJobs = await extractTechPerJob({jobs: extractedData.jobs, referenceTechList});

    return {...extractedData, jobs: [...enrichedJobs], hash: hash(extractedData.fullName)};
}
