import { UploadModel } from "@/models/upload.model.js";
import {
  ResumeDataModel,
  TResumeDataDocument,
} from "@/models/resumeDataModel.js";
import { SortOrder } from "mongoose";
import { TUpload, TListResponse, TProject } from "@kyd/common/api";
import { buildUploadBase } from "@/services/uploadsView.service.js";

type TParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
  project?: TProject | null;
  userId: string;
};

export const getUploadsWithDetails = async ({
  page,
  limit,
  sortOrder = "desc",
  project,
  userId,
}: TParams): Promise<TListResponse<{ uploads: TUpload[] }>> => {
  const skip = (page - 1) * limit;

  const query = project?.candidates ? { _id: { $in: project.candidates } } : {};

  const totalRecords = project
    ? project.candidates.length
    : await UploadModel.countDocuments({}).setOptions({ userId });

  const sortOptions = {
    createdAt:
      sortOrder === "asc" ? ("asc" as SortOrder) : ("desc" as SortOrder),
  };

  const uploads = await UploadModel.find(query)
    .setOptions({ userId })
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .lean();

  const uploadIds = uploads.map((upload) => upload._id);

  const resumeData = await ResumeDataModel.find(
    { uploadRef: { $in: uploadIds } },
    { fullName: 1, position: 1, sections: 1, uploadRef: 1 },
  )
    .setOptions({ userId })
    .lean();

  type ResumeDataMap = {
    [key: string]: Pick<TResumeDataDocument, "fullName" | "position">;
  };

  const resumeDataMap = resumeData.reduce<ResumeDataMap>((map, data) => {
    map[data.uploadRef.toString()] = {
      fullName: data.fullName,
      position: data.position,
    };
    return map;
  }, {});

  const uploadsWithDetails = uploads.map((upload) => {
    const uploadId = upload._id.toString();
    const resume = resumeDataMap[uploadId];
    return buildUploadBase(upload, resume);
  });

  return {
    uploads: uploadsWithDetails,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  };
};
