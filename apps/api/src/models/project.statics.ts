import {
  TProjectModel,
  TProjectDocument,
  TProjectDocumentPopulated,
} from "@/models/project.model.js";
import { SortOrder } from "mongoose";
import { ScopeType, TProjectPopulated, TTechnology } from "@kyd/common/api";

export async function patch(
  this: TProjectModel,
  id: string,
  projectData: Partial<{
    name: string;
    settings: Partial<{
      baselineJobDuration: number;
      techFocus: ScopeType[];
      // TODO
      // technologies: {}[];
      description: string;
      expectedRecentRelevantYears: number;
    }>;
  }>,
): Promise<TProjectPopulated | null> {
  const doc = await this.findById<TProjectDocumentPopulated>(id).populate(
    "settings.technologies.ref",
  );
  if (!doc) return null;

  if (projectData.name) doc.name = projectData.name;
  if (projectData.settings) {
    doc.settings = {
      ...doc.settings,
      ...projectData.settings,
    };
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
  projects: TProjectPopulated[];
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
    .populate<{ "settings.technologies.ref": TTechnology }>(
      "settings.technologies.ref",
    )
    .lean();

  const totalRecords = await this.countDocuments({});

  return {
    projects: projects as TProjectPopulated[],
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export type PostProjectBody = {
  name: string;
  description: string;
};

export async function create(
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
