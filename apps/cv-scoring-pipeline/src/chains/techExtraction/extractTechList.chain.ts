import { RunnableSequence } from "@langchain/core/runnables";
import { parseJsonOutput } from "../../utils/json.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { techExtractionPrompt } from "./prompt/TechExtraction.prompt.js";
import { jsonOutputPrompt } from "../../utils/JsonOutput.prompt.js";
import { gpt4oMini } from "../../app/models.js";
import { ExtractedCVData, TechnologiesEntry } from "./types.js";
import { TechStackModel } from "../../tech/techStack.model.js";
import { TechModel } from "../../tech/techModelType.js";

const techPrompt = PromptTemplate.fromTemplate(`
${techExtractionPrompt}

${jsonOutputPrompt({
    technologies: 'extracted technologies json object',
    jobs: 'extracted jobs json object',
})}
`);

export const extractTechList = async (cvText: string): Promise<ExtractedCVData> => {
    const techExtractionChain = RunnableSequence.from<{ cv_text: string, tech_list: string }, ExtractedCVData>([
        techPrompt,
        gpt4oMini,
        parseJsonOutput,
    ]);

    const techList = await TechModel.find({}, {name: 1}).lean();
    const techMap: Record<string, string> = {};
    techList.forEach(({name}, index) => {
        techMap[String(index)] = `${name}=${index}`;
    })

    const extractedData = (await techExtractionChain.invoke({
        cv_text: cvText,
        tech_list: Object.values(techMap).join(',')
    }));

    const normalisedTechs = extractedData.technologies.map((tech: TechnologiesEntry) => ({
        ...tech,
        name: tech.code ? techMap[String(tech.code)].split('=')[0] : tech.originalName
    }));

    const normalisedData = {...extractedData, technologies: normalisedTechs};

    const stackMatches = await TechStackModel.identifyStack(normalisedData.technologies.map(tech => tech.name));
    console.log("$$$$$$$$$$$$$$$$$", stackMatches);
    return {...normalisedData, techStack: stackMatches || []};
}
