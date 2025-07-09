import { RequestHandler, Response } from "express";
import { ResumeProfileModel } from "@/models/resumeProfileModel.js";
import { Joi, Segments } from "celebrate";
import { GetResumeProfileResponse } from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { Types } from "mongoose";
import { ProfileMetricsService } from "@/services/profileMetrics.service.js";
import { ProfileMatchService } from "@/services/profileMatch.service.js";
import { ProjectModel } from "@/models/project.model.js";

export type ResumeProfileController = RequestHandler<
  { uploadId: string },
  GetResumeProfileResponse<true>,
  unknown,
  { projectId?: string }
>;

export const getResumeProfileController: ResumeProfileController = async (
  req,
  res: Response<GetResumeProfileResponse<true>>,
) => {
  const { uploadId } = req.params;
  const { projectId } = req.query;

  const resumeProfile = await ResumeProfileModel.findOne({
    uploadRef: uploadId,
  }).lean();

  if (!resumeProfile) {
    throw new NotFound(
      `TechProfile not found for the provided uploadRef: ${uploadId}`,
    );
  }

  const response = {
    uploadId,
    fullName: resumeProfile.fullName,
    position: resumeProfile.position,
    createdAt: resumeProfile.createdAt.toISOString(),
    updatedAt: resumeProfile.updatedAt.toISOString(),
    technologies: resumeProfile.technologies,
    jobs: resumeProfile.jobs,
  };

  const profileService = new ProfileMetricsService();
  const profileMetrics = profileService.calculateProfileMetrics(resumeProfile);

  if (!projectId) {
    res.status(200).json({ ...response, ...profileMetrics });
    return;
  }

  const project = await ProjectModel.findById(projectId).lean();

  if (project) {
    const profileMatchService = new ProfileMatchService();
    const match = profileMatchService.getCandidateMatch({
      project,
      candidate: {
        ...resumeProfile,
        ...profileMetrics,
      },
    });

    // Add the match to the response
    res.status(200).json({ ...response, ...profileMetrics, match });
    return;
  }
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
  [Segments.QUERY]: Joi.object({
    projectId: Joi.string()
      .optional()
      .custom((value, helpers) => {
        if (value && !Types.ObjectId.isValid(value)) {
          return helpers.error("string.objectId", { value });
        }
        return value;
      }, "MongoDB ObjectId validation"),
  }),
};
