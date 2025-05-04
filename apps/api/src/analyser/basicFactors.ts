import { ExtractionChainOutput } from "@/chain/extraction/types.js";
import { FactorsType } from "@/models/types.js";
import { JobEntry } from "@kyd/common/api";

export const getBasicFactors = (params: ExtractionChainOutput) => {
    const output: FactorsType = {
        cvCompleteness: {
            hasJobHistory: Boolean(params.cvData.jobs.length),
            hasSkillsListed: Boolean(params.techProfile.technologies.length),
            isITEngineer: params.cvData.jobs.some((job: JobEntry) => job.roleType === "SE"),
            sectionsNumber: params.cvData.sections.length
        }
    } as FactorsType;

    return output;
}