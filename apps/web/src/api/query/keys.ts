import { QueryKey } from "@tanstack/react-query";

export const uploadsKeys = {
    list: (): QueryKey => ['uploads', 'list'],
    paginate: (page: number, limit: number): QueryKey => ['uploads', page, limit],
    profile: (id: string): QueryKey => ['uploads', 'profile', id],
}

