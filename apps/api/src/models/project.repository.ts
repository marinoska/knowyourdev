import { ProjectModel } from "@/models/project.model.js";

export type GetProjectsParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
};

export type GetProjectsResponse = {
  projects: Array<{
    _id: string;
    name: string;
    settings: {
      baselineJobDuration: number;
      techFocus: string[];
      description: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
};

export const getProjects = async ({
  page,
  limit,
  sortOrder = "desc",
}: GetProjectsParams): Promise<GetProjectsResponse> => {
  const skip = (page - 1) * limit;

  const projects = await ProjectModel.find({})
    .sort({ createdAt: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
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
  return ProjectModel.findById(id).lean();
};

export const createProject = async (projectData: {
  name: string;
  settings: {
    baselineJobDuration: number;
    techFocus: string[];
    description: string;
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
    }>;
  }>,
) => {
  return ProjectModel.findByIdAndUpdate(id, projectData, { new: true }).lean();
};

export const deleteProject = async (id: string) => {
  return ProjectModel.findByIdAndDelete(id);
};