import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractTechList } from "../../chains/techExtraction/extractTechList.chain.js";
import { extractTechPerJob } from "../../chains/techExtraction/extractTechPerJob.chain.js";

async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

export async function analyzeCV(filePath: string) {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }

    const extractedTechnologies = await extractTechList(cvText);
    const enrichedJobs = await extractTechPerJob(extractedTechnologies.jobs);

    return {...extractedTechnologies, jobs: {...enrichedJobs}};
}
