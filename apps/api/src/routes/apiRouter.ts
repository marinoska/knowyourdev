import express, { Router } from "express";
import { celebrate, errors } from "celebrate";
// import { checkAuth0Token } from 'nftit/User/checkAuth0Token.middlware';
import { notFoundController } from "./api/notFound.controller.js";
import {
  documentUploadController,
  documentUploadValidationSchema,
} from "@/routes/api/upload.controller.js";
import { r2Upload } from "@/middleware/r2Upload.middleware.js";
import {
  FILE_MULTIPART_PARAM,
  uploadFile,
} from "@/middleware/uploadFile.middleware.js";
import {
  getUploadsListController,
  getUploadsListValidationSchema,
} from "@/routes/api/getUploads.controller.js";
import {
  getResumeProfileController,
  getResumeProfileValidationSchema,
} from "@/routes/api/getProfile.controller.js";
import {
  getProjectsController,
  getProjectsListValidationSchema,
} from "@/routes/api/getProjects.controller.js";
import {
  getProjectController,
  getProjectValidationSchema,
} from "@/routes/api/getProject.controller.js";
import {
  updateProjectController,
  updateProjectValidationSchema,
} from "@/routes/api/updateProject.controller.js";
import {
  createProjectController,
  createProjectValidationSchema,
} from "@/routes/api/createProject.controller.js";
import {
  deleteProjectController,
  deleteProjectValidationSchema,
} from "@/routes/api/deleteProject.controller.js";
import {
  extractProjectDataController,
  extractJobDataValidationSchema,
} from "@/routes/api/extractProjectData.controller.js";
// import { loadAuthenticatedUser } from 'nftit/User/loadAuthenticatedUser.middleware';

const validateOptions = { abortEarly: false };

const apiRouter: Router = express.Router();
// apiRouter.use(checkAuth0Token, loadAuthenticatedUser);

apiRouter.post(
  "/document/upload",
  celebrate(documentUploadValidationSchema, validateOptions),
  uploadFile.single(FILE_MULTIPART_PARAM),
  r2Upload,
  documentUploadController,
);
apiRouter.get(
  "/document/uploads",
  celebrate(getUploadsListValidationSchema),
  getUploadsListController,
);
apiRouter.get(
  "/resume/profile/:uploadId",
  celebrate(getResumeProfileValidationSchema),
  getResumeProfileController,
);
apiRouter.get(
  "/projects",
  celebrate(getProjectsListValidationSchema),
  getProjectsController,
);
apiRouter.get(
  "/projects/:projectId",
  celebrate(getProjectValidationSchema),
  getProjectController,
);
apiRouter.post(
  "/projects",
  celebrate(createProjectValidationSchema, validateOptions),
  createProjectController,
);
apiRouter.patch(
  "/projects/:projectId",
  celebrate(updateProjectValidationSchema),
  updateProjectController,
);
apiRouter.delete(
  "/projects/:projectId",
  celebrate(deleteProjectValidationSchema),
  deleteProjectController,
);
apiRouter.post(
  "/projects/extract-job-data",
  celebrate(extractJobDataValidationSchema, validateOptions),
  extractProjectDataController,
);

apiRouter.use(notFoundController);
apiRouter.use(errors());

export default apiRouter;
