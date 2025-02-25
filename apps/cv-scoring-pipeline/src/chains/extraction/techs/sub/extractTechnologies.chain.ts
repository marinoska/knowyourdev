import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { gpt4oMini } from "@/app/models.js";
import { parseJsonOutput } from "@/utils/json.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { extractTechnologiesPrompt } from "./extractTechnologies.prompt.js";
import { normalizeTechList } from "../normaliseTechNameList.chain.js";
import { JobEntry } from "@/models/types.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";
import { extractTechProficiency } from "@/chains/extraction/techs/sub/extractTechProficiency.chain.js";

const prompt = PromptTemplate.fromTemplate(`
${extractTechnologiesPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technologies array',
})}

Work experience description:
{description}
`);

type Output = {
    technologies: string[]
};

//role + description
export const extractTechnologies = async (params: ExtractionChainParam): Promise<ExtractionChainParam> => {
    if (!("extractedData" in params))
        throw new Error("extractedData is required");
    const {extractedData, techNamesMap} = params;

    const jobTechExtractor = RunnableSequence.from<{ description: string }, Output>([
        prompt,  // Injects job description into prompt
        gpt4oMini, // Extracts technologies
        parseJsonOutput, // Parses JSON output
    ]);

    async function extracted(text: string) {
        const {technologies} = (await jobTechExtractor.invoke({
            description: text,
        })); // Process each job separately

        const normalisedTechList = technologies.length ? await normalizeTechList({
            inputTechList: technologies,
            referenceTechList: Object.values(techNamesMap),
            techNamesMap: params.techNamesMap
        }) : [];

        const proficiency = technologies.length ? await extractTechProficiency({
            inputTechList: technologies,
            description: text
        }) : {};

        return normalisedTechList.map(tech => ({
            ...tech,
            proficiency: proficiency[tech.original]
        }));
    }

    const profileTechs = extractedData.profileSection.text && await extracted(extractedData.profileSection.text);
    const skillTechs = extractedData.skillSection.text && await extracted(extractedData.skillSection.text);

    const jobsTechPromises = extractedData.jobs.map(async (job: JobEntry) => {
        const normalisedTechList = await extracted(job.text);

        // const stackMatches = await TechStackModel.identifyStack(normalisedTechList);

        return {
            ...job,
            technologies: normalisedTechList,
            // ...rest,
            // stack: stackMatches,
        } satisfies JobEntry;
    });

    return {
        ...params,
        extractedData:
            {
                ...extractedData,
                jobs: await Promise.all(jobsTechPromises),
                profileSection: {
                    ...extractedData.profileSection,
                    technologies: profileTechs || [],
                },
                skillSection: {
                    ...extractedData.skillSection,
                    technologies: skillTechs || [],
                }
            },
    };
}
