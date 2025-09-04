import { Joi, Segments } from "celebrate";
import type { Request, Response, RequestHandler } from "express";
import { NotFound } from "@/app/errors.js";
import { UploadModel } from "@/models/upload.model.js";
import { ProjectModel } from "@/models/project.model.js";
import {
  buildUploadFromDoc,
  extendWithMatchIfApplicable,
} from "@/services/uploadsView.service.js";
import type { TUpload, TExtendedUpload, TProject } from "@kyd/common/api";

/**
 * Returns a single upload list item (same shape as in uploads list),
 * optionally enriched with match when projectId is provided via query.
 */
export const getUploadController: RequestHandler<
  { uploadId: string },
  TUpload | TExtendedUpload,
  unknown,
  { projectId?: string; withMatch?: boolean }
> = async (
  req: Request<
    { uploadId: string },
    TUpload | TExtendedUpload,
    unknown,
    { projectId?: string; withMatch?: boolean }
  >,
  res: Response<TUpload | TExtendedUpload>,
) => {
  if (!req.auth?.payload.sub) {
    throw new Error("Authentication required");
  }
  const userId = req.auth.payload.sub;

  const { uploadId } = req.params;
  const { projectId, withMatch } = req.query;

  const upload = await UploadModel.findOne({ _id: uploadId })
    .setOptions({ userId })
    .lean();
  if (!upload) {
    throw new NotFound(`Upload not found for id: ${uploadId}`);
  }

  const base = await buildUploadFromDoc(upload, userId);

  if (!withMatch) {
    res.status(200).json(base);
    return;
  }

  let project;
  if (projectId) {
    project = await ProjectModel.get({
      id: projectId,
      _userId: userId,
    });
    if (!project) {
      throw new NotFound(`Project not found for the provided ID: ${projectId}`);
    }
  }

  const extended = await extendWithMatchIfApplicable(base, userId, project);
  res.status(200).json(extended);
};

export const getUploadValidationSchema = {
  [Segments.PARAMS]: {
    uploadId: Joi.string().required(),
  },
  [Segments.QUERY]: {
    projectId: Joi.string().optional(),
    withMatch: Joi.boolean().default(false).optional(),
  },
};
