import { apiClient } from "@/api";
import {
  DocumentUploadRequestType,
  DocumentUploadResponse,
  GetProjectsListResponse,
  GetUploadsListResponse,
  TProjectsItem,
  TProjectsPage,
  TUploadsPage,
  UploadTechProfileResponse,
} from "@kyd/common/api";
import { InfiniteData } from "@tanstack/react-query";
import { mockProjects } from "@/api/query/mockProjects.ts";

export const uploadCV = ({ file, name, role }: DocumentUploadRequestType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("role", role);

  return apiClient.post<DocumentUploadResponse>("/document/upload", {
    body: formData,
    isFormData: true,
  });
};

export type ListParams = {
  page: number;
  limit: number;
};

export type InfiniteUploadList = InfiniteData<TUploadsPage>;
export type InfiniteProjectList = InfiniteData<TProjectsPage>;

export const listUploads = async ({
  page,
  limit,
  projectId,
}: ListParams & { projectId?: string }) => {
  return apiClient.get<GetUploadsListResponse>("/document/uploads", {
    params: { page, limit, projectId },
  });
};

export const listProjects = async ({ page, limit }: ListParams) => {
  // return apiClient.get<GetProjectsListResponse>("/document/projects", {
  //   params: { page, limit },
  // });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProjects = mockProjects.slice(startIndex, endIndex);

  const mockResponse: GetProjectsListResponse = {
    projects: paginatedProjects,
    totalRecords: mockProjects.length,
    currentPage: page,
    totalPages: Math.ceil(mockProjects.length / limit),
  };

  return Promise.resolve(mockResponse);
};

export const getProjectsProps = async () => {
  const names = mockProjects.map((project) => project.name);

  return Promise.resolve({ names });
};

export const getUploadProfile = async ({ uploadId }: { uploadId: string }) => {
  return apiClient.get<UploadTechProfileResponse>(
    `/document/uploads/${uploadId}`,
  );
};

export const getProjectProfile = async ({
  projectId,
}: {
  projectId: string;
}): Promise<TProjectsItem> => {
  const project = mockProjects.find((p) => p._id === projectId);

  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  return Promise.resolve(project);
};
