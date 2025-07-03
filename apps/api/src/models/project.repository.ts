import { ProjectModel, TProjectDocument } from "@/models/project.model.js";

export type GetProjectsParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
};

export type GeTProjectResponse = {
  projects: TProjectDocument[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
};

export const getProjects = async ({
  page,
  limit,
  sortOrder = "desc",
}: GetProjectsParams): Promise<GeTProjectResponse> => {
  const skip = (page - 1) * limit;

  const projects = await ProjectModel.find({})
    .sort({ createdAt: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .populate('settings.technologies.ref')
    .lean();

  const totalRecords = await ProjectModel.countDocuments({});

  return {
    projects,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  };
};

export const getProjectById = async (id: string) => {
  return ProjectModel.findById(id)
    .populate('settings.technologies.ref')
    .lean();
};

export const createProject = async (projectData: {
  name: string;
  settings: {
    baselineJobDuration: number;
    techFocus: string[];
    description: string;
    expectedRecentRelevantYears: number;
  };
}) => {
  const project = new ProjectModel(projectData);
  return project.save();
};

export const updateProject = async (
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
) => {
  return ProjectModel.findByIdAndUpdate(id, projectData, { new: true }).lean();
};

export const deleteProject = async (id: string) => {
  return ProjectModel.findByIdAndDelete(id);
};
