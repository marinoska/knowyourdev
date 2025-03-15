export type UploadItem = {
    _id: string;
    name: string;
    role: string;
    size: number;
    createdAt: string;
};

export type GetUploadsListResponse = {
    uploads: UploadItem[];
    totalRecords: number;
    currentPage: number;
    totalPages: number;
};

export type GetUploadsListQueryParams = {
    page: number;
    limit: number;
    // sortBy?: string;
    // sortOrder?: 'asc' | 'desc';
};
