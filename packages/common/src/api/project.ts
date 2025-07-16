import { RoleType, ScopeType } from "./constants.js";
import { TListResponse } from "./utils.js";
import { Schema } from "mongoose";
import { RequireAtLeastOne } from "type-fest";
import { TechnologyEntry } from "./resumeData.js";
import { TechStack } from "./tech.js";

export type TProject<
  TId extends string | Schema.Types.ObjectId = Schema.Types.ObjectId,
> = {
  _id: TId;
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

export type TProjectResponse = TProject<string> & {
  createdAt: string;
};

export type TProjectsPage = { projects: TProjectResponse[] };

export type PatchProjectBody = RequireAtLeastOne<
  Partial<Omit<TProject, "candidates" | "_id" | "settings">> & {
    settings: Partial<TProject["settings"]>;
  }
>;
export type PutProjectBody = Omit<TProject, "candidates" | "_id">;
export type GetProjectsListResponse = TListResponse<TProjectsPage>;

export type GetProjectsPageQueryParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
};

export type ExtractJobDataRequestBody = {
  title: string;
  description: string;
  projectId: string;
};

export type ExtractJobDataResponse = {
  technologies: TechnologyEntry[];
  techStack: TechStack[];
  roleType: RoleType;
  isSoftwareDevelopmentRole: boolean;
  isMobileDevelopmentRole: boolean;
  summary: string;
};
