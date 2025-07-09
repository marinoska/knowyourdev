import { UploadModel } from "@/models/upload.model.js";
import {
  ResumeDataModel,
  TResumeDataDocument,
} from "@/models/resumeDataModel.js";
import { TProjectDocument } from "@/models/project.model.js";
import { SortOrder } from "mongoose";
import { TUpload, TListResponse } from "@kyd/common/api";

type TParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
  project?: TProjectDocument | null;
};

export const getUploadsWithDetails = async ({
  page,
  limit,
  sortOrder = "desc",
  project,
}: TParams): Promise<TListResponse<{ uploads: TUpload[] }>> => {
  const skip = (page - 1) * limit;

  // Create query conditions
  const query = project?.candidates ? { _id: { $in: project.candidates } } : {};

  // Get total records count
  const totalRecords =
    project?.candidates?.length || (await UploadModel.countDocuments({}));

  // Create sort options
  const sortOptions = {
    createdAt:
      sortOrder === "asc" ? ("asc" as SortOrder) : ("desc" as SortOrder),
  };

  // First get the uploads
  const uploads = await UploadModel.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .lean();

  // Get the upload IDs
  const uploadIds = uploads.map((upload) => upload._id);

  // Find the corresponding resume data
  const resumeData = await ResumeDataModel.find(
    { uploadRef: { $in: uploadIds } },
    { fullName: 1, position: 1, sections: 1, uploadRef: 1 },
  ).lean();

  type ResumeDataMap = {
    [key: string]: Pick<TResumeDataDocument, "fullName" | "position">;
  };

  // Create a map of resume data by upload ID for quick lookup
  const resumeDataMap = resumeData.reduce<ResumeDataMap>((map, data) => {
    map[data.uploadRef.toString()] = {
      fullName: data.fullName,
      position: data.position,
    };
    return map;
  }, {});

  // Combine the data
  const uploadsWithDetails = uploads.map((upload) => {
    const uploadId = upload._id.toString();
    const resumeData = resumeDataMap[uploadId] || null;
    return {
      _id: uploadId,
      name: upload.metadata?.name || "",
      fullName: resumeData?.fullName,
      position: resumeData?.position,
      hash: upload.hash,
      contentType: upload.contentType,
      size: upload.size,
      parseStatus: upload.parseStatus,
      createdAt: upload.createdAt.toISOString(),
      originalName: upload.originalName,
      filename: upload.filename,
    };
  });

  return {
    uploads: uploadsWithDetails,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  };
};
