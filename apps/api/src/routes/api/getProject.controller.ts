import { RequestHandler } from "express";
import { Joi, Segments } from "celebrate";
import { TProject, TProjectPopulated } from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { validateObjectId } from "@/utils/validation.js";
import { ProjectModel } from "@/models/project.model.js";

export type GetProjectController = RequestHandler<
  { projectId: string },
  TProject,
  unknown,
  unknown
>;

export const getProjectController: GetProjectController = async (req, res) => {
  const { projectId } = req.params;
  if (!req.auth?.payload.sub) {
    throw new Error("Authentication required");
  }
  const userId = req.auth.payload.sub;

  const project = await ProjectModel.get({
    id: projectId,
    _userId: userId,
  });

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
