import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { parseJsonOutput } from "@/utils/json.js";
import { ExtractCVDataPrompt } from "./extractCVData.prompt.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { gpt4oMini } from "@/app/models.js";
import { ExtractedCVData, JobEntry } from "@/models/types.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";

type OutputType = {
    fullName: string;
    skillSection: string;
    profileSection: string;
    jobs: JobEntry[];
}
const techPrompt = PromptTemplate.fromTemplate(`
${ExtractCVDataPrompt}

${jsonOutputPrompt({
    fullName: "extracted name and surname",
    skillSection: 'extracted skill section',
    profileSection: 'extracted profile/general description section',
    jobs: 'array of extracted job json objects',
})}
`);

export const extractCVData = async (params: ExtractionChainParam): Promise<ExtractionChainParam> => {
    if (!("cvText" in params))
        throw new Error("cvText is required");

    const {cvText} = params;

    const techExtractionChain = RunnableSequence.from<{ cv_text: string }, OutputType>([
        techPrompt,
        gpt4oMini,
        parseJsonOutput,
    ]);

    const extractedData = (await techExtractionChain.invoke({
        cv_text: cvText,
    }));
    // todo validate extractedData for errors/completeness

    return {
        ...params,
        extractedData: {
            fullName: extractedData.fullName,
            jobs: extractedData.jobs,
            profileSection: {
                text: extractedData.profileSection
            },
            skillSection: {
                text: extractedData.skillSection
            }
        } as ExtractedCVData
    };
}
