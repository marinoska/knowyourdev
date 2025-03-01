import { RunnableSequence } from "@langchain/core/runnables";
import { gpt4oMini } from "@/app/models.js";
import { parseJsonOutput } from "@/utils/json.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { normaliseTechNameListPrompt } from "./normaliseTechNameList.prompt.js";
import { TechDocument, TechnologyEntry } from "@/models/types.js";
import { semanticSimilarity } from "@/chains/normalizer/semanticSimilarity.js";
import { overlapSimilarity } from "@/chains/normalizer/overlapSimilarity.js";
import { generateTechCode } from "@/utils/func.js";

const prompt = PromptTemplate.fromTemplate(`
${normaliseTechNameListPrompt}

${jsonOutputPrompt({
    technologies: 'matching technologies array',
})}

input_tech_list: {input_tech_list}
reference_tech_list: {reference_tech_list}
`);

type Output = {
    technologies: {
        original: string;
        normalized?: string;
    }[]
};

type Params = {
    inputTechList: string[],
    techDocList: TechDocument[];
};

export const normalizeTechList = async ({inputTechList, techDocList}: Params
): Promise<Omit<TechnologyEntry, "proficiency">[]> => {
    const techNormalizer = RunnableSequence.from<{
        input_tech_list: string[],
        reference_tech_list: string[]
    }, Output>([
        prompt,  // Injects job description into prompt
        gpt4oMini, // Extracts technologies
        parseJsonOutput, // Parses JSON output
    ]);


    const referenceTechList = techDocList.map(({name}) => name);
    const {technologies} = (await techNormalizer.invoke({
        input_tech_list: inputTechList,
        reference_tech_list: referenceTechList
    }));
    // todo validate extractedData for errors

    const codeTechDocMap = techDocList.reduce<Record<string, TechDocument>>((acc, techDoc) => ({
        ...acc,
        [techDoc.code]: techDoc
    }), {});
    const techCodes = Object.keys(codeTechDocMap);
    const techNameSemanticNormalizer = semanticSimilarity(referenceTechList);
    const techNameOverlapNormalizer = overlapSimilarity(techCodes);
    const techs = technologies.map(tech => {
        const normalized = tech.normalized ? tech.normalized : techNameSemanticNormalizer(tech.original);

        const code = normalized ? techNameOverlapNormalizer(generateTechCode(normalized)) : techNameOverlapNormalizer(generateTechCode(tech.original));
        const techDoc = code ? codeTechDocMap?.[code] : null;
        return {
            ...tech,
            normalized: normalized || "",
            code: code || "",
            techReference: techDoc?._id || null, // Reference the TechModel object
        } satisfies Omit<TechnologyEntry, "proficiency">;
    });

    return techs;
}
