import { RequestHandler, Response } from "express";
import { UploadTechProfileModel } from "@/models/uploadTechProfile.model.js";
import { Joi, Segments } from "celebrate";
import {
    UploadTechProfileResponse,
} from "@kyd/common/api";
import { NotFound, ValidationError } from "@/app/errors.js";
import { Types } from "mongoose";

export type UploadTechProfileController = RequestHandler<
    { uploadId: string },
    UploadTechProfileResponse,
    any,
    any,
    {}
>;

export const getUploadTechProfileController: UploadTechProfileController = async (
    req,
    res: Response<UploadTechProfileResponse>
) => {
    const {uploadId} = req.params;
    if (!Types.ObjectId.isValid(uploadId)) {
        throw new ValidationError("Invalid upload ID: " + uploadId)
    }

    const techProfile = await UploadTechProfileModel.findOne({uploadRef: uploadId}).lean();

    if (!techProfile) {
        throw new NotFound(`TechProfile not found for the provided uploadRef: ${uploadId}`);
    }

    // Send the tech profile in the response
    res.status(200).json({
        uploadId,
        fullName: techProfile.fullName,
        position: techProfile.position,
        createdAt: techProfile.createdAt.toISOString(),
        updatedAt: techProfile.updatedAt.toISOString(),
        technologies: techProfile.technologies,
        jobs: techProfile.jobs,
    });

};

export const getTechProfileValidationSchema = {
    [Segments.PARAMS]: Joi.object({
        uploadId: Joi.string().required(),
    }),
};