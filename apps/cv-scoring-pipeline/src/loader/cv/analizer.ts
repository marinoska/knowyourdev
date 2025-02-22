import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { parseCV } from "../../chains/extraction/CVData/parseCV.chain.js";
import { extractTechPerJob } from "../../chains/extraction/jobData/extractTechPerJob.chain.js";

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

    const extractedTechnologies = await parseCV(cvText);
    const enrichedJobs = await extractTechPerJob(extractedTechnologies.jobs);

    return {...extractedTechnologies, jobs: {...enrichedJobs}};
}
