import { Joi, Segments } from "celebrate";
import type { Response, Request } from "express";
import { TUploadDocument, UploadModel } from "@/models/upload.model.js";
import {
  DocumentUploadRequestBody,
  DocumentUploadResponse,
} from "@kyd/common/api";
import { processUpload } from "@/chain/extraction/resume/runner.js";
import { ValidationError } from "@/app/errors.js";
import { ProjectModel } from "@/models/project.model.js";
import { validateOptionalObjectId } from "@/utils/validation.js";

export type DocumentUploadRequest = Request<
  unknown,
  unknown,
  DocumentUploadRequestBody
>;

export const documentUploadController = async (
  req: DocumentUploadRequest,
  res: Response<DocumentUploadResponse>,
) => {
  // r2Upload middleware should have added the file to `req.r2File`
  if (!req.r2File || !req.file) {
    throw new Error("No file uploaded to R2. Please try again.");
  }

  const { name, projectId } = req.body;
  const { originalname, mimetype, size, buffer } = req.file;
  const { hash, r2Key, r2Url } = req.r2File;

  if (projectId) {
    if (!(await ProjectModel.findById(projectId))) {
      throw new ValidationError(
        `Project not found for the provided ID: ${projectId}`,
      );
    }
  }

  const newUpload: TUploadDocument = new UploadModel({
    originalName: originalname,
    filename: r2Key,
    hash,
    contentType: mimetype,
    size,
    r2Key,
    r2Url,
    metadata: {
      name: name || originalname,
      projectId: projectId || "",
    },
    parseStatus: "pending",
  });

  await newUpload.save();

  if (projectId) {
    await ProjectModel.findByIdAndUpdate(
      projectId,
      { $push: { candidates: newUpload._id } },
      { new: true },
    );
  }

  void processUpload(newUpload, buffer);

  res.status(200).json({
    _id: newUpload._id.toString(),
    name: newUpload.metadata.name,
    size: newUpload.size,
    contentType: newUpload.contentType,
    parseStatus: newUpload.parseStatus,
    createdAt: newUpload.createdAt.toISOString(),
  });
};

export const documentUploadValidationSchema = {
  [Segments.BODY]: {
    name: Joi.string().allow("").optional().default(""),
    projectId: Joi.string()
      .optional()
      .custom(validateOptionalObjectId, "MongoDB ObjectId validation"),
  },
};
