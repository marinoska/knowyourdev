import { RequestHandler } from "express";
import { Joi, Segments } from "celebrate";
import { TProjectPopulated } from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { validateObjectId } from "@/utils/validation.js";
import { ProjectModel } from "@/models/project.model.js";

export type GetProjectController = RequestHandler<
  { projectId: string },
  TProjectPopulated,
  unknown,
  unknown
>;

export const getProjectController: GetProjectController = async (req, res) => {
  const { projectId } = req.params;

  const project = (await ProjectModel.findById<TProjectPopulated>(projectId)
    .populate("settings.technologies.ref")
    .lean()) as TProjectPopulated;

  if (!project) {
    throw new NotFound(`Project not found for the provided ID: ${projectId}`);
  }

  res.status(200).json(project);
};

export const getProjectValidationSchema = {
  [Segments.PARAMS]: Joi.object({
    projectId: Joi.string()
      .required()
      .custom(validateObjectId, "MongoDB ObjectId validation"),
  }),
};
