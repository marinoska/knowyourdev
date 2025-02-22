import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { parseJsonOutput } from "../../../utils/json.js";
import { ParseCVPrompt } from "./parseCV.prompt.js";
import { jsonOutputPrompt } from "../../../utils/JsonOutput.prompt.js";
import { gpt4oMini } from "../../../app/models.js";
import { ExtractedCVData } from "../types.js";
import { TechStackModel } from "../../../tech/techStack.model.js";
import { TechModel } from "../../../tech/techModelType.js";
import { isNotNull } from "../../../utils/types.utils.js";

const techPrompt = PromptTemplate.fromTemplate(`
${ParseCVPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technologies json object',
    jobs: 'extracted jobs json object',
})}
`);

export const parseCV = async (cvText: string): Promise<ExtractedCVData> => {
    const techExtractionChain = RunnableSequence.from<{ cv_text: string, tech_list: string }, ExtractedCVData>([
        techPrompt,
        gpt4oMini,
        parseJsonOutput,
    ]);

    const techList = await TechModel.find({}, {name: 1}).lean();

    const extractedData = (await techExtractionChain.invoke({
        cv_text: cvText,
        tech_list: techList.map(({name}) => name).join(',')
    }));

    const stackMatches = await TechStackModel.identifyStack(extractedData.technologies.map(tech => tech.name).filter(isNotNull));

    return {...extractedData, techStack: stackMatches || []};
}
