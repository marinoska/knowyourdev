import { RequestHandler } from "express";
import { Joi, Segments } from "celebrate";
import { PatchProjectBody, TProject, SCOPE } from "@kyd/common/api";
import { NotFound, ValidationError } from "@/app/errors.js";
import { validateObjectId } from "@/utils/validation.js";
import { ProjectModel } from "@/models/project.model.js";
import { TechListModel } from "@/models/techList.model.js";
import { Schema } from "mongoose";
import { ProjectPatchData } from "@/models/project.statics.js";
import {
  MAX_EXPECTED_DURATION,
  MIN_BASELINE_DURATION,
  MIN_EXPECTED_DURATION,
  MAX_BASELINE_DURATION,
} from "@kyd/common/api";

export type UpdateProjectController = RequestHandler<
  { projectId: string },
  TProject,
  PatchProjectBody,
  unknown
>;

export const updateProjectController: UpdateProjectController = async (
  req,
  res,
) => {
  const { projectId } = req.params;
  const { body, auth } = req;

  if (!auth?.payload.sub) {
    throw new Error("Authentication required");
  }
  const userId = auth.payload.sub;

  const typedInput = { ...body } as ProjectPatchData;

  // If technologies are present, process them
  if (body.settings?.technologies) {
    const techRefs = body.settings.technologies.map((tech) => tech.ref);
    const foundTechs = await TechListModel.find(
      { _id: { $in: techRefs } },
      { _id: 1, code: 1, name: 1 },
    )
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          ref: doc._id as Schema.Types.ObjectId,
          code: doc.code,
          name: doc.name,
        })),
      );
    if (foundTechs.length !== techRefs.length) {
      throw new ValidationError(
        "One or more technology references do not exist.",
      );
    }

    if (!typedInput.settings) {
      typedInput.settings = {};
    }

    typedInput.settings.technologies = [...foundTechs];
  }

  // Use the typed input for the patch operation
  const updatedProject: TProject | null = await ProjectModel.patch({
    id: projectId,
    _userId: userId,
    projectData: typedInput,
  });
  if (!updatedProject) {
    throw new NotFound(`Project not found for the provided ID: ${projectId}`);
  }

  res.status(200).json(updatedProject);
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
      baselineJobDuration: Joi.number()
        .min(MIN_BASELINE_DURATION)
        .max(MAX_BASELINE_DURATION)
        .optional(),
      techFocus: Joi.array()
        .items(Joi.string().valid(...SCOPE))
        .optional(),
      technologies: Joi.array()
        .items(
          Joi.object({
            code: Joi.string().required(),
            name: Joi.string().required(),
            ref: Joi.string()
              .custom(validateObjectId, "MongoDB ObjectId validation")
              .required(),
          }),
        )
        .optional(),
      description: Joi.string().optional(),
      expectedRecentRelevantYears: Joi.number()
        .min(MIN_EXPECTED_DURATION)
        .max(MAX_EXPECTED_DURATION)
        .optional(),
    }).optional(),
  }).min(1), // Require at least one field to be updated
};
