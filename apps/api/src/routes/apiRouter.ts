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
} from "@/routes/api/list.controller.js";
import {
  getResumeProfileController,
  getResumeProfileValidationSchema,
} from "@/routes/api/getProfile.controller.js";
import {
  getProjectsListController,
  getProjectsListValidationSchema,
} from "@/routes/api/projects.controller.js";
import {
  getProjectController,
  getProjectValidationSchema,
} from "@/routes/api/getProject.controller.js";
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
  getProjectsListController,
);
apiRouter.get(
  "/projects/:projectId",
  celebrate(getProjectValidationSchema),
  getProjectController,
);

apiRouter.use(notFoundController);
apiRouter.use(errors());

export default apiRouter;
