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
import { ResumeProfileModel } from "@/models/resumeProfileModel.js";
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

  if (!req.auth?.payload.sub) {
    throw new Error("Authentication required");
  }
  const userId = req.auth.payload.sub;

  const project = projectId
    ? await ProjectModel.get({ id: projectId, _userId: userId })
    : undefined;

  if (!project && projectId) {
    throw new NotFound(`Project not found for the provided ID: ${projectId}`);
  }

  const { uploads, totalRecords, totalPages, currentPage } =
    await getUploadsWithDetails({
      page: Number(page),
      limit: Number(limit),
      project,
      userId,
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

  const profileMatchService = new ProfileMatchService();
  const profileMetricsService = new ProfileMetricsService();

  const processedUploads = await Promise.all(
    uploads.map(async (record) => {
      if (record.parseStatus === "processed" && profileMetricsService) {
        try {
          const resumeProfile = await ResumeProfileModel.getOne({
            uploadRef: record._id,
            _userId: userId,
          });
          if (resumeProfile) {
            const profileMetrics =
              profileMetricsService.calculateProfileMetrics(resumeProfile);

            if (project && profileMatchService) {
              const match = profileMatchService.getCandidateMatch({
                project,
                candidate: {
                  ...resumeProfile,
                  ...profileMetrics,
                  uploadId: resumeProfile.uploadRef as Schema.Types.ObjectId,
                },
              });

              return { ...record, match } satisfies TExtendedUpload;
            }
          }
        } catch (error) {
          throw new Error(
            `Error calculating match for upload ${record._id}: ${error}`,
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
