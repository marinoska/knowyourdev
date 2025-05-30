import { QueryKey } from "@tanstack/react-query";

export const uploadsKeys = {
    list: (): QueryKey => ['uploads', 'list'],
    paginate: (page: number): QueryKey => ['uploads', page],
    profile: (id: string): QueryKey => ['uploads', 'profile', id],
}

