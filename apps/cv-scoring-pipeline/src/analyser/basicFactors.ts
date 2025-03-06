import { ExtractionChainOutput } from "@/chain/extraction/types.js";
import { FactorsType } from "@/models/types.js";

export const getBasicFactors = (params: ExtractionChainOutput) => {
    const output: FactorsType = {
        hash: params.cvData.hash,
        hasJobHistory: Boolean(params.cvData.jobs.length),
        hasSkillsListed: Boolean(params.techProfile.technologies.length),
        isITEngineer: params.cvData.jobs.some(job => job.roleType === "SE"),
        sectionsNumber: params.cvData.sections.length
    } as FactorsType;

    return output;
}