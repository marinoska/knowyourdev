import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { parseJsonOutput } from "@/utils/json.js";
import { ExtractCVDataPrompt } from "./extractCVData.prompt.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { gpt4oMini } from "@/app/aiModel.js";
import {
  ExtractionChainInput,
  ExtractionChainParam,
} from "@/chain/extraction/types.js";
import { semanticSimilarity } from "@/chain/normalizer/semanticSimilarity.js";
import {
  ExtractedCVData,
  JobEntry,
  SECTIONS,
  SectionsNames,
} from "@kyd/common/api";

type OutputType = {
  fullName: string;
  skillSection: string;
  profileSection: string;
  jobs: JobEntry[];
  position: string;
  sections: string[];
};
const techPrompt = PromptTemplate.fromTemplate(`
${ExtractCVDataPrompt}

${jsonOutputPrompt({
  fullName: "extracted name and surname",
  skillSection: "extracted skill section",
  profileSection: "extracted profile/general description section",
  jobs: "array of extracted job json objects",
  position: 'extracted headline/position/"role in the heading"',
  sections: "extracted array of CV sections",
})}
`);

export const extractCVData = async (
  params: ExtractionChainInput,
): Promise<ExtractionChainParam> => {
  const { cvText } = params;

  const techExtractionChain = RunnableSequence.from<
    {
      cv_text: string;
      list_of_sections: typeof SECTIONS;
    },
    OutputType
  >([techPrompt, gpt4oMini, parseJsonOutput]);

  const extractedData = await techExtractionChain.invoke({
    cv_text: cvText,
    list_of_sections: SECTIONS,
  });
  // todo validate extractedData for errors/completeness

  const sectionsNamesNormalizer = semanticSimilarity<SectionsNames>(
    [...SECTIONS],
    0.8,
  );
  const sections = Object.values(extractedData.sections).map((item) =>
    sectionsNamesNormalizer(item),
  );

  return {
    ...params,
    extractedData: {
      ...extractedData,
      // fullName: extractedData.fullName,
      // jobs: extractedData.jobs,
      position: extractedData.position,
      sections,
      profileSection: {
        text: extractedData.profileSection,
      },
      skillSection: {
        text: extractedData.skillSection,
      },
    } as ExtractedCVData,
  };
};
