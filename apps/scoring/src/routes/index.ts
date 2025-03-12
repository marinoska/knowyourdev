import apiRouter from './apiRouter.ts';
// import publicRouter from './publicRouter';
import { notFoundController } from './api/notFound.controller.ts';

export default {
    // publicRouter,
    apiRouter,
    notFound: notFoundController
};
