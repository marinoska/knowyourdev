import { Joi, Segments } from "celebrate";

import { RequestHandler } from "express";
import {
  GetUploadsListQueryParams,
  GetUploadsListResponse,
} from "@kyd/common/api";
import { getUploadsWithDetails } from "@/models/upload.repository.js";
import { extendWithMatchIfApplicable } from "@/services/uploadsView.service.js";
import { ProjectModel } from "@/models/project.model.js";
import { NotFound } from "@/app/errors.js";

export const getUploadsListController: RequestHandler<
  unknown,
  GetUploadsListResponse,
  unknown,
  GetUploadsListQueryParams
> = async (req, res) => {
  const { page, limit, projectId, withMatch } = req.query;

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

  const processedUploads = await Promise.all(
    uploads.map(async (record) => {
      try {
        return await extendWithMatchIfApplicable(
          record,
          userId,
          project ?? undefined,
        );
      } catch (error) {
        throw new Error(
          `Error calculating match for upload ${record._id}: ${error}`,
        );
      }
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
