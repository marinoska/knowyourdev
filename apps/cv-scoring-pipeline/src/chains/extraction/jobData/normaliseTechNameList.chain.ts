import { RunnableSequence } from "@langchain/core/runnables";
import { gpt4oMini } from "../../../app/models.js";
import { parseJsonOutput } from "../../../utils/json.js";
import { jsonOutputPrompt } from "../../../utils/JsonOutput.prompt.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { TechModel } from "../../../tech/techModelType.js";
import { normaliseTechNameListPrompt } from "./normaliseTechNameList.prompt.js";
import { TechName } from "../../../tech/types.js";

const prompt = PromptTemplate.fromTemplate(`
${normaliseTechNameListPrompt}

${jsonOutputPrompt({
    technologies: 'matching technologies array',
})}

input_tech_list: {input_tech_list}
reference_tech_list: {reference_tech_list}
`);

export const normalizeTechList = async (input: string[]): Promise<TechName[]> => {
    const techNormalizer = RunnableSequence.from([
        prompt,  // Injects job description into prompt
        gpt4oMini, // Extracts technologies
        parseJsonOutput, // Parses JSON output
    ]);

    const techList = await TechModel.find({}, {name: 1}).lean();
    const {technologies} = (await techNormalizer.invoke({
        input_tech_list: input,
        reference_tech_list: techList.map(({name}) => name).join(',')
    }) as {
        technologies: TechName[]
    });

    return technologies;
}
