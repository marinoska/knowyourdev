import { Schema } from "mongoose";
import { TechListModel } from "@/models/techList.model.js";
import { inferTechnologies } from "@/chain/extraction/project/technologies/inferTechnologies.chain.js";
import { InferredProjectData } from "@/chain/extraction/project/types.js";
import { suggestTechnologies } from "@/chain/extraction/project/technologies/suggestTechnologies.chain.js";

export async function runProjectDataExtraction(
  title: string,
  description: string,
  projectId: Schema.Types.ObjectId,
): Promise<InferredProjectData> {
  if (!description || description.trim() === "") {
    throw new Error(
      "Resume text extraction failed. Please check the PDF file.",
    );
  }

  const techCollection = await TechListModel.find().lean();

  const extracted = await inferTechnologies({
    description,
    title,
    techCollection,
    projectId,
  });

  const { suggestedTechnologies, suggestedTechStack, reasoning } =
    await suggestTechnologies({ title, description, techCollection });

  const techs = extracted.technologies.length
    ? {
        technologies: [...extracted.technologies],
        techStack: [...extracted.techStack],
      }
    : {
        technologies: [...suggestedTechnologies],
        techStack: [...suggestedTechStack],
        reasoning,
      };
  return {
    ...extracted,
    ...techs,
  };
}
