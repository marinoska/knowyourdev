import { QueryKey } from "@tanstack/react-query";

export const uploadsKeys = {
  list: (): QueryKey => ["uploads", "list"],
  paginate: (page: number): QueryKey => ["uploads", page],
  profile: (id: string): QueryKey => ["uploads", "profile", id],
};

export const projectsKeys = {
  list: (): QueryKey => ["projects", "list"],
  paginate: (page: number): QueryKey => ["projects", page],
  profile: (id: string): QueryKey => ["projects", "profile", id],
};
