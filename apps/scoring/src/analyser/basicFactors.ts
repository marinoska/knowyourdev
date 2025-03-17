import { ExtractionChainOutput } from "@/chain/extraction/types";
import { FactorsType } from "@/models/types";

export const getBasicFactors = (params: ExtractionChainOutput) => {
    const output: FactorsType = {
        cvCompleteness: {
            hasJobHistory: Boolean(params.cvData.jobs.length),
            hasSkillsListed: Boolean(params.techProfile.technologies.length),
            isITEngineer: params.cvData.jobs.some(job => job.roleType === "SE"),
            sectionsNumber: params.cvData.sections.length
        }
    } as FactorsType;

    return output;
}