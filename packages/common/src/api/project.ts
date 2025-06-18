import { ScopeType } from "./constants.js";
import { TListResponse } from "./utils.js";

export type TProject = {
  name: string;
  settings: {
    baselineJobDuration: number;
    techFocus: ScopeType[];
    description: string;
  };
  candidates: string[];
};

export type TProjectsItem = TProject & {
  _id: string;
  createdAt: string;
};

export type TProjectsPage = { projects: TProjectsItem[] };
export type GetProjectsListResponse = TProjectsPage & TListResponse;

export type GetProjectsListQueryParams = {
  page: number;
  limit: number;
};
