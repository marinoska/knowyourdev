import { Schema } from "mongoose";
import { TechListModel } from "@/models/techList.model.js";
import {
  ExtractionChainInput,
  ExtractionChainParam,
} from "@/chain/extraction/project/types.js";
import { pipe } from "@/utils/func.js";
import { extractTechnologies } from "@/chain/extraction/project/technologies/extractTechnologies.chain.js";
import { aggregateAndSave } from "@/chain/extraction/resume/aggregateAndSave.js";
import { ExtractedJobData } from "@/chain/extraction/project/types.js";

export async function runJobDataExtraction(
  title: string,
  description: string,
  projectId: Schema.Types.ObjectId,
): Promise<ExtractedJobData> {
  if (!description || description.trim() === "") {
    throw new Error(
      "Resume text extraction failed. Please check the PDF file.",
    );
  }

  const techCollection = await TechListModel.find().lean();

  const inputData: ExtractionChainInput = {
    description,
    title,
    techCollection,
    projectId,
  };

  const output = await pipe<ExtractionChainParam>(
    inputData,
    extractTechnologies,
    // aggregateAndSave,
  );

  // @ts-ignore
  console.log({
    output: output.extractedJobData,
    teck: output.extractedJobData.technologies,
    stack: output.extractedJobData.techStack,
  });
  // @ts-ignore
  return output.extractedJobData;
}
