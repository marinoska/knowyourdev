import express, { Router } from "express";
import { celebrate, errors } from "celebrate";
// import { checkAuth0Token } from 'nftit/User/checkAuth0Token.middlware';
import { notFoundController } from "./api/notFound.controller.js";
import {
  documentUploadController,
  documentUploadValidationSchema,
} from "@/routes/api/document/upload.controller.js";
import { r2Upload } from "@/middleware/r2Upload.middleware.js";
import {
  getUploadsListController,
  getUploadsListValidationSchema,
} from "@/routes/api/document/list.controller.js";
import {
  getUploadTechProfileController,
  getTechProfileValidationSchema,
} from "@/routes/api/document/getProfile.controller.js";
// import { loadAuthenticatedUser } from 'nftit/User/loadAuthenticatedUser.middleware';

const validateOptions = { abortEarly: false };

const apiRouter: Router = express.Router();
// apiRouter.use(checkAuth0Token, loadAuthenticatedUser);

apiRouter.post(
  "/document/upload",
  r2Upload,
  celebrate(documentUploadValidationSchema, validateOptions),
  documentUploadController,
);
apiRouter.get(
  "/document/uploads",
  celebrate(getUploadsListValidationSchema),
  getUploadsListController,
);
apiRouter.get(
  "/document/uploads/:uploadId",
  celebrate(getTechProfileValidationSchema),
  getUploadTechProfileController,
);

apiRouter.use(notFoundController);
apiRouter.use(errors());

export default apiRouter;
