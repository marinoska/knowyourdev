import { apiClient } from "../client.js";

export type ApiResponse = {
    success: boolean;
    message: string;
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

    return apiClient.post<ApiResponse>('/upload', {body: formData, isJson: false});
};
