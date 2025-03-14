import apiRouter from './apiRouter';
// import publicRouter from './publicRouter';
import { notFoundController } from './api/notFound.controller';

export default {
    // publicRouter,
    apiRouter,
    notFound: notFoundController
};
