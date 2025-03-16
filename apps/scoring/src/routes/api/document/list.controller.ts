import { Joi, Segments } from 'celebrate';

import { Request, Response, RequestHandler } from 'express';
import { UploadModel } from "@/models/uploadModel";
import { GetUploadsListQueryParams, GetUploadsListResponse } from "@kyd/types/api";

// Define the controller
export const getUploadsListController: RequestHandler<
    any,
    GetUploadsListResponse,
    any,
    GetUploadsListQueryParams
> = async (req: Request<any, GetUploadsListResponse, any, GetUploadsListQueryParams>, res: Response<GetUploadsListResponse>) => {
    const {page, limit} = req.query;

    const skip = (page - 1) * limit;

    const uploads = await UploadModel.find()
        // .sort({[sortBy]: sortOrder === 'asc' ? 1 : -1})
        .sort({'createdAt': -1})
        .skip(skip)
        .limit(limit) // Limit documents per page
        .select('metadata.size metadata.name metadata.role size createdAt parseStatus')
        .lean();

    // Fetch the total count
    const totalRecords = await UploadModel.countDocuments();

    // Prepare the response
    const responseData = {
        uploads: uploads.map((upload) => ({
            _id: upload._id.toString(),
            name: upload.metadata.name,
            role: upload.metadata.role,
            size: upload.size,
            parseStatus: upload.parseStatus,
            createdAt: upload.createdAt.toISOString(),
        })),
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit)
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
