import 'dotenv/config';
import { env } from "@/app/env.js";
import https from 'node:https';
import fs from 'node:fs';

import logger from "@/app/logger.js";
import app from "@/app/express.js";
import { stopMongoClient } from "@/app/mongo.js";

const log = logger('Server');
const key = fs.readFileSync('./src/cert/key.pem');
const cert = fs.readFileSync('./src/cert/cert.pem');

const PORT = Number(env('PORT'));

const server = https.createServer({key, cert}, app);

server.listen(PORT, () => log.info(`⚡️ Server is running at https://localhost:${PORT}`));

const gracefulExit = () => {
    log.info('Server is running at http://localhost:${PORT} Application is being terminated');
    // If the Node process ends, close the Mongoose connection
    void stopMongoClient();
};

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

process.on('unhandledRejection', (reason, _promise) => {
    log.error(`Unhandled Rejection: `, reason);

    process.exit(1);
});

process.on('unhandledException', err => {
    log.error(`Unhandled exception: `, err);

    process.exit(1);
});
