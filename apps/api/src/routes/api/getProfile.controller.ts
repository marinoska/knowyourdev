import { RequestHandler, Response } from "express";
import { ResumeTechProfileModel } from "@/models/resumeTechProfileModel.js";
import { Joi, Segments } from "celebrate";
import {
  TResumeProfileResponse,
  TResumeProfileBaseResponse,
} from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { Types } from "mongoose";
import { getProfileJobGaps } from "@/routes/api/getProfile/jobGaps.js";
import { getProfileJobDuration } from "@/routes/api/getProfile/jobDuration.js";
import { getProfileCategories } from "@/routes/api/getProfile/jobCategories.js";
import { getProfileScopes } from "@/routes/api/getProfile/scopes.js";

export type ResumeProfileController = RequestHandler<
  { uploadId: string },
  TResumeProfileResponse,
  any,
  any,
  {}
>;

export const getResumeProfileController: ResumeProfileController = async (
  req,
  res: Response<TResumeProfileResponse>,
) => {
  const { uploadId } = req.params;

  const techProfile = await ResumeTechProfileModel.findOne({
    uploadRef: uploadId,
  }).lean();

  if (!techProfile) {
    throw new NotFound(
      `TechProfile not found for the provided uploadRef: ${uploadId}`,
    );
  }

  const response: TResumeProfileBaseResponse = {
    uploadId,
    fullName: techProfile.fullName,
    position: techProfile.position,
    createdAt: techProfile.createdAt.toISOString(),
    updatedAt: techProfile.updatedAt.toISOString(),
    technologies: techProfile.technologies,
    jobs: techProfile.jobs,
  };

  const baseResponse = {
    ...response,
    ...getProfileJobGaps(response),
    ...getProfileJobDuration(response),
  };
  // full response
  const profileCategories = getProfileCategories({
    ...baseResponse,
  });

  const profileScopes = getProfileScopes({
    ...baseResponse,
    ...profileCategories,
  });

  res.status(200).json({
    ...baseResponse,
    ...profileScopes,
    ...profileCategories,
  });
};

export const getResumeProfileValidationSchema = {
  [Segments.PARAMS]: Joi.object({
    uploadId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
          return helpers.error("string.objectId", { value });
        }
        return value;
      }, "MongoDB ObjectId validation"),
  }),
};
