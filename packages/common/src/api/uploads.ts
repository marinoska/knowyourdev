import { ScopeType } from "./constants.js";

export type ParsedStatus = "pending" | "failed" | "processed";
export type UploadItem = {
  _id: string;
  name: string;
  role: string | null;
  fullName: string | null;
  position: string | null;
  hash: string;
  contentType: string;
  size: number;
  parseStatus: ParsedStatus;
  createdAt: string;
  r2Key?: string; // Cloudflare R2 object key
  r2Url?: string; // Cloudflare R2 object URL
};

export type TUploadsPage = { uploads: UploadItem[] };

export type ProjectsItem = {
  _id: string;
  name: string;
  settings: {
    baselineJobDuration: number;
    techFocus: ScopeType[];
    description: string;
  };
  createdAt: string;
};

export type TProjectsPage = { projects: ProjectsItem[] };

type TListResponse = {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
};

export type GetUploadsListResponse = TUploadsPage & TListResponse;
export type GetProjectsListResponse = TProjectsPage & TListResponse;

export type GetUploadsListQueryParams = {
  page: number;
  limit: number;
  // sortBy?: string;
  // sortOrder?: 'asc' | 'desc';
};

export type DocumentUploadResponse = Omit<
  UploadItem,
  "fullName" | "position" | "hash"
>;

export type DocumentUploadRequestBody = {
  name: string;
  role: string;
};

export type DocumentUploadRequestType = {
  file: File;
} & DocumentUploadRequestBody;
