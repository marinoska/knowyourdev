import { TProjectModel, TProjectDocument } from "@/models/project.model.js";
import { Schema, SortOrder } from "mongoose";
import { ScopeType, TProject } from "@kyd/common/api";

export type ProjectPatchData = Partial<{
  name: string;
  settings: Partial<{
    baselineJobDuration: number;
    techFocus: ScopeType[];
    technologies: Array<{
      ref: Schema.Types.ObjectId;
      code: string;
      name: string;
    }>;
    description: string;
    expectedRecentRelevantYears: number;
  }>;
}>;

export async function patch(
  this: TProjectModel,
  id: string,
  projectData: ProjectPatchData,
): Promise<TProject | null> {
  const doc = await this.findById<TProjectDocument>(id);
  if (!doc) return null;

  if (projectData.name) {
    doc.name = projectData.name;
  }

  if (projectData.settings) {
    const { settings } = projectData;

    if (settings.baselineJobDuration) {
      doc.settings.baselineJobDuration = settings.baselineJobDuration;
    }

    if (settings.description !== undefined) {
      doc.settings.description = settings.description;
    }

    if (settings.expectedRecentRelevantYears !== undefined) {
      doc.settings.expectedRecentRelevantYears =
        settings.expectedRecentRelevantYears;
    }

    if (settings.techFocus !== undefined) {
      doc.settings.techFocus = settings.techFocus;
    }

    if (settings.technologies !== undefined) {
      doc.settings.technologies = settings.technologies;
    }
  }

  await doc.save();
  return doc;
}

export type GetProjectsPageParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
};

export type GetProjectsPageResult = {
  projects: TProject[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
};
export async function getPage(
  this: TProjectModel,
  { page, limit, sortOrder = "desc" }: GetProjectsPageParams,
): Promise<GetProjectsPageResult> {
  const skip = (page - 1) * limit;

  const projects = await this.find({})
    .sort({
      createdAt:
        sortOrder === "asc" ? ("asc" as SortOrder) : ("desc" as SortOrder),
    })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalRecords = await this.countDocuments({});

  return {
    projects: projects as TProject[],
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export type PostProjectBody = {
  name: string;
  description: string;
};

export async function createNew(
  this: TProjectModel,
  projectData: PostProjectBody,
): Promise<TProjectDocument> {
  const project = new this({
    name: projectData.name,
    candidates: [],
    settings: {
      baselineJobDuration: 1,
      expectedRecentRelevantYears: 1,
      description: projectData.description,
      technologies: [],
      techFocus: [],
    },
  }) as TProjectDocument;

  return project.save();
}

export async function deleteById(
  this: TProjectModel,
  id: string,
): Promise<boolean> {
  const result = await this.findByIdAndDelete(id);
  return result !== null;
}
