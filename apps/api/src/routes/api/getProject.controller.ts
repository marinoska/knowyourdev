import { RequestHandler, Response } from "express";
import { Joi, Segments } from "celebrate";
import { TProjectResponse } from "@kyd/common";
import { NotFound, ValidationError } from "@/app/errors.js";
import { Types } from "mongoose";
import { getProjectById } from "@/models/project.repository.js";

export type GetProjectController = RequestHandler<
  { projectId: string },
  TProjectResponse,
  any,
  any,
  {}
>;

export const getProjectController: GetProjectController = async (
  req,
  res: Response<TProjectResponse>,
) => {
  const { projectId } = req.params;
  if (!Types.ObjectId.isValid(projectId)) {
    throw new ValidationError("Invalid project ID: " + projectId);
  }

  const project = await getProjectById(projectId);

  if (!project) {
    throw new NotFound(`Project not found for the provided ID: ${projectId}`);
  }

  // Send the project in the response
  res.status(200).json({
    _id: project._id.toString(),
    name: project.name,
    settings: project.settings,
    createdAt: project.createdAt.toISOString(),
    candidates: project.candidates, // Ensure candidates are included
  });
};

export const getProjectValidationSchema = {
  [Segments.PARAMS]: Joi.object({
    projectId: Joi.string().required(),
  }),
};
