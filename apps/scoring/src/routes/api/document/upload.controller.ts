import { Joi, Segments } from 'celebrate';
import multer, { FileFilterCallback } from "multer";
import logger from "@/app/logger";
import { IncomingMessage } from 'http';
import type { Response, Request, RequestHandler } from "express";
import { ValidationError } from "@/app/errors";
import { createHash } from "@/utils/crypto";
import { TUploadDocument, UploadModel } from "@/models/upload.model";
import * as fs from "node:fs";
import { DocumentUploadRequestBody, DocumentUploadResponse } from "@kyd/types/api";
import { processUpload, runCVDataExtraction } from "@/chain/extraction/runner";
import { env } from "@/app/env";

const log = logger('UploadController');
const MAX_FILE_SIZE = 3 * 1024 * 1024;  // Max file size: 3MB
const dest = env('UPLOAD_DIR');
export const upload = multer({
    dest,
    // storage: multer.memoryStorage(),
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
    DocumentUploadResponse,
    DocumentUploadRequestBody,
    any,
    {}
>;
export type DocumentUploadRequest = Request<any, any, DocumentUploadRequestBody>;
export const FILE_MULTIPART_PARAM = 'file';


export const documentUploadController: DocumentUploadController = async (req: DocumentUploadRequest, res: Response<DocumentUploadResponse>) => {
    // Multer should have added the file to `req.file`, check it
    if (!req.file) {
        throw new ValidationError('No file provided.');
    }

    const {name, role} = req.body;
    // File metadata (use it as required, e.g., saving to database or storage)
    const {originalname, mimetype, size, filename, path: filePath} = req.file;
    let buffer: Buffer;
    try {
        buffer = fs.readFileSync(filePath); // Read the file as a Buffer
    } catch (err) {
        throw new Error("Failed to read the file" + JSON.stringify(err));
    }

    const hash = createHash(buffer);
    // const existingFile = await UploadModel.findOne({hash});
    // if (existingFile) {
    //     res.status(409).json({error: 'File already exists', fileId: existingFile._id});
    //
    //     return;
    // }

    const newUpload: TUploadDocument = new UploadModel({
        originalName: originalname,
        filename: filename,  // Store the hash as the filename for uniqueness
        hash,
        contentType: mimetype,
        // data: buffer,
        size,
        metadata: {
            name: name || originalname,
            role
        },
        parseStatus: 'pending'
    });

    await newUpload.save();

    void processUpload(newUpload);

    res.status(200).json({
        _id: newUpload._id.toString(),
        name: newUpload.metadata.name,
        role: newUpload.metadata.role,
        size: newUpload.size,
        parseStatus: newUpload.parseStatus,
        createdAt: newUpload.createdAt.toISOString()
    });
};

export const documentUploadValidationSchema = {
    [Segments.BODY]: {
        name: Joi.string().allow('').optional().default(''),
        role: Joi.string().allow('').optional().default('')
    },
};
