import { TProjectModel, TProjectDocument } from "@/models/project.model.js";
import { SortOrder } from "mongoose";
import { PutProjectBody } from "@kyd/common/api";

// export async function getById(
//   this: TProjectModel,
//   id: string,
// ): Promise<TProjectDocument | null> {
//   return this.findById(id).populate("settings.technologies.ref").lean();
// }

export async function patch(
  this: TProjectModel,
  id: string,
  projectData: Partial<{
    name: string;
    settings: Partial<{
      baselineJobDuration: number;
      techFocus: string[];
      description: string;
      expectedRecentRelevantYears: number;
    }>;
  }>,
): Promise<TProjectDocument | null> {
  return this.findByIdAndUpdate(
    id,
    projectData,
    { new: true }, // it ensures that the method returns the updated document
  ).populate("settings.technologies.ref");
}

export type GetProjectsPageParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
};

export type GtProjectsPageResult = {
  projects: TProjectDocument[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
};
export async function getPage(
  this: TProjectModel,
  { page, limit, sortOrder = "desc" }: GetProjectsPageParams,
): Promise<GtProjectsPageResult> {
  const skip = (page - 1) * limit;

  const projects = await this.find({})
    .sort({
      createdAt:
        sortOrder === "asc" ? ("asc" as SortOrder) : ("desc" as SortOrder),
    })
    .skip(skip)
    .limit(limit)
    .populate("settings.technologies.ref")
    .lean();

  const totalRecords = await this.countDocuments({});

  return {
    projects,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function create(
  this: TProjectModel,
  projectData: PutProjectBody,
): Promise<TProjectDocument> {
  const project = new this(projectData);
  return project.save();
}
