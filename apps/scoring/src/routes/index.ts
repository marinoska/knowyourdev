import apiRouter from './apiRouter.js';
// import publicRouter from './publicRouter';
import { notFoundController } from './api/notFound.controller.js';

export default {
    // publicRouter,
    apiRouter,
    notFound: notFoundController
};
