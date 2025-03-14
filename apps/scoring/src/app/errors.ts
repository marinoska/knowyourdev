/* eslint-disable max-classes-per-file */
import boom, { Boom } from '@hapi/boom';
import { isCelebrateError } from 'celebrate';
import logger from './logger';
import { MulterError } from "multer";

logger('Error handler');

export const ExternalServiceUnauthorizedStatusCode = 440;

export class HttpError extends Error {
    httpError: Boom;

    constructor(message: string, error: any) {
        super(message);
        // all unrecognized errors become internal 500
        // in production environment boom will not print out the carried message for 500
        if (boom.isBoom(error)) {
            this.httpError = error;
        } else if (isCelebrateError(error)) {
            // validation error
            this.httpError = boom.badRequest(error.message);
        } else if (error.name === 'UnauthorizedError') {
            // express-jwt error format
            // @ts-ignore
            const {code, message, status, stack, inner} = error;
            this.httpError = boom.unauthorized(`${code}: ${message}`);
        } else if (error instanceof MulterError) {
            // Multer-specific error handling
            switch (error.code) {
                case 'LIMIT_FILE_SIZE':
                    this.httpError = boom.entityTooLarge('Uploaded file size exceeds the allowed limit.');
                    break;
                case 'LIMIT_UNEXPECTED_FILE':
                    this.httpError = boom.badRequest('Too many files uploaded.');
                    break;
                default:
                    this.httpError = boom.badRequest('File upload failed.'); // Catch-all for other Multer errors
            }
        } else if (error instanceof Error) {
            this.httpError = boom.boomify(error, {statusCode: 500});
        } else {
            this.httpError = boom.internal(message);
        }
    }

    status() {
        return this.httpError.output.statusCode;
    }

    json() {
        return {...this.httpError.output.payload};
    }

    log() {
        return {
            ...this.httpError.output.payload,
            data: this.httpError.data,
            stack: this.httpError.stack,
            message: this.message
        };
    }
}

export class Forbidden extends HttpError {
    constructor(message: string, data: any) {
        super(message, boom.forbidden('Forbidden', data));
    }
}

export class Unauthorized extends HttpError {
    constructor(message: string) {
        super(message, boom.unauthorized('Can not authenticate user'));
    }
}

export class InvalidSignature extends HttpError {
    constructor(message: string) {
        super(message, boom.unauthorized('Invalid signature'));
    }
}

export class InvalidToken extends HttpError {
    constructor(message: string) {
        super(message, new Boom('Invalid token', {statusCode: ExternalServiceUnauthorizedStatusCode}));
    }
}

export class NotFound extends HttpError {
    constructor(message: string) {
        super(message, boom.notFound(message));
    }
}

export class DBError extends HttpError {
    constructor(message: string, data: any) {
        super(message, boom.internal(message, data));
    }
}

export class ValidationError extends HttpError {
    constructor(message: string, errors?: any) {
        super(message, boom.badRequest(errors ? JSON.stringify(errors) : message));
    }
}

export const normalizeError = (err: any) => {
    if (err instanceof HttpError) {
        return err;
    }

    // any unknown error gets becomes http error 500
    return new HttpError(err.message, err);
};
