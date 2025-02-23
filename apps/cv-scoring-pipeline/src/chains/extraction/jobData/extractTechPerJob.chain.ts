import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { gpt4oMini } from "@/app/models.js";
import { parseJsonOutput } from "@/utils/json.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { extractTechPerJobPrompt } from "./extractTechPerJob.prompt.js";
import { normalizeTechList } from "./normaliseTechNameList.chain.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { JobEntry, TechName } from "@/models/types.js";

const prompt = PromptTemplate.fromTemplate(`
${extractTechPerJobPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technologies array',
})}

Job description:
{job_description}
`);

export const extractTechPerJob = async ({jobs, referenceTechList}: {
    jobs: JobEntry[],
    referenceTechList: TechName[]
}): Promise<JobEntry[]> => {
    const jobTechExtractor = RunnableSequence.from([
        prompt,  // Injects job description into prompt
        gpt4oMini, // Extracts technologies
        parseJsonOutput, // Parses JSON output
    ]);

    const enrichedJobsPromises = jobs.map(async (job: JobEntry) => {
        const {technologies} = (await jobTechExtractor.invoke({job_description: job.description}) as {
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
            stack: stackMatches,
        } satisfies JobEntry;
    });

    return await Promise.all(enrichedJobsPromises);
}
