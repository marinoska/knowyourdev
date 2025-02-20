import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { techExtraction } from "./prompt/TechExtraction.js";
import * as dotenv from "dotenv";
import { jsonOutput } from "./prompt/JSONOutput.js";
import { parseJsonOutput, safeJsonParse } from "./utils/json.js";

dotenv.config();

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

const techStackPrompt = PromptTemplate.fromTemplate(`
${techExtraction}

${jsonOutput({
    technologies: 'extracted technologies json object',
    jobs: 'extracted jobs json object',
})}

CV:
{cv_text}
`);

type ExtractedTech = {
    technologies: [],
    jobs: []
};

const buildChain = () => {
    const extractedTechnologies: ExtractedTech = {
        technologies: [],
        jobs: [],
    };

    return RunnableSequence.from([
        techStackPrompt,
        model,
        parseJsonOutput,
        (input: ExtractedTech) => {
            extractedTechnologies.jobs = input.jobs;
            extractedTechnologies.technologies = input.technologies;
            return input;
        },
    ]);
}

async function analyzeCV(filePath: string) {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }
    const techStackChain = buildChain();
    return await techStackChain.invoke({
        cv_text: cvText,
    });


    // return parseJsonOutput(techStackRaw.content);
}

(async () => {
    const result = await analyzeCV("./cv/cv_marina.pdf");
    console.log("Final Evaluation:", result);
})();
