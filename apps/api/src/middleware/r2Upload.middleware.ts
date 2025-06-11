import { Request, Response, NextFunction } from "express";
import { createHash } from "@/utils/crypto.js";
import { uploadFileToR2 } from "@/services/r2Storage.service.js";
import { HttpError, ValidationError } from "@/app/errors.js";
import path from "path";

// Extend the Express Request type to include our file data
declare global {
  namespace Express {
    interface Request {
      r2File?: {
        hash: string;
        r2Key: string;
        r2Url: string;
      };
    }
  }
}

/**
 * Middleware to handle file uploads directly to R2 without saving to disk
 */
export const r2Upload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    throw new ValidationError("No file provided.");
  }

  const { mimetype, buffer, originalname } = req.file;

  const hash = createHash(buffer);
  const fileExtension = path.extname(originalname);

  try {
    const r2Key = `uploads/${hash}${fileExtension}`;
    const r2Url = await uploadFileToR2(buffer, r2Key, mimetype);

    req.r2File = {
      hash,
      r2Key,
      r2Url,
    };
  } catch (e) {
    throw new HttpError("Failed to upload file to R2.", e);
  }

  return next();
};
