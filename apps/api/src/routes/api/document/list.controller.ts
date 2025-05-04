import { Joi, Segments } from 'celebrate';

import { Request, Response, RequestHandler } from 'express';
import { TUploadDocument, UploadModel } from "@/models/upload.model.js";
import { GetUploadsListQueryParams, GetUploadsListResponse } from "@kyd/common/api";
import { UploadDataModel } from "@/models/uploadData.model.js";

// Define the controller
export const getUploadsListController: RequestHandler<
    any,
    GetUploadsListResponse,
    any,
    GetUploadsListQueryParams
> = async (req: Request<any, GetUploadsListResponse, any, GetUploadsListQueryParams>, res: Response<GetUploadsListResponse>) => {
    const {page, limit} = req.query;

    const skip = (page - 1) * limit;

    const uploadDataRecords = await UploadDataModel.find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .select('fullName position uploadRef')
        .populate({
            path: 'uploadRef',
            select: 'metadata.size metadata.name metadata.role size parseStatus createdAt', // Fetch required fields from Upload
        })
        .lean();

    const totalRecords = await UploadModel.countDocuments();


    const responseData = {
        uploads: uploadDataRecords.map((record) => {
            const uploadRef = <TUploadDocument>record.uploadRef;

            return {
                _id: uploadRef?._id?.toString(),
                name: uploadRef?.metadata?.name || '',
                role: uploadRef?.metadata?.role || '',
                size: uploadRef?.size || '',
                parseStatus: uploadRef?.parseStatus,
                createdAt: uploadRef?.createdAt?.toISOString(),
                fullName: record.fullName || '',
                position: record.position || '',
            }
        }),
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
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
