import { apiClient } from "@/api";
import {
  DocumentUploadRequestType,
  DocumentUploadResponse,
  ExtractProjectDataRequestBody,
  ExtractProjectDataResponse,
  GetUploadsListResponse,
  TUploadsPage,
  GetResumeProfileResponse,
  GetUploadsListQueryParams,
  WithCandidateMatch,
  PatchProjectBody,
  TListResponse,
} from "@kyd/common/api";
import { InfiniteData } from "@tanstack/react-query";
import { TProjectDTO } from "@/api/query/types.ts";

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
}: GetUploadsListQueryParams) => {
  return apiClient.get<GetUploadsListResponse>("/document/uploads", {
    params: {
      page,
      limit,
      projectId,
      withMatch: !!projectId, // Optional parameter to include match data part
    },
  });
};

export type GetProjectsListResponse = TListResponse<{
  projects: TProjectDTO[];
}>;

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
    GetResumeProfileResponse<
      typeof projectId extends string ? WithCandidateMatch : object
    >
  >(`/resume/profile/${uploadId}`, {
    params: { projectId },
  });
};

export const getProjectProfile = async ({
  projectId,
}: {
  projectId: string;
}): Promise<TProjectDTO> => {
  return apiClient.get(`/projects/${projectId}`);
};

export const updateProject = async ({
  projectId,
  projectData,
}: {
  projectId: string;
  projectData: PatchProjectBody;
}): Promise<TProjectDTO> => {
  return apiClient.patch(`/projects/${projectId}`, {
    body: projectData,
  });
};

export const extractJobData = async (
  requestBody: ExtractProjectDataRequestBody,
): Promise<ExtractProjectDataResponse> => {
  return apiClient.post<ExtractProjectDataResponse>(
    `/projects/extract-job-data`,
    {
      body: requestBody,
    },
  );
};

export type PostProjectBody = {
  name: string;
  // description: string;
};

export const createProject = async (
  projectData: PostProjectBody,
): Promise<TProjectDTO> => {
  return apiClient.post<TProjectDTO>("/projects", {
    body: projectData,
  });
};

export const deleteProject = async (
  projectId: string,
): Promise<{ success: boolean }> => {
  return apiClient.doDelete<{ success: boolean }>(`/projects/${projectId}`);
};
