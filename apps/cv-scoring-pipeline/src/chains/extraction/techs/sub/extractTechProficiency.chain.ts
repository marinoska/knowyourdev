import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { gpt4oMini } from "@/app/models.js";
import { parseJsonOutput } from "@/utils/json.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { extractTechProficiencyPrompt } from "@/chains/extraction/techs/sub/extractTechProficiency.prompt.js";
import { semanticSimilarity } from "@/chains/normalizer/semanticSimilarity.js";
import { PROFICIENCY, ProficiencyType } from "@/models/types.js";

const prompt = PromptTemplate.fromTemplate(`
${extractTechProficiencyPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technology data array',
})}
`);

type Output = {
    technologies: Record<string, ProficiencyType>;
};

type Params = {
    inputTechList: string[],
    description: string,
};

export const extractTechProficiency = async (params: Params): Promise<Output["technologies"]> => {
    const {inputTechList, description} = params;

    const profExtractor = RunnableSequence.from<{ description: string, input_tech_list: string[] }, Output>([
        prompt,  // Injects job description into prompt
        gpt4oMini, // Extracts technologies
        parseJsonOutput, // Parses JSON output
    ]);

    const {technologies} = (await profExtractor.invoke({
        description,
        input_tech_list: inputTechList,
    }));

    const output = {} as Output["technologies"];
    const proficiencyNormalizer = semanticSimilarity<ProficiencyType>([...PROFICIENCY]);
    Object.keys(technologies).forEach(tech => {
        output[tech] = proficiencyNormalizer(technologies[tech]) || "" as ProficiencyType;
    })

    return output;
}
