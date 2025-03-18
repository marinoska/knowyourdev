import { QueryKey } from "@tanstack/react-query";

export const uploadsKeys = {
    list: (): QueryKey => ['uploads', 'list'],
    profile: (id: string): QueryKey => ['uploads', 'profile', id],
}

