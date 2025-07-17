import { Schema } from "mongoose";
import { TechListModel } from "@/models/techList.model.js";
import { extractTechnologies } from "@/chain/extraction/project/technologies/extractTechnologies.chain.js";
import { ExtractedProjectData } from "@/chain/extraction/project/types.js";

export async function runProjectDataExtraction(
  title: string,
  description: string,
  projectId: Schema.Types.ObjectId,
): Promise<ExtractedProjectData> {
  if (!description || description.trim() === "") {
    throw new Error(
      "Resume text extraction failed. Please check the PDF file.",
    );
  }

  const techCollection = await TechListModel.find().lean();

  return extractTechnologies({
    description,
    title,
    techCollection,
    projectId,
  });
}
