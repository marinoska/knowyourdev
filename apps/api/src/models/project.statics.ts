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
  {
    id,
    _userId,
    projectData,
  }: {
    id: string;
    _userId: string;
    projectData: ProjectPatchData;
  },
): Promise<TProject | null> {
  const doc = await this.findById<TProjectDocument>(id).setOptions({
    userId: _userId,
  });
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
  {
    page,
    limit,
    sortOrder = "desc",
    _userId,
  }: {
    page: number;
    limit: number;
    sortOrder?: "asc" | "desc";
    _userId: string;
  },
): Promise<GetProjectsPageResult> {
  const skip = (page - 1) * limit;

  const projects = await this.find({ userId: _userId })
    .setOptions({ userId: _userId })
    .sort({
      createdAt:
        sortOrder === "asc" ? ("asc" as SortOrder) : ("desc" as SortOrder),
    })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalRecords = await this.countDocuments({
    userId: _userId,
  }).setOptions({ userId: _userId });

  return {
    projects: projects as TProject[],
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export type PostProjectBody = {
  name: string;
  description?: string;
};

export async function createNew(
  this: TProjectModel,
  projectData: PostProjectBody,
  userId: string,
): Promise<TProjectDocument> {
  const project = new this({
    userId,
    name: projectData.name,
    candidates: [],
    settings: {
      baselineJobDuration: 15,
      expectedRecentRelevantYears: 5,
      description: projectData.description ?? "",
      technologies: [],
      techFocus: [],
    },
  }) as TProjectDocument;

  return project.save();
}

export async function deleteById(
  this: TProjectModel,
  {
    id,
    _userId,
  }: {
    id: string;
    _userId: string;
  },
): Promise<boolean> {
  const result = await this.findByIdAndDelete(id).setOptions({
    userId: _userId,
  });
  return result !== null;
}

export async function get(
  this: TProjectModel,
  {
    id,
    _userId,
  }: {
    id: string;
    _userId: string;
  },
): Promise<TProject | null> {
  const project = await this.findById(id)
    .setOptions({ userId: _userId })
    .lean();

  return project as TProject | null;
}

export async function addCandidate(
  this: TProjectModel,
  {
    projectId,
    candidateId,
    _userId,
  }: {
    projectId: string;
    candidateId: Schema.Types.ObjectId;
    _userId: string;
  },
): Promise<TProject | null> {
  const updatedProject = await this.findByIdAndUpdate(
    projectId,
    { $push: { candidates: candidateId } },
    { new: true }
  ).setOptions({ userId: _userId });

  return updatedProject as TProject | null;
}
