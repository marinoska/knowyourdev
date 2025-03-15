import { apiClient } from "../client.js";

export type DocumentUploadResponse = {
    uploadId: string;
};

export type UploadCVRequestType = {
    file: File,
    name: string,
    role: string
};

export const uploadCV = ({file, name, role}: UploadCVRequestType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('role', role);

    return apiClient.post<DocumentUploadResponse>('/document/upload', {
        body: formData,
        isFormData: true
    });
};

export const listUploads = () => {
    return apiClient.get<DocumentUploadsResponse>('/document/uploads');
}
