import { RequestHandler, Response } from "express";
import { ResumeTechProfileModel } from "@/models/resumeTechProfileModel.js";
import { Joi, Segments } from "celebrate";
import { ResumeTechProfileResponse } from "@kyd/common/api";
import { NotFound } from "@/app/errors.js";
import { Types } from "mongoose";

export type UploadTechProfileController = RequestHandler<
  { uploadId: string },
  ResumeTechProfileResponse,
  any,
  any,
  {}
>;

export const getUploadTechProfileController: UploadTechProfileController =
  async (req, res: Response<ResumeTechProfileResponse>) => {
    const { uploadId } = req.params;

    const techProfile = await ResumeTechProfileModel.findOne({
      uploadRef: uploadId,
    }).lean();

    if (!techProfile) {
      throw new NotFound(
        `TechProfile not found for the provided uploadRef: ${uploadId}`,
      );
    }

    // Send the tech profile in the response
    res.status(200).json({
      uploadId,
      fullName: techProfile.fullName,
      position: techProfile.position,
      createdAt: techProfile.createdAt.toISOString(),
      updatedAt: techProfile.updatedAt.toISOString(),
      technologies: techProfile.technologies,
      jobs: techProfile.jobs,
    });
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

/*
    // Add job gaps to the response
    const responseWithGaps = addJobGapsToResponse(response);

    // Add job categories to the response
    const responseWithGapsAndCategories =
      addJobCategoriesToResponse(responseWithGaps);

    // Add scopes to the response
    const responseWithGapsCategoriesAndScopes = addScopesToResponse(
      responseWithGapsAndCategories,
    );

    // Send the tech profile with job gaps, categories, and scopes in the response
    res.status(200).json(responseWithGapsCategoriesAndScopes);
*/
