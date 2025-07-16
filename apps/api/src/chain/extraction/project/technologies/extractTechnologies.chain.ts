import { PromptTemplate } from "@langchain/core/prompts";
import { extractTechnologiesFromJobDescriptionPrompt } from "@/chain/extraction/project/technologies/extractTechnologies.prompt.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { gpt4oMini } from "@/app/aiModel.js";
import { parseJsonOutput } from "@/utils/json.js";
import { ExtractionChainParam } from "@/chain/extraction/project/types.js";
import { normalizeTechList } from "@/chain/extraction/common/normaliseTechNameList.chain.js";
import { extractTechProficiency } from "@/chain/extraction/common/extractTechProficiency.chain.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { RoleType, TechnologyEntry } from "@kyd/common/api";

const prompt = PromptTemplate.fromTemplate(`
${extractTechnologiesFromJobDescriptionPrompt}

${jsonOutputPrompt({
  technologies: "extracted technologies array",
})}

Role description:
{description}

Role title (project name):
{title}
`);

type Output = {
  technologies: string[];
  roleType: string;
  isSoftwareDevelopmentRole: boolean;
  summary: string;
  softwareDevelopmentScope: string;
  isMobileDevelopmentRole: boolean;
};

const jobTechExtractor = RunnableSequence.from<
  { description: string; title: string },
  Output
>([
  prompt, // Injects job description into prompt
  gpt4oMini, // Extracts technologies
  parseJsonOutput, // Parses JSON output
]);

export const extractTechnologies = async (
  params: ExtractionChainParam,
): Promise<ExtractionChainParam> => {
  const { description, title, techCollection } = params;

  const {
    technologies,
    roleType,
    isSoftwareDevelopmentRole,
    summary,
    isMobileDevelopmentRole,
  } = await jobTechExtractor.invoke({
    description,
    title,
  });

  const normalisedTechList = technologies.length
    ? await normalizeTechList({
        inputTechList: technologies,
        techDocList: techCollection,
      })
    : [];

  const proficiency = technologies.length
    ? await extractTechProficiency({
        inputTechList: technologies,
        description,
      })
    : {};

  const technologiesEntry = normalisedTechList.map<TechnologyEntry>((tech) => ({
    ...tech,
    proficiency: proficiency[tech.original],
  }));

  const stackMatches = await TechStackModel.identifyStack(
    normalisedTechList.map((tech) => tech.code),
  );

  const extracted = {
    technologies: technologiesEntry,
    techStack: stackMatches,
    roleType: roleType as RoleType,
    isSoftwareDevelopmentRole,
    isMobileDevelopmentRole,
    summary,
  };

  return {
    ...params,
    extractedJobData: { ...extracted },
  };
};
