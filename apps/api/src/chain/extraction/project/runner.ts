import { Schema } from "mongoose";
import { TechListModel } from "@/models/techList.model.js";
import { extractTechnologies } from "@/chain/extraction/project/technologies/extractTechnologies.chain.js";
import { ExtractedProjectData } from "@/chain/extraction/project/types.js";
import logger from "@/app/logger.js";
import { ScopeType } from "@kyd/common/api";

const log = logger("Project data extraction");

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

  const extractedProjectData = await extractTechnologies({
    description,
    title,
    techCollection,
    projectId,
  });

  const scopesSet = new Set<ScopeType>();

  await Promise.all(
    extractedProjectData.technologies.map(async (tech) => {
      const techDocument = await TechListModel.findById(tech.techReference);
      if (!techDocument) {
        log.error(`TechListModel: not found tech ${tech.techReference}`);
        return;
      }
      scopesSet.add(techDocument.scope);
    }),
  );

  return { ...extractedProjectData, scopes: Array.from(scopesSet) };
}
