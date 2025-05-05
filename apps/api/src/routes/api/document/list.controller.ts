import { Joi, Segments } from 'celebrate';

import { Request, Response, RequestHandler } from 'express';
import { GetUploadsListQueryParams, GetUploadsListResponse } from "@kyd/common/api";
import { getUploadsWithDetails } from "@/models/upload.repository.js";

export const getUploadsListController: RequestHandler<
    any,
    GetUploadsListResponse,
    any,
    GetUploadsListQueryParams
> = async (req: Request<any, GetUploadsListResponse, any, GetUploadsListQueryParams>, res: Response<GetUploadsListResponse>) => {
    const {page = 1, limit = 10} = req.query;

    const {uploads, totalRecords, totalPages, currentPage} = await getUploadsWithDetails({
        page: Number(page),
        limit: Number(limit),
    });

    const responseData = {
        uploads: uploads.map((record) => {
            return {
                _id: record._id?.toString(),
                name: record.metadata?.name || '',
                role: record.metadata?.role,
                size: record.size,
                parseStatus: record.parseStatus,
                hash: record.hash,
                contentType: record.contentType,
                createdAt: record.createdAt?.toISOString(),
                fullName: record.uploadData?.fullName,
                position: record.uploadData?.position,
            }
        }),
        totalRecords,
        currentPage,
        totalPages,
    };


    res.status(200).json(responseData);
};

export const getUploadsListValidationSchema = {
    [Segments.QUERY]: {
        page: Joi.number().integer().min(1).default(1).optional(), // Page number
        limit: Joi.number().integer().min(1).default(30).optional(), // Page size
        // sortBy: Joi.string().valid('name', 'role', 'size', 'createdAt').default('createdAt').optional(), // Sort field
        // sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional(), // Sort order
    },
};
