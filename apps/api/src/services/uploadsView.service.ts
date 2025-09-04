import { type TUploadDocument } from "@/models/upload.model.js";
import { ResumeDataModel } from "@/models/resumeDataModel.js";
import { ProfileMetricsService } from "@/services/profileMetrics.service.js";
import { ProfileMatchService } from "@/services/profileMatch.service.js";
import type { TUpload, TExtendedUpload, TProject } from "@kyd/common/api";
import { Schema } from "mongoose";
import { ResumeProfileModel } from "@/models/resumeProfileModel.js";

/**
 * Build a single TUpload DTO from an Upload document, enriching with
 * fullName and position from ResumeDataModel
 */
export function buildUploadBase(
  upload: TUploadDocument,
  resume?: { fullName?: string; position?: string },
): TUpload {
  return {
    _id: upload._id.toString(),
    name: upload.metadata?.name || "",
    fullName: resume?.fullName ?? null,
    position: resume?.position ?? null,
    hash: upload.hash,
    contentType: upload.contentType,
    size: upload.size,
    parseStatus: upload.parseStatus,
    createdAt: upload.createdAt.toISOString(),
  };
}

export async function buildUploadFromDoc(
  upload: TUploadDocument,
  userId: string,
): Promise<TUpload> {
  const resumeData = await ResumeDataModel.findOne(
    { uploadRef: upload._id },
    { fullName: 1, position: 1, uploadRef: 1 },
  )
    .setOptions({ userId })
    .lean();

  return buildUploadBase(upload, resumeData ?? undefined);
}

/**
 * Given a base TUpload record and optional project, attach match when applicable
 */
export async function extendWithMatchIfApplicable(
  record: TUpload,
  userId: string,
  project?: TProject,
): Promise<TUpload | TExtendedUpload> {
  if (record.parseStatus !== "processed" || !project) return record;

  const resumeProfile = await ResumeProfileModel.getOne({
    uploadRef: record._id,
    _userId: userId,
  });
  if (!resumeProfile) return record;

  const metrics = new ProfileMetricsService().calculateProfileMetrics(
    resumeProfile,
  );

  const match = new ProfileMatchService().getCandidateMatch({
    project,
    candidate: {
      ...resumeProfile,
      ...metrics,
      uploadId: resumeProfile.uploadRef as unknown as Schema.Types.ObjectId,
    },
  });

  return { ...record, match };
}
