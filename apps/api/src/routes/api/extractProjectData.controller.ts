import { Joi, Segments } from "celebrate";
import type { Response, Request } from "express";
import { Schema } from "mongoose";
import { runProjectDataExtraction } from "@/chain/extraction/project/runner.js";
import { ProjectModel } from "@/models/project.model.js";
import { ValidationError } from "@/app/errors.js";
import { validateObjectId } from "@/utils/validation.js";
import {
  ExtractProjectDataRequestBody,
  ExtractProjectDataResponse,
  ScopeType,
} from "@kyd/common/api";
import { TechListModel } from "@/models/techList.model.js";
import logger from "@/app/logger.js";

const log = logger("Project data extraction");

type ExtractProjectDataRequest = Request<
  unknown,
  unknown,
  ExtractProjectDataRequestBody
>;

export const extractProjectDataController = async (
  req: ExtractProjectDataRequest,
  res: Response<ExtractProjectDataResponse>,
) => {
  const { title, description, projectId } = req.body;

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ValidationError(
      `Project not found for the provided ID: ${projectId}`,
    );
  }

  const projectObjectId = new Schema.Types.ObjectId(projectId);

  const extractedData = await runProjectDataExtraction(
    title,
    description,
    projectObjectId,
  );

  const scopesSet = new Set<ScopeType>();

  const technologies = [];

  for (const tech of extractedData.technologies) {
    const techDocument = await TechListModel.findById(
      tech.techReference,
    ).lean();
    if (!techDocument) {
      log.error(`TechListModel: not found tech ${tech.techReference}`);
      continue;
    }
    scopesSet.add(techDocument.scope);

    technologies.push({
      code: techDocument.code,
      name: techDocument.name,
      ref: techDocument._id.toString(),
    });
  }

  res.status(200).json({
    ...extractedData,
    technologies,
    techFocus: Array.from(scopesSet),
  });
};

// Validation schema
export const extractJobDataValidationSchema = {
  [Segments.BODY]: {
    title: Joi.string().required(),
    description: Joi.string().required(),
    projectId: Joi.string()
      .required()
      .custom(validateObjectId, "MongoDB ObjectId validation"),
  },
};
