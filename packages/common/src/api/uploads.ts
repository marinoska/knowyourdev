import { TListResponse } from "./utils.js";

export type ParsedStatus = "pending" | "failed" | "processed";
export type TUploadItem = {
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

export type TUploadsPage = { uploads: TUploadItem[] };

export type GetUploadsListResponse = TUploadsPage & TListResponse;

export type GetUploadsListQueryParams = {
  page: number;
  limit: number;
  projectId?: string;
  // sortBy?: string;
  // sortOrder?: 'asc' | 'desc';
};

export type DocumentUploadResponse = Omit<
  TUploadItem,
  "fullName" | "position" | "hash"
>;

export type DocumentUploadRequestBody = {
  name: string;
  projectId?: string;
};

export type DocumentUploadRequestType = {
  file: File;
} & DocumentUploadRequestBody;
