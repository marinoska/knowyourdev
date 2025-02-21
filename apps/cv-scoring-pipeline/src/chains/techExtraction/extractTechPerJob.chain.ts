import { RunnableSequence } from "@langchain/core/runnables";
import { JobEntry } from "./types.js";
import { gpt4oMini } from "../../app/models.js";
import { parseJsonOutput } from "../../utils/json.js";
import { techPerJobExtractionPrompt } from "./prompt/TechPerJobExtractionPrompt.js";
import { jsonOutputPrompt } from "../../utils/JsonOutputPrompt.js";
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate(`
${techPerJobExtractionPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technologies array',
})}

Job description:
{job_description}
`);

export const extractTechPerJob = async (jobs: JobEntry[]): Promise<JobEntry[]> => {
    const jobTechExtractor = RunnableSequence.from([
        prompt,  // Injects job description into prompt
        gpt4oMini, // Extracts technologies
        parseJsonOutput, // Parses JSON output
    ]);

    const enrichedJobsPromises =  jobs.map(async (job: JobEntry) => {
        const { technologies } = (await jobTechExtractor.invoke({job_description: job.description}) as {
            technologies: string[]
        }); // Process each job separately

        return {
            ...job,
            technologies,
        } satisfies JobEntry;
    });

    return await Promise.all(enrichedJobsPromises);
}
