import { Request, Response, NextFunction } from "express";
import { IncomingForm } from "formidable";
import { createHash } from "@/utils/crypto.js";
import { uploadFileToR2 } from "@/services/r2Storage.service.js";
import * as fs from "node:fs";
import { HttpError, ValidationError } from "@/app/errors.js";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // Max file size: 3MB
export const FILE_MULTIPART_PARAM = "file";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Extend the Express Request type to include our file data
declare global {
  namespace Express {
    interface Request {
      r2File?: {
        originalname: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
        hash: string;
        r2Key: string;
        r2Url: string;
      };
    }
  }
}

/**
 * Middleware to handle file uploads directly to R2 without saving to disk first
 */
export const r2Upload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const form = new IncomingForm({
    maxFileSize: MAX_FILE_SIZE,
    multiples: false,
    keepExtensions: true,
  });

  // Parse the form
  const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve([fields, files]);
    });
  });

  req.body = { ...req.body, ...fields };

  // Check if file exists
  const file = files[FILE_MULTIPART_PARAM];
  if (!file || !file[0]) {
    return next(new ValidationError("No file provided."));
  }

  const uploadedFile = file[0];
  const { originalFilename, mimetype, size, filepath } = uploadedFile;

  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    // Clean up the temporary file
    fs.unlinkSync(filepath);
    return next(
      new ValidationError(
        "Invalid file type. Only PDFs and DOCX files are allowed.",
      ),
    );
  }

  // Read the file as a buffer
  const buffer = fs.readFileSync(filepath);

  // Calculate hash
  const hash = createHash(buffer);

  // Upload to R2
  try {
    const r2Key = `uploads/${hash}-${originalFilename}`;
    const r2Url = await uploadFileToR2(buffer, r2Key, mimetype);

    // Add file data to request for the controller to use
    req.r2File = {
      originalname: originalFilename,
      mimetype,
      size,
      buffer,
      hash,
      r2Key,
      r2Url,
    };
  } catch (e) {
    return next(new HttpError("Failed to upload file to R2.", e));
  }
  // Clean up the temporary file
  fs.unlinkSync(filepath);

  next();
};
