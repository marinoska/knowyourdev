import { RequestHandler } from "express";
import { Joi, Segments } from "celebrate";
import { TProject } from "@kyd/common/api";
import { ProjectModel } from "@/models/project.model.js";
import { PostProjectBody } from "@/models/project.statics.js";

export type CreateProjectController = RequestHandler<
  unknown,
  TProject,
  PostProjectBody,
  unknown
>;

export const createProjectController: CreateProjectController = async (
  req,
  res,
) => {
  const { body, auth } = req;
  if (!auth?.payload.sub) {
    throw new Error("Authentication required");
  }
  const userId = auth.payload.sub;

  const createdProject = await ProjectModel.createNew(body, userId);

  res.status(201).json(createdProject);
};

export const createProjectValidationSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }),
};
