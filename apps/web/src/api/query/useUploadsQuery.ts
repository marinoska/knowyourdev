import { useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { uploadsKeys } from "./keys.ts";
import { listUploads, type InfiniteUploadList } from "./api.ts";
import { TIMES_THREE } from "@/utils/const.ts";
import { GetUploadsListResponse } from "@kyd/common/api";
import { apiClient } from "@/api";

const RELEVANT_EVENTS = new Set(["upload_updated", "upload_created"]);

function isRelevantForProject(
  payload: { projectId?: string },
  projectId?: string,
) {
  if (!projectId || !payload.projectId) return true;
  return payload.projectId === projectId;
}

function updateUploadInInfiniteData(
  data: InfiniteUploadList | undefined,
  {
    uploadId,
    parseStatus,
  }: { uploadId: string; parseStatus?: "pending" | "processed" | "failed" },
): InfiniteUploadList | undefined {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      uploads: page.uploads.map((upload) =>
        (upload as { _id?: string })._id === uploadId
          ? {
              ...upload,
              parseStatus: parseStatus ?? upload.parseStatus,
            }
          : upload,
      ),
    })),
  };
}

export const useUploadsQuery = ({
  page,
  limit,
  projectId,
}: {
  page: number;
  limit: number;
  projectId?: string;
}) => {
  const queryClient = useQueryClient();

  const { data, ...rest } = useInfiniteQuery<GetUploadsListResponse, Error>({
    queryKey: uploadsKeys.paginate(page, projectId),
    queryFn: ({ pageParam }: { pageParam: number | unknown }) =>
      listUploads({ page: Number(pageParam), limit, projectId }),
    initialPageParam: 1,
    retry: TIMES_THREE,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.currentPage > 1 ? firstPage.currentPage - 1 : undefined,
  });

  // Subscribe to server-sent updates using EventSource
  useEffect(() => {
    const token = apiClient.authToken;
    const url = new URL(`${apiClient.host}/events/uploads`);
    if (token) url.searchParams.set("access_token", token);

    const connect = () => {
      const es = new EventSource(url.toString());

      const handler = (ev: MessageEvent) => {
        if (!RELEVANT_EVENTS.has(ev.type)) return;
        const payload = JSON.parse(ev.data);
        console.log("SSE event:", ev.type, payload);
        if (!isRelevantForProject(payload, projectId)) return;

        if (ev.type === "upload_updated") {
          const { uploadId, parseStatus } = payload as {
            uploadId: string;
            parseStatus?: "pending" | "processed" | "failed";
          };

          queryClient.setQueriesData(
            { queryKey: ["uploads", "paginate"] },
            (old: InfiniteUploadList) => {
              return updateUploadInInfiniteData(old, {
                uploadId,
                parseStatus,
              });
            },
          );
        }
      };

      for (const evName of RELEVANT_EVENTS) {
        es.addEventListener(evName, handler);
      }

      es.onerror = (err) => {
        console.error("SSE connection error:", err);
      };

      return es;
    };

    const es = connect();

    return () => es.close();
  }, [projectId, queryClient]);

  const allData = data ? data.pages.flatMap((page) => page.uploads) : [];

  return {
    data: allData,
    ...rest,
  };
};
