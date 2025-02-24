import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { gpt4oMini } from "@/app/models.js";
import { parseJsonOutput } from "@/utils/json.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { extractTechPerJobPrompt } from "./extractTechPerJob.prompt.js";
import { normalizeTechList } from "./normaliseTechNameList.chain.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { JobEntry } from "@/models/types.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";

const prompt = PromptTemplate.fromTemplate(`
${extractTechPerJobPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technologies array',
})}

Job role:
{job_role}
Job description:
{job_description}
`);

export const extractTechPerJob = async (param: ExtractionChainParam): Promise<ExtractionChainParam> => {
    if (!("extractedData" in param))
        throw new Error("extractedData is required");
    const {extractedData, referenceTechList} = param;

    const jobTechExtractor = RunnableSequence.from([
        prompt,  // Injects job description into prompt
        gpt4oMini, // Extracts technologies
        parseJsonOutput, // Parses JSON output
    ]);

    const enrichedJobsPromises = extractedData.jobs.map(async (job: JobEntry) => {
        const {technologies, ...rest} = (await jobTechExtractor.invoke({
            job_description: job.description,
            job_role: job.role
        }) as {
            technologies: string[]
        }); // Process each job separately

        const normalisedTechList = technologies.length ? await normalizeTechList({
            inputTechList: technologies,
            referenceTechList: referenceTechList
        }) : [];

        const stackMatches = await TechStackModel.identifyStack(normalisedTechList);

        return {
            ...job,
            technologies: normalisedTechList,
            ...rest,
            stack: stackMatches,
        } satisfies JobEntry;
    });

    return {
        extractedData:
            {
                ...extractedData,
                jobs: await Promise.all(enrichedJobsPromises)
            },
        referenceTechList
    };
}
