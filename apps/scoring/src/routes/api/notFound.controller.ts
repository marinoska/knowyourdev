import { NotFound } from '@/app/errors';
import { RequestHandler } from 'express';

export const notFoundController: RequestHandler = (_req, _res, next) => {
    next(new NotFound('route not found'));
};
