import { ExtractionChainOutput } from "@/chain/extraction/types.ts";
import { FactorsType } from "@/models/types.ts";

export const getBasicFactors = (params: ExtractionChainOutput) => {
    const output: FactorsType = {
        hash: params.cvData.hash,
        cvCompleteness: {
            hasJobHistory: Boolean(params.cvData.jobs.length),
            hasSkillsListed: Boolean(params.techProfile.technologies.length),
            isITEngineer: params.cvData.jobs.some(job => job.roleType === "SE"),
            sectionsNumber: params.cvData.sections.length
        }
    } as FactorsType;

    return output;
}