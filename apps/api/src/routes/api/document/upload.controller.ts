import { Joi, Segments } from "celebrate";
import type { Response, Request, RequestHandler } from "express";
import { TUploadDocument, UploadModel } from "@/models/upload.model.js";
import {
  DocumentUploadRequestBody,
  DocumentUploadResponse,
} from "@kyd/common/api";
import { processUpload } from "@/chain/extraction/runner.js";

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
  if (!req.r2File || !req.file) {
    throw new Error("No file uploaded to R2. Please try again.");
  }

  const { name, role } = req.body;
  const { originalname, mimetype, size, buffer } = req.file;
  const { hash, r2Key, r2Url } = req.r2File;

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
