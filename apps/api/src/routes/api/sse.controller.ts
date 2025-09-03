import type { Request, Response, RequestHandler } from "express";
import { sseManager, setupSSEHeaders } from "@/services/sse.service.js";

export const uploadsEventsController: RequestHandler = (
  req: Request,
  res: Response,
) => {
  if (!req.auth?.payload.sub) {
    throw new Error("Authentication required");
  }
  const userId = req.auth.payload.sub;

  setupSSEHeaders(req, res);

  res.write("retry: 10000\n\n");

  sseManager.addClient(userId, res);
};
