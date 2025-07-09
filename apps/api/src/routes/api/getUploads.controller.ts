import { Joi, Segments } from "celebrate";

import { Request, Response, RequestHandler } from "express";
import {
  GetUploadsListQueryParams,
  GetUploadsListResponse,
  TUpload,
  TExtendedUpload,
} from "@kyd/common/api";
import { getUploadsWithDetails } from "@/models/upload.repository.js";
import { ProfileMatchService } from "@/services/profileMatch.service.js";
import { ProfileMetricsService } from "@/services/profileMetrics.service.js";
import { ResumeTechProfileModel } from "@/models/resumeTechProfileModel.js";
import { ProjectModel } from "@/models/project.model.js";
import { NotFound } from "@/app/errors.js";
import { Schema } from "mongoose";

export const getUploadsListController: RequestHandler<
  unknown,
  GetUploadsListResponse,
  unknown,
  GetUploadsListQueryParams
> = async (
  req: Request<
    unknown,
    GetUploadsListResponse,
    unknown,
    GetUploadsListQueryParams
  >,
  res: Response<GetUploadsListResponse>,
) => {
  const { page = 1, limit = 10, projectId, withMatch } = req.query;
  const project = projectId
    ? await ProjectModel.findById(projectId).lean()
    : undefined;
  if (!project && projectId) {
    throw new NotFound(`Project not found for the provided ID: ${projectId}`);
  }

  const { uploads, totalRecords, totalPages, currentPage } =
    await getUploadsWithDetails({
      page: Number(page),
      limit: Number(limit),
      project,
    });

  const responseData = {
    uploads,
    totalRecords,
    currentPage,
    totalPages,
  };

  if (!withMatch) {
    res.status(200).json(responseData);
    return;
  }

  // Initialize services if withMatch is true
  const profileMatchService = new ProfileMatchService();
  const profileMetricsService = new ProfileMetricsService();

  // Process uploads and add match data if needed
  const processedUploads = await Promise.all(
    uploads.map(async (record) => {
      // Add match data for processed uploads if withMatch is true
      if (record.parseStatus === "processed" && profileMetricsService) {
        try {
          // Get the tech profile for this upload
          const techProfile = await ResumeTechProfileModel.findOne({
            uploadRef: record._id,
          }).lean();

          if (techProfile) {
            // Calculate profile metrics first
            const profileMetrics =
              profileMetricsService.calculateProfileMetrics(techProfile);

            // Then calculate match if project is available
            if (project && profileMatchService) {
              const match = profileMatchService.getCandidateMatch({
                project,
                candidate: {
                  ...techProfile,
                  ...profileMetrics,
                  uploadId: techProfile.uploadRef as Schema.Types.ObjectId,
                },
              });

              // Add match data to the upload item
              return { ...record, match } satisfies TExtendedUpload;
            }

            // If no project is available, we don't add match data
          }
        } catch (error) {
          console.error(
            `Error calculating match for upload ${record._id}:`,
            error,
          );
        }
      }

      return record satisfies TUpload;
    }),
  );

  res.status(200).json({ ...responseData, uploads: processedUploads });
};

export const getUploadsListValidationSchema = {
  [Segments.QUERY]: {
    page: Joi.number().integer().min(1).default(1).optional(), // Page number
    limit: Joi.number().integer().min(1).default(30).optional(), // Page size
    projectId: Joi.string().optional(), // Project ID
    withMatch: Joi.boolean().default(false).optional(), // Include match data
    // sortBy: Joi.string().valid('name', 'role', 'size', 'createdAt').default('createdAt').optional(), // Sort field
    // sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional(), // Sort order
  },
};
