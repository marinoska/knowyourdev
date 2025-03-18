import { RequestHandler, Response } from "express";
import { UploadTechProfileModel } from "@/models/uploadTechProfile.model";
import { Joi, Segments } from "celebrate";
import { UploadTechProfileJobEntry, UploadTechProfileTechnologiesEntry } from "@kyd/types/api";
import { NotFound } from "@/app/errors";

export type TechProfileController = RequestHandler<
    { uploadId: string },
    TechProfileResponse,
    any,
    any,
    {}
>;

export type TechProfileResponse = {
    uploadId: string;
    techProfile: {
        fullName: string;
        technologies: UploadTechProfileTechnologiesEntry[];
        jobs: UploadTechProfileJobEntry[];
        createdAt: string;
        updatedAt: string;
    };
};

export const getTechProfileController: TechProfileController = async (
    req,
    res: Response<TechProfileResponse>
) => {
    const {uploadId} = req.params;

    const techProfile = await UploadTechProfileModel.findOne({uploadRef: uploadId});

    if (!techProfile) {
        throw new NotFound(`TechProfile not found for the provided uploadRef: ${uploadId}`);
    }

    // Send the tech profile in the response
    res.status(200).json({
        uploadId,
        techProfile: {
            fullName: techProfile.fullName,
            technologies: techProfile.technologies,
            jobs: techProfile.jobs,
            createdAt: techProfile.createdAt.toISOString(),
            updatedAt: techProfile.updatedAt.toISOString(),
        },
    });

};

export const getTechProfileValidationSchema = {
    [Segments.PARAMS]: Joi.object({
        uploadId: Joi.string().required(),
    }),
};