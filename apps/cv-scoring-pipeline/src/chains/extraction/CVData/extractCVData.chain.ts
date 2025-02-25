import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { parseJsonOutput } from "@/utils/json.js";
import { ExtractCVDataPrompt } from "./extractCVData.prompt.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { gpt4oMini } from "@/app/models.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { isNotNull } from "@/utils/types.utils.js";
import { ExtractedCVData, PROFICIENCY, ProficiencyType } from "@/models/types.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";
import { semanticSimilarity } from "@/chains/normalizer/semanticSimilarity.js";
import { overlapSimilarity } from "@/chains/normalizer/overlapSimilarity.js";
import { generateTechCode } from "@/utils/func.js";

const techPrompt = PromptTemplate.fromTemplate(`
${ExtractCVDataPrompt}

${jsonOutputPrompt({
    fullName: "extracted name and surname",
    technologies: 'extracted technologies json object',
    jobs: 'extracted jobs json object',
})}
`);

export const extractCVData = async (params: ExtractionChainParam): Promise<ExtractionChainParam> => {

    if (!("cvText" in params))
        throw new Error("cvText is required");

    const {cvText, techNamesMap, techNamesString} = params;

    const techExtractionChain = RunnableSequence.from<{ cv_text: string, tech_list: string }, ExtractedCVData>([
        techPrompt,
        gpt4oMini,
        parseJsonOutput,
    ]);

    const extractedData = (await techExtractionChain.invoke({
        cv_text: cvText,
        tech_list: techNamesString
    }));
    // todo check extractedData for errors/completeness

    const stackMatches = await TechStackModel.identifyStack(extractedData.technologies.map(tech => tech.name).filter(isNotNull));

    const proficiencyNormalizer = semanticSimilarity<ProficiencyType>([...PROFICIENCY]);
    const techNameNormalizer = overlapSimilarity(Object.keys(techNamesMap));
    const technologies = extractedData.technologies.map(tech => {
        const normalizedTechName = tech.name ? techNameNormalizer(generateTechCode(tech.name)) : techNameNormalizer(generateTechCode(tech.originalName));
        return {
            ...tech,
            code: normalizedTechName || "",
            proficiency: tech.proficiency ? proficiencyNormalizer(tech.proficiency) : undefined
        };
    });

    return {
        ...params,
        extractedData:
            {
                ...extractedData,
                technologies,
                techStack: stackMatches || []
            },
    };
}
