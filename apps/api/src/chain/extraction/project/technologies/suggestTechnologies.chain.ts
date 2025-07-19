import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { parseJsonOutput } from "@/utils/json.js";
import { suggestTechnologiesPrompt } from "./suggestTechnologies.prompt.js";
import { jsonOutputPrompt } from "@/utils/JsonOutput.prompt.js";
import { gpt4oMini } from "@/app/aiModel.js";
import stackListData from "./Stack_List_For_Prompt.json";
import { normalizeTechList } from "@/chain/extraction/common/normaliseTechNameList.chain.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { TechnologyEntry, TechStack } from "@kyd/common/api";
import { TechDocument } from "@/models/types.js";
import { extractTechProficiency } from "@/chain/extraction/common/extractTechProficiency.chain.js";
import { SuggestedProjectTechnologies } from "@/chain/extraction/project/types.js";

const techPrompt = PromptTemplate.fromTemplate(`
${suggestTechnologiesPrompt}

${jsonOutputPrompt({
  technologies: "Matching technologies array",
  matchedStack: "Name of the matched stack",
  reasoning: "Explanation for the selection",
})}
`);

const stackList = JSON.stringify(stackListData);

type EnrichTechnologiesInput = {
  title: string;
  description: string;
  jsonStackList: string;
};

type EnrichTechnologiesRawOutput = {
  technologies: string[];
  matchedStack: string;
  reasoning: string;
};

export const suggestTechnologies = async ({
  title,
  description,
  techCollection = [],
}: {
  title: string;
  description: string;
  techCollection: TechDocument[];
}): Promise<SuggestedProjectTechnologies> => {
  const techEnrichmentChain = RunnableSequence.from<
    EnrichTechnologiesInput,
    EnrichTechnologiesRawOutput
  >([techPrompt, gpt4oMini, parseJsonOutput]);

  const rawOutput = await techEnrichmentChain.invoke({
    title: title,
    description: description,
    jsonStackList: stackList,
  });

  const normalisedTechList = rawOutput.technologies.length
    ? await normalizeTechList({
        inputTechList: rawOutput.technologies,
        techDocList: techCollection,
      })
    : [];

  const proficiency = rawOutput.technologies.length
    ? await extractTechProficiency({
        inputTechList: rawOutput.technologies,
        description,
      })
    : {};

  const technologiesEntry = normalisedTechList.map<TechnologyEntry>((tech) => ({
    ...tech,
    proficiency: proficiency[tech.original],
  }));

  const stackMatches = await TechStackModel.identifyStack(
    normalisedTechList.map((tech) => tech.code).filter(Boolean),
  );

  return {
    suggestedTechnologies: technologiesEntry,
    suggestedTechStack: stackMatches,
    reasoning: rawOutput.reasoning,
  };
};
