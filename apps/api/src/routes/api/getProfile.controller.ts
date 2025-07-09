import { RequestHandler, Response } from "express";
import { ResumeTechProfileModel } from "@/models/resumeTechProfileModel.js";
import { Joi, Segments } from "celebrate";
import { GetResumeProfileResponse } from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { Types } from "mongoose";
import { ProfileMetricsService } from "@/services/profileMetrics.service.js";

export type ResumeProfileController = RequestHandler<
  { uploadId: string },
  GetResumeProfileResponse,
  unknown,
  unknown
>;

export const getResumeProfileController: ResumeProfileController = async (
  req,
  res: Response<GetResumeProfileResponse>,
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

  const response = {
    uploadId,
    fullName: techProfile.fullName,
    position: techProfile.position,
    createdAt: techProfile.createdAt.toISOString(),
    updatedAt: techProfile.updatedAt.toISOString(),
    technologies: techProfile.technologies,
    jobs: techProfile.jobs,
  };

  // Use the ProfileService to calculate all profile data
  const profileService = new ProfileMetricsService();
  const profileMetrics = profileService.calculateProfileMetrics(techProfile);

  res.status(200).json({ ...response, ...profileMetrics });
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
