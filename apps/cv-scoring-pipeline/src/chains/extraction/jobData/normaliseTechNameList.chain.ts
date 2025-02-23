import { RunnableSequence } from "@langchain/core/runnables";
import { gpt4oMini } from "../../../app/models.js";
import { parseJsonOutput } from "../../../utils/json.js";
import { jsonOutputPrompt } from "../../../utils/JsonOutput.prompt.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { normaliseTechNameListPrompt } from "./normaliseTechNameList.prompt.js";
import { TechName } from "@/models/types.js";

const prompt = PromptTemplate.fromTemplate(`
${normaliseTechNameListPrompt}

${jsonOutputPrompt({
    technologies: 'matching technologies array',
})}

input_tech_list: {input_tech_list}
reference_tech_list: {reference_tech_list}
`);

export const normalizeTechList = async ({inputTechList, referenceTechList}: {
                                            inputTechList: string[],
                                            referenceTechList: TechName[]
                                        }
): Promise<TechName[]> => {
    const techNormalizer = RunnableSequence.from([
        prompt,  // Injects job description into prompt
        gpt4oMini, // Extracts technologies
        parseJsonOutput, // Parses JSON output
    ]);

    const {technologies} = (await techNormalizer.invoke({
        input_tech_list: inputTechList,
        reference_tech_list: referenceTechList
    }) as {
        technologies: TechName[]
    });
    // todo check extractedData for errors

    return technologies;
}
