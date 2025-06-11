import multer, { FileFilterCallback } from "multer";
import logger from "@/app/logger.js";
import { IncomingMessage } from "http";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // Max file size: 3MB
export const FILE_MULTIPART_PARAM = "file";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const log = logger("Multer");

export const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (
    _req: IncomingMessage,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      log.error(`Invalid file type ${file.mimetype}`);
      cb(new Error("Invalid file type. Only PDFs and DOCX files are allowed."));
    }
  },
});
