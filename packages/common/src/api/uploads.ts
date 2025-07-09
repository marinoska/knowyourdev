import { TListResponse } from "./utils.js";
import { TCandidateMatch } from "./match.js";

export type ParsedStatus = "pending" | "failed" | "processed";
export type TUpload = {
  _id: string;
  name: string;
  fullName: string | null;
  position: string | null;
  hash: string;
  contentType: string;
  size: number;
  parseStatus: ParsedStatus;
  createdAt: string;
};

export type TExtendedUpload = TUpload & {
  match: TCandidateMatch;
};

type ConditionalUploadItem<T extends TUpload> = T extends {
  parseStatus: "processed";
}
  ? TExtendedUpload
  : T;

export type TUploadsPage<WithExtended extends boolean = false> = {
  uploads: WithExtended extends true
    ? ConditionalUploadItem<TUpload>[]
    : TUpload[];
};

export type GetUploadsListResponse = TListResponse<TUploadsPage>;

export type GetUploadsListQueryParams = {
  page: number;
  limit: number;
  projectId?: string;
  withMatch?: boolean; // Optional parameter to include match data
  // sortBy?: string;
  // sortOrder?: 'asc' | 'desc';
};

export type DocumentUploadResponse = Omit<
  TUpload,
  "fullName" | "position" | "hash"
>;

export type DocumentUploadRequestBody = {
  name: string;
  projectId?: string;
};

export type DocumentUploadRequestType = {
  file: File;
} & DocumentUploadRequestBody;
