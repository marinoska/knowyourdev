import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { gpt4oMini } from "@/app/aiModel";
import { parseJsonOutput } from "@/utils/json";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt";
import { extractTechProficiencyPrompt } from "@/chain/extraction/techs/sub/extractTechProficiency.prompt";
import { semanticSimilarity } from "@/chain/normalizer/semanticSimilarity";
import { PROFICIENCY, ProficiencyType } from "@/models/types";

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
