import { Joi, Segments } from 'celebrate';
import multer, { FileFilterCallback } from "multer";
import logger from "@/app/logger";
import { IncomingMessage } from 'http';
import type { Response, Request, RequestHandler } from "express";
import { ValidationError } from "@/app/errors";

type DocumentUploadRequestBody = {
    name: string;
    role: string;
}

const log = logger('UploadController');
const MAX_FILE_SIZE = 3 * 1024 * 1024;  // Max file size: 3MB

export const upload = multer({
    dest: 'uploads/',
    limits: {fileSize: MAX_FILE_SIZE},
    fileFilter: (_req: IncomingMessage, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // PDF and DOCX mime types
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            log.error(`Invalid file type ${file.mimetype}`)
            cb(new Error('Invalid file type. Only PDFs and DOCX files are allowed.'));
        }
    },
});

export type DocumentUploadController = RequestHandler<
    any,
    Response,
    DocumentUploadRequestBody,
    any,
    {}
>;
export type DocumentUploadRequest = Request<any, any, DocumentUploadRequestBody>;
export const FILE_MULTIPART_PARAM = 'file';
export const documentUploadController: DocumentUploadController = async (req: DocumentUploadRequest, res: Response) => {
    // Multer should have added the file to `req.file`, check it
    if (!req.file) {
        throw new ValidationError('No file provided.');
    }

    // File metadata (use it as required, e.g., saving to database or storage)
    const {originalname, mimetype, size} = req.file;

    // Simulate saving or further processing of the file (custom logic can go here)
    const fileMetadata = {
        fileName: originalname,
        type: mimetype,
        size: size,
    };

    res.status(200).json({
        message: 'File uploaded successfully.',
        file: fileMetadata,
    });
};

export const documentUploadValidationSchema = {
    [Segments.BODY]: {
        name: Joi.string().valid('').required(),
        role: Joi.string().valid('').required(),
    },
};
