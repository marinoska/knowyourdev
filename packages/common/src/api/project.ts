import { ScopeType } from "./constants.js";
import { TListResponse } from "./utils.js";

export type TProject = {
  name: string;
  settings: {
    baselineJobDuration: number;
    techFocus: ScopeType[];
    description: string;
    expectedRecentRelevantYears: number;
    technologies: Array<{
      ref: string;
      code: string;
      name: string;
    }>;
  };
  candidates: string[];
};

export type TProjectResponse = TProject & {
  _id: string;
  createdAt: string;
};

export type TProjectsPage = { projects: TProjectResponse[] };
export type GetProjectsListResponse = TListResponse<TProjectsPage>;

export type GetProjectsListQueryParams = {
  page: number;
  limit: number;
};
