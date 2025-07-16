import { Joi, Segments } from "celebrate";
import type { Response, Request } from "express";
import { Schema } from "mongoose";
import { runJobDataExtraction } from "@/chain/extraction/project/runner.js";
import { ExtractedJobData } from "@/chain/extraction/project/types.js";
import { ProjectModel } from "@/models/project.model.js";
import { ValidationError } from "@/app/errors.js";
import { validateObjectId } from "@/utils/validation.js";

// Define request type
export type ExtractJobDataRequestBody = {
  title: string;
  description: string;
  projectId: string;
};

// Define response type
export type ExtractJobDataResponse = ExtractedJobData;

// Define request type with generics
export type ExtractJobDataRequest = Request<
  unknown,
  unknown,
  ExtractJobDataRequestBody
>;

// Controller function
export const extractJobDataController = async (
  req: ExtractJobDataRequest,
  res: Response<ExtractJobDataResponse>,
) => {
  const { title, description, projectId } = req.body;

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ValidationError(
      `Project not found for the provided ID: ${projectId}`,
    );
  }

  const projectObjectId = new Schema.Types.ObjectId(projectId);

  const extractedData = await runJobDataExtraction(
    title,
    description,
    projectObjectId,
  );

  res.status(200).json(extractedData);
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
