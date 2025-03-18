import { apiClient } from "@/api";
import {
    DocumentUploadRequestType,
    DocumentUploadResponse,
    GetUploadsListResponse, UploadTechProfileResponse
} from "@kyd/types/api";

export const uploadCV = ({file, name, role}: DocumentUploadRequestType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('role', role);

    return apiClient.post<DocumentUploadResponse>('/document/upload', {
        body: formData,
        isFormData: true
    });
};

export const listUploads = async () => {
    const response = await apiClient.get<GetUploadsListResponse>('/document/uploads');
    return response?.uploads || response;
}

export const getUploadProfile = async ({uploadId}: { uploadId: string }) => {
    return apiClient.get<UploadTechProfileResponse>(`/document/uploads/${uploadId}`);
}
