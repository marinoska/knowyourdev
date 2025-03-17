import express, { Router } from 'express';
import { celebrate, errors } from 'celebrate';
// import { checkAuth0Token } from 'nftit/User/checkAuth0Token.middlware';
import { notFoundController } from './api/notFound.controller';
import {
    documentUploadController,
    documentUploadValidationSchema, FILE_MULTIPART_PARAM,
    upload
} from "@/routes/api/document/upload.controller";
import { getUploadsListController, getUploadsListValidationSchema } from "@/routes/api/document/list.controller";
import { getTechProfileController, getTechProfileValidationSchema } from "@/routes/api/document/getProfile.controller";
// import { loadAuthenticatedUser } from 'nftit/User/loadAuthenticatedUser.middleware';

const validateOptions = {abortEarly: false};

const apiRouter: Router = express.Router();
// apiRouter.use(checkAuth0Token, loadAuthenticatedUser);

apiRouter.post('/document/upload', upload.single(FILE_MULTIPART_PARAM), celebrate(documentUploadValidationSchema, validateOptions), documentUploadController);
apiRouter.get('/document/uploads', celebrate(getUploadsListValidationSchema), getUploadsListController);
apiRouter.get('/document/uploads/:uploadId', celebrate(getTechProfileValidationSchema), getTechProfileController);

apiRouter.use(notFoundController);
apiRouter.use(errors());

export default apiRouter;
