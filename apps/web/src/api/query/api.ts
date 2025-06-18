import { apiClient } from "@/api";
import {
  DocumentUploadRequestType,
  DocumentUploadResponse,
  GetProjectsListResponse,
  GetUploadsListResponse,
  TProjectsItem,
  TProjectsPage,
  TUploadsPage,
  ResumeTechProfileResponse,
} from "@kyd/common/api";
import { InfiniteData } from "@tanstack/react-query";

export const uploadCV = ({
  file,
  name,
  projectId,
}: DocumentUploadRequestType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  if (projectId) {
    formData.append("projectId", projectId);
  }

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
  return apiClient.get<GetProjectsListResponse>("/document/projects", {
    params: { page, limit },
  });
};

export const getProjectsProps = async () => {
  const response = await listProjects({ page: 1, limit: 100 });
  const names = response.projects.map((project) => project.name);

  return { names };
};

export const getUploadProfile = async ({ uploadId }: { uploadId: string }) => {
  return apiClient.get<ResumeTechProfileResponse>(
    `/document/uploads/${uploadId}`,
  );
};

export const getProjectProfile = async ({
  projectId,
}: {
  projectId: string;
}): Promise<TProjectsItem> => {
  return apiClient.get<TProjectsItem>(`/document/projects/${projectId}`);
};
