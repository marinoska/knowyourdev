export type TListResponse<T> = {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
} & T;
