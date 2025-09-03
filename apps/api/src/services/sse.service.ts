import type { Response, Request } from "express";

// Simple per-user SSE connection manager
export type UploadEvent = {
  type: "upload_created" | "upload_updated";
  payload: {
    uploadId: string;
    parseStatus?: "pending" | "processed" | "failed";
    projectId?: string;
  };
};

class SSEManager {
  private clients: Map<string, Set<Response>> = new Map();
  private keepAliveIntervals: Map<Response, NodeJS.Timeout> = new Map();

  addClient(userId: string, res: Response) {
    if (!this.clients.has(userId)) this.clients.set(userId, new Set());
    this.clients.get(userId)!.add(res);

    res.write(": connected\n\n");

    const interval = setInterval(() => {
      res.write(": ping\n\n");
    }, 25000);
    this.keepAliveIntervals.set(res, interval);

    const cleanup = () => this.removeClient(userId, res);
    res.on("close", cleanup);
    res.on("finish", cleanup);
    res.on("error", cleanup);
    (res.req as Request).on?.("aborted", cleanup);
  }

  removeClient(userId: string, res: Response) {
    const set = this.clients.get(userId);
    if (set) {
      set.delete(res);
      if (set.size === 0) this.clients.delete(userId);
    }
    const interval = this.keepAliveIntervals.get(res);
    if (interval) clearInterval(interval);
    this.keepAliveIntervals.delete(res);
  }

  broadcast(userId: string, event: UploadEvent) {
    const client = this.clients.get(userId);
    if (!client) throw new Error("No client found for user");

    const data =
      `event: ${event.type}\n` + `data: ${JSON.stringify(event.payload)}\n\n`;
    for (const res of client) {
      res.write(data);
    }
  }
}

export const sseManager = new SSEManager();

export function setupSSEHeaders(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
}
