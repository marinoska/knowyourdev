import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { parseJsonOutput } from "@/utils/json.js";
import { ParseCVPrompt } from "./parseCV.prompt.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { gpt4oMini } from "@/app/models.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { isNotNull } from "@/utils/types.utils.js";
import { ExtractedCVData } from "@/models/types.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";

const techPrompt = PromptTemplate.fromTemplate(`
${ParseCVPrompt}

${jsonOutputPrompt({
    fullName: "extracted name and surname",
    technologies: 'extracted technologies json object',
    jobs: 'extracted jobs json object',
})}
`);

export const parseCV = async (param: ExtractionChainParam): Promise<ExtractionChainParam> => {

    if (!("cvText" in param))
        throw new Error("cvText is required");

    const {cvText, referenceTechList} = param;

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

    return {
        extractedData:
            {
                ...extractedData,
                techStack: stackMatches || []
            },
        referenceTechList
    };
}
