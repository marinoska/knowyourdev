import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { parseJsonOutput } from "@/utils/json.js";
import { ParseCVPrompt } from "./parseCV.prompt.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { gpt4oMini } from "@/app/models.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { isNotNull } from "@/utils/types.utils.js";
import { ExtractedCVData, TechName } from "@/models/types.js";

const techPrompt = PromptTemplate.fromTemplate(`
${ParseCVPrompt}

${jsonOutputPrompt({
    fullName: "extracted name and surname",
    technologies: 'extracted technologies json object',
    jobs: 'extracted jobs json object',
})}
`);

export const parseCV = async ({cvText, referenceTechList}: {
    cvText: string,
    referenceTechList: TechName[]
}): Promise<ExtractedCVData> => {
    const techExtractionChain = RunnableSequence.from<{ cv_text: string, tech_list: string }, ExtractedCVData>([
        techPrompt,
        gpt4oMini,
        parseJsonOutput,
    ]);


    const extractedData = (await techExtractionChain.invoke({
        cv_text: cvText,
        tech_list: referenceTechList.join(',')
    }));
    // todo check extractedData for errors/completeness

    const stackMatches = await TechStackModel.identifyStack(extractedData.technologies.map(tech => tech.name).filter(isNotNull));

    return {...extractedData, techStack: stackMatches || []};
}
