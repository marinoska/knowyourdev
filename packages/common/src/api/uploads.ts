export type ParsedStatus = 'pending' | 'failed' | 'processed';
export type UploadItem = {
    _id: string;
    name: string;
    role: string | null;
    fullName: string | null;
    position: string | null;
    hash: string;
    contentType: string
    size: number;
    parseStatus: ParsedStatus;
    createdAt: string;
};

export type TUploadsPage = { uploads: UploadItem[] };

export type GetUploadsListResponse = {
    pages: TUploadsPage[];
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

export type DocumentUploadResponse = UploadItem;

export type DocumentUploadRequestBody = {
    name: string;
    role: string;
}

export type DocumentUploadRequestType = {
    file: File,
} & DocumentUploadRequestBody;

