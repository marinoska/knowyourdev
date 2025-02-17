import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { StructuredOutputParser } from 'langchain/output_parsers';
import {prompt} from './prompt.js';
import * as dotenv  from "dotenv";

dotenv.config();

// Initialize OpenAI model
const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

// Function to extract text from a CV (PDF)
async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

// Scoring Rule 2: Extract Tech Stack
const techStackPrompt = PromptTemplate.fromTemplate(`
${prompt}

CV:
{cv_text}
`);

const parser = StructuredOutputParser.fromNamesAndDescriptions({
    modern: 'Modern stack',
    aging: 'Aging stack',
    legacy: 'Legacy stack',
    score: 'Final Score'
});

// Use RunnableSequence instead of LLMChain
const techStackChain = RunnableSequence.from([
    techStackPrompt,
    model,
    parser
]);

async function analyzeCV(filePath: string) {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }

    // Placeholder for extracted tech stack analysis
    const techStackRaw = await techStackChain.invoke({ cv_text: cvText });
    const techStackResult = Array.isArray(techStackRaw.content) ? techStackRaw.content.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join(' ') : techStackRaw.content;

    console.log("Extracted Tech Stack:", techStackResult);

    return {
        techStack: JSON.parse(techStackResult),
        cvText,
    };
}

// Example usage
(async () => {
    const result = await analyzeCV("./cv/cv_dexter.pdf");
    console.log("Final Evaluation:", result);
})();
