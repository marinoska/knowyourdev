import { apiClient } from "@/api";
import {
  DocumentUploadRequestType,
  DocumentUploadResponse,
  GetUploadsListResponse,
  TUploadsPage,
  UploadTechProfileResponse,
} from "@kyd/common/api";
import { InfiniteData } from "@tanstack/react-query";

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

export type UploadsListParams = {
  page: number;
  limit: number;
};

export type InfiniteUploadList = InfiniteData<TUploadsPage>;

export const listUploads = async ({ page, limit }: UploadsListParams) => {
  return apiClient.get<GetUploadsListResponse>("/document/uploads", {
    params: { page, limit },
  });
};

export const getUploadProfile = async ({ uploadId }: { uploadId: string }) => {
  return apiClient.get<UploadTechProfileResponse>(
    `/document/uploads/${uploadId}`,
  );
};
