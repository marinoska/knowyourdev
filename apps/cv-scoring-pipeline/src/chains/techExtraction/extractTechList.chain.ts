import { RunnableSequence } from "@langchain/core/runnables";
import { parseJsonOutput } from "../../utils/json.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { techExtractionPrompt } from "./prompt/TechExtractionPrompt.js";
import { jsonOutputPrompt } from "../../utils/JsonOutputPrompt.js";
import { gpt4oMini } from "../../app/models.js";
import { ExtractedTech } from "./types.js";

const prompt = PromptTemplate.fromTemplate(`
${techExtractionPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technologies json object',
    jobs: 'extracted jobs json object',
})}

CV:
{cv_text}
`);

export const extractTechList = async (cvText: string): Promise<ExtractedTech> => {
    const chain = RunnableSequence.from([
        prompt,
        gpt4oMini,
        parseJsonOutput,
    ]);

    const res = await chain.invoke({
        cv_text: cvText,
    });

    return res as ExtractedTech;
}
