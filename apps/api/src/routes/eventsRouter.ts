import express, { Router } from "express";
import { uploadsEventsController } from "@/routes/api/sse.controller.js";

const eventsRouter: Router = express.Router();

eventsRouter.get("/uploads", uploadsEventsController);

export default eventsRouter;
