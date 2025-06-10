import { Joi, Segments } from "celebrate";
import logger from "@/app/logger.js";
import type { Response, Request, RequestHandler } from "express";
import { ValidationError } from "@/app/errors.js";
import { TUploadDocument, UploadModel } from "@/models/upload.model.js";
import {
  DocumentUploadRequestBody,
  DocumentUploadResponse,
} from "@kyd/common/api";
import {
  processUpload,
  runCVDataExtraction,
} from "@/chain/extraction/runner.js";

const log = logger("UploadController");

export type DocumentUploadController = RequestHandler<
  any,
  DocumentUploadResponse,
  DocumentUploadRequestBody,
  any,
  {}
>;
export type DocumentUploadRequest = Request<
  any,
  any,
  DocumentUploadRequestBody
>;

export const documentUploadController: DocumentUploadController = async (
  req: DocumentUploadRequest,
  res: Response<DocumentUploadResponse>,
) => {
  // r2Upload middleware should have added the file to `req.r2File`
  if (!req.r2File) {
    throw new ValidationError("No file provided.");
  }

  const { name, role } = req.body;
  // File metadata from r2File
  const { originalname, mimetype, size, hash, r2Key, r2Url, buffer } =
    req.r2File;

  // Create a new upload document
  const newUpload: TUploadDocument = new UploadModel({
    originalName: originalname,
    filename: `${hash}-${originalname}`, // Generate a filename for backward compatibility
    hash,
    contentType: mimetype,
    size,
    r2Key,
    r2Url,
    metadata: {
      name: name || originalname,
      role,
    },
    parseStatus: "pending",
  });

  await newUpload.save();

  void processUpload(newUpload, buffer);

  res.status(200).json({
    _id: newUpload._id.toString(),
    name: newUpload.metadata.name,
    role: newUpload.metadata.role,
    size: newUpload.size,
    contentType: newUpload.contentType,
    parseStatus: newUpload.parseStatus,
    createdAt: newUpload.createdAt.toISOString(),
  });
};

export const documentUploadValidationSchema = {
  [Segments.BODY]: {
    name: Joi.string().allow("").optional().default(""),
    role: Joi.string().allow("").optional().default(""),
  },
};
