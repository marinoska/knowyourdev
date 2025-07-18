import { RoleType, ScopeType } from "./constants.js";
import { TListResponse } from "./utils.js";
import { Schema } from "mongoose";
import { RequireAtLeastOne } from "type-fest";
import { TechStack, TTechnology } from "./technologies.js";

export type TProject<
  TId extends string | Schema.Types.ObjectId = Schema.Types.ObjectId,
  TRef extends
    | string
    | Schema.Types.ObjectId
    | TTechnology<TId> = Schema.Types.ObjectId,
> = {
  _id: TId;
  name: string;
  settings: {
    baselineJobDuration: number;
    techFocus: ScopeType[];
    description: string;
    expectedRecentRelevantYears: number;
    technologies: Array<{
      ref: TRef;
      code: string;
      name: string;
    }>;
  };
  candidates: string[];
  createdAt: Date;
};

export type TProjectPopulated<
  TId extends string | Schema.Types.ObjectId = Schema.Types.ObjectId,
> = TProject<TId, TTechnology<TId>>;

export type PatchProjectBody = RequireAtLeastOne<
  Partial<Omit<TProject<string>, "candidates" | "_id" | "settings">> &
    (
      | {
          settings: Partial<TProject<string>["settings"]>;
        }
      | {}
    )
>;
export type PutProjectBody = Omit<TProject, "candidates" | "_id">;

export type GetProjectsPageQueryParams = {
  page: number;
  limit: number;
  sortOrder?: "asc" | "desc";
};

export type ExtractProjectDataResponse = {
  technologies: (Pick<TTechnology, "name" | "code"> & { ref: string })[];
  techFocus: ScopeType[];
  techStack: TechStack[];
  roleType: RoleType;
  isSoftwareDevelopmentRole: boolean;
  isMobileDevelopmentRole: boolean;
  summary: string;
};

export type ExtractProjectDataRequestBody = {
  title: string;
  description: string;
  projectId: string;
};
