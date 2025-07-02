import { RequestHandler, Response } from "express";
import { ResumeTechProfileModel } from "@/models/resumeTechProfileModel.js";
import { Joi, Segments } from "celebrate";
import { TResumeProfileResponse, TScopes } from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { Types } from "mongoose";
import { addJobGapsToResponse } from "@/routes/api/document/getProfile/jobGaps.js";
import { addJobCategoriesToResponse } from "@/routes/api/document/getProfile/jobCategories.js";
import { addScopesToResponse } from "@/routes/api/document/getProfile/scopes.js";

export type UploadTechProfileController = RequestHandler<
  { uploadId: string },
  TResumeProfileResponse,
  any,
  any,
  {}
>;

export const getUploadTechProfileController: UploadTechProfileController =
  async (req, res: Response<TResumeProfileResponse>) => {
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
      jobGaps: [],
      softwareDevelopmentJobs: [],
      irrelevantJobs: [],
      jobsWithMissingTech: [],
      jobsWithFilledTech: [],
      scopes: {} as TScopes,
      earliestJobStart: new Date(),
    };
    const responseWithGaps = addJobGapsToResponse(response);
    const responseWithGapsAndCategories =
      addJobCategoriesToResponse(responseWithGaps);
    const responseWithGapsCategoriesAndScopes = addScopesToResponse(
      responseWithGapsAndCategories,
    );
    // Send the tech profile in the response
    res.status(200).json(responseWithGapsCategoriesAndScopes);
  };

export const getTechProfileValidationSchema = {
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
