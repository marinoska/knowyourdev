import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { gpt4oMini } from "@/app/models.js";
import { parseJsonOutput } from "@/utils/json.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { extractTechnologiesPrompt } from "./extractTechnologies.prompt.js";
import { normalizeTechList } from "./sub/normaliseTechNameList.chain.js";
import { JobEntry, TechnologyEntry, TechStack } from "@/models/types.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";
import { extractTechProficiency } from "@/chains/extraction/techs/sub/extractTechProficiency.chain.js";
import { TechStackModel } from "@/models/techStack.model.js";

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

    async function extracted(text: string): Promise<{ technologies: TechnologyEntry[], techStack: TechStack[] }> {
        if (!text) return {technologies: [], techStack: []};

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

        const technologiesEntry = normalisedTechList.map<TechnologyEntry>(tech => ({
            ...tech,
            proficiency: proficiency[tech.original]
        }));

        const stackMatches = await TechStackModel.identifyStack(normalisedTechList.map(tech => tech.code));
        
        return {
            technologies: technologiesEntry,
            techStack: stackMatches,
        }
    }

    const profileTechs = await extracted(extractedData.profileSection.text);
    const skillTechs = await extracted(extractedData.skillSection.text);

    const jobsTechPromises = extractedData.jobs.map(async (job: JobEntry) => {
        const extractedTechData = await extracted(job.text);


        return {
            ...job,
            technologies: extractedTechData.technologies,
            stack: extractedTechData.techStack,
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
                    technologies: profileTechs.technologies,
                    stack: profileTechs.techStack
                },
                skillSection: {
                    ...extractedData.skillSection,
                    technologies: skillTechs.technologies,
                    stack: skillTechs.techStack
                }
            },
    };
}
