import { RequestHandler, Response } from "express";
import { Joi, Segments } from "celebrate";
import { TProjectResponse } from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { validateObjectId } from "@/utils/validation.js";
import { ProjectModel } from "@/models/project.model.js";

export type GetProjectController = RequestHandler<
  { projectId: string },
  TProjectResponse,
  unknown,
  unknown
>;

export const getProjectController: GetProjectController = async (
  req,
  res: Response<TProjectResponse>,
) => {
  const { projectId } = req.params;

  const project = await ProjectModel.findById(projectId)
    .populate("settings.technologies.ref")
    .lean();

  if (!project) {
    throw new NotFound(`Project not found for the provided ID: ${projectId}`);
  }

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
    projectId: Joi.string()
      .required()
      .custom(validateObjectId, "MongoDB ObjectId validation"),
  }),
};
