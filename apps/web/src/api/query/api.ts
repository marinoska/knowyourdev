import { apiClient } from "@/api";
import {
  DocumentUploadRequestType,
  DocumentUploadResponse,
  GetProjectsListResponse,
  GetUploadsListResponse,
  TProjectResponse,
  TUploadsPage,
  GetResumeProfileResponse,
  GetUploadsListQueryParams,
  WithCandidateMatch,
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

export const listUploads = async ({
  page,
  limit,
  projectId,
  withMatch,
}: GetUploadsListQueryParams) => {
  return apiClient.get<GetUploadsListResponse>("/document/uploads", {
    params: { page, limit, projectId, withMatch },
  });
};

export const listProjects = async ({ page, limit }: ListParams) => {
  return apiClient.get<GetProjectsListResponse>("/projects", {
    params: { page, limit },
  });
};

export const getProjectsProps = async () => {
  const response = await listProjects({ page: 1, limit: 100 });
  const names = response.projects.map((project) => project.name);

  return { names };
};

export const getResumeProfile = async ({
  uploadId,
  projectId,
}: {
  uploadId: string;
  projectId?: string;
}) => {
  return apiClient.get<
    GetResumeProfileResponse<typeof projectId extends string ? WithCandidateMatch : {}>
  >(`/resume/profile/${uploadId}`, {
    params: { projectId },
  });
};

export const getProjectProfile = async ({
  projectId,
}: {
  projectId: string;
}): Promise<TProjectResponse> => {
  return apiClient.get<TProjectResponse>(`/projects/${projectId}`);
};
