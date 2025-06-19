import { UploadModel } from "@/models/upload.model.js";
import { ResumeDataModel } from "@/models/resumeDataModel.js";
import { ParsedStatus } from "@kyd/common/api";
import { ProjectModel } from "@/models/project.model.js";
import mongoose from "mongoose";

export type GetUploadsParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
  projectId?: string;
};

type UploadDetail = {
  _id: string;
  originalName: string;
  filename: string;
  hash: string;
  contentType: string;
  size: number;
  parseStatus: ParsedStatus;
  metadata: {
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  uploadData: {
    fullName: string | null;
    position: string | null;
    sections: string[] | null;
  } | null;
};

export type GetUploadsWithDetailsResponse = {
  uploads: UploadDetail[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
};

export const getUploadsWithDetails = async ({
  page,
  limit,
  sortOrder = "desc",
  projectId,
}: GetUploadsParams) => {
  const skip = (page - 1) * limit;

  const uploadIds = [];
  let matchStage = {};
  let totalRecords = 0;

  if (projectId) {
    const project = await ProjectModel.findById(projectId).lean();
    if (project?.candidates?.length) {
      matchStage = { _id: { $in: project.candidates } };
      totalRecords = project?.candidates?.length || 0;
    } else {
      // If project not found or no candidates, return empty result
      return {
        uploads: [],
        totalRecords: 0,
        currentPage: page,
        totalPages: 0,
      };
    }
  }

  const uploadsWithDetails = await UploadModel.aggregate([
    ...(projectId ? [{ $match: matchStage }] : []),
    {
      $lookup: {
        from: ResumeDataModel.collection.name,
        localField: "_id",
        foreignField: "uploadRef",
        as: "uploadData",
      },
    },
    {
      $unwind: {
        path: "$uploadData", // Flatten the array from $lookup as the looked up data is returned as array of object (always)
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        createdAt: sortOrder === "asc" ? 1 : -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 1,
        originalName: 1,
        filename: 1,
        hash: 1,
        contentType: 1,
        size: 1,
        parseStatus: 1,
        metadata: 1,
        createdAt: 1,
        updatedAt: 1,
        "uploadData.fullName": 1,
        "uploadData.position": 1,
        "uploadData.sections": 1,
      },
    },
  ]);

  // Only count all documents if not filtering by projectId
  if (!projectId) {
    totalRecords = await UploadModel.countDocuments({});
  }

  return {
    uploads: uploadsWithDetails,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  };
};
