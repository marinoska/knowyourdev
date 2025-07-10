import { RequestHandler, Response } from "express";
import { ResumeProfileModel } from "@/models/resumeProfileModel.js";
import { Joi, Segments } from "celebrate";
import {
  GetResumeProfileResponse,
  TCandidateMatch,
  WithCandidateMatch,
} from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { ProfileMetricsService } from "@/services/profileMetrics.service.js";
import { ProfileMatchService } from "@/services/profileMatch.service.js";
import { ProjectModel } from "@/models/project.model.js";
import {
  validateObjectId,
  validateOptionalObjectId,
} from "@/utils/validation.js";

export type ResumeProfileController = RequestHandler<
  { uploadId: string },
  GetResumeProfileResponse<WithCandidateMatch> | GetResumeProfileResponse,
  unknown,
  { projectId?: string }
>;

export const getResumeProfileController: ResumeProfileController = async (
  req,
  res: typeof req.query.projectId extends string
    ? Response<GetResumeProfileResponse<WithCandidateMatch>>
    : Response<GetResumeProfileResponse>,
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

  const basicResponse: GetResumeProfileResponse = {
    ...response,
    ...profileMetrics,
  };

  if (!projectId) {
    res.status(200).json(basicResponse);
    return;
  }

  const project = await ProjectModel.findById(projectId).lean();

  if (project) {
    const profileMatchService = new ProfileMatchService();
    const match: TCandidateMatch = profileMatchService.getCandidateMatch({
      project,
      candidate: {
        ...resumeProfile,
        ...profileMetrics,
      },
    });

    const responseWithCandidateMatch: GetResumeProfileResponse<WithCandidateMatch> =
      {
        ...basicResponse,
        match: {
          ...match,
        },
      };

    res.status(200).json(responseWithCandidateMatch);
  }
};

export const getResumeProfileValidationSchema = {
  [Segments.PARAMS]: Joi.object({
    uploadId: Joi.string()
      .required()
      .custom(validateObjectId, "MongoDB ObjectId validation"),
  }),
  [Segments.QUERY]: Joi.object({
    projectId: Joi.string()
      .optional()
      .custom(validateOptionalObjectId, "MongoDB ObjectId validation"),
  }),
};
