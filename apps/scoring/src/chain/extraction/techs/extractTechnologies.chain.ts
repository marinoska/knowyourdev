import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { gpt4oMini } from "@/app/aiModel";
import { parseJsonOutput } from "@/utils/json";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt";
import { extractTechnologiesPrompt } from "./extractTechnologies.prompt";
import { normalizeTechList } from "./sub/normaliseTechNameList.chain";
import { RoleType } from "@/models/types";
import { ExtractionChainParam } from "@/chain/extraction/types";
import { extractTechProficiency } from "@/chain/extraction/techs/sub/extractTechProficiency.chain";
import { TechStackModel } from "@/models/techStack.model";
import { JobEntry, TechnologyEntry } from "@kyd/types/api";

const prompt = PromptTemplate.fromTemplate(`
${extractTechnologiesPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technologies array',
})}

Work experience description:
{description}
`);


type Output = {
    technologies: string[];
    roleType: string;
    isSoftwareDevelopmentRole: boolean;
    summary: string;
};

const jobTechExtractor = RunnableSequence.from<{ description: string }, Output>([
    prompt,  // Injects job description into prompt
    gpt4oMini, // Extracts technologies
    parseJsonOutput, // Parses JSON output
]);

//role + description
export const extractTechnologies = async (params: ExtractionChainParam): Promise<ExtractionChainParam> => {
    if (!("extractedData" in params))
        throw new Error("extractedData is required");

    const {extractedData, techCollection} = params;

    async function extracted(text: string): Promise<Partial<JobEntry>> {
        if (!text) return {technologies: [], techStack: []};

        const {technologies, roleType, isSoftwareDevelopmentRole, summary} = (await jobTechExtractor.invoke({
            description: text,
        })); // Process each job separately

        const normalisedTechList = technologies.length ? await normalizeTechList({
            inputTechList: technologies,
            techDocList: techCollection
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
            roleType: roleType as RoleType,
            isSoftwareDevelopmentRole,
            summary
        }
    }

    const profileTechs = await extracted(extractedData.profileSection.text);
    const skillTechs = await extracted(extractedData.skillSection.text);

    const jobsTechPromises = extractedData.jobs.map(async (job: JobEntry) => {
        const extractedTechData = await extracted(`Role: ${job.role}. Description: ${job.text}`);


        return {
            ...job,
            // technologies: extractedTechData.technologies || [],
            // techStack: extractedTechData.techStack || [],
            ...extractedTechData
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
                    technologies: profileTechs.technologies || [],
                    techStack: profileTechs.techStack || []
                },
                skillSection: {
                    ...extractedData.skillSection,
                    technologies: skillTechs.technologies || [],
                    techStack: skillTechs.techStack || []
                }
            },
    };
}
