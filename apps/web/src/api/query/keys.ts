import { QueryKey } from "@tanstack/react-query";

export const uploadsKeys = {
  list: (): QueryKey => ["uploads", "list"],
  paginate: (page: number, projectId: string = ""): QueryKey => [
    "uploads",
    page,
    projectId,
  ],
  profile: (id: string, projectId?: string): QueryKey =>
    projectId
      ? ["uploads", "profile", id, projectId]
      : ["uploads", "profile", id],
};

export const projectsKeys = {
  list: (): QueryKey => ["projects", "list"],
  paginate: (page: number): QueryKey => ["projects", "list", page],
  profile: (id: string): QueryKey => ["projects", "profile", id],
  props: (): QueryKey => ["projects", "props"],
};
