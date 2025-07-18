import { RequestHandler } from "express";
import { Joi, Segments } from "celebrate";
import { PatchProjectBody, TProjectPopulated } from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { validateObjectId } from "@/utils/validation.js";
import { ProjectModel } from "@/models/project.model.js";

export type UpdateProjectController = RequestHandler<
  { projectId: string },
  TProjectPopulated,
  PatchProjectBody,
  unknown
>;

export const updateProjectController: UpdateProjectController = async (
  req,
  res,
) => {
  const { projectId } = req.params;

  const updatedProject: TProjectPopulated | null = await ProjectModel.patch(
    projectId,
    req.body,
  );
  if (!updatedProject) {
    throw new NotFound(`Project not found for the provided ID: ${projectId}`);
  }

  res.status(200).json({
    ...updatedProject,
    candidates: updatedProject.candidates || [], // Ensure candidates are included
  });
};

export const updateProjectValidationSchema = {
  [Segments.PARAMS]: Joi.object({
    projectId: Joi.string()
      .required()
      .custom(validateObjectId, "MongoDB ObjectId validation"),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().optional(),
    settings: Joi.object({
      baselineJobDuration: Joi.number().optional(),
      techFocus: Joi.array().items(Joi.string()).optional(),
      description: Joi.string().optional(),
      expectedRecentRelevantYears: Joi.number().optional(),
    }).optional(),
  }).min(1), // Require at least one field to be updated
};
