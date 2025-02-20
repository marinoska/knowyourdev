import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import * as dotenv from "dotenv";
import { extractTechList } from "./chains/techExtraction/extractTechList.js";
import { ExtractedTech } from "./chains/techExtraction/types.js";
import { extractTechPerJob } from "./chains/techExtraction/extractTechPerJob.js";

dotenv.config();

async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

async function analyzeCV(filePath: string) {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }

    const extractedTechnologies: ExtractedTech = {
        technologies: [],
        jobs: [],
    };

    const output = await extractTechList(cvText);
    extractedTechnologies.jobs = output.jobs;
    extractedTechnologies.technologies = output.technologies;

    const enrichedJobs = await extractTechPerJob(extractedTechnologies.jobs);
    return {...extractedTechnologies, jobs: {...enrichedJobs}};
}

(async () => {
    const result = await analyzeCV("./cv/cv_marina.pdf");
    console.log("Final Evaluation:", result);
})();
