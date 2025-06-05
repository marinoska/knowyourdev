import "dotenv/config";
import { env } from "@/app/env.js";
import fs from "node:fs";

import logger from "@/app/logger.js";
import app from "@/app/express.js";
import { stopMongoClient } from "@/app/mongo.js";

const log = logger("Server");

const PORT = Number(env("PORT"));
const useHttps = env("SCHEME") === "https";

const server = await (async () => {
    if (useHttps) {
        log.info("🔒 HTTPS enabled");
        const https = await import("node:https"); // Dynamic import for `https`
        const key = fs.readFileSync("./src/cert/key.pem");
        const cert = fs.readFileSync("./src/cert/cert.pem");
        return https.createServer({key, cert}, app);
    } else {
        log.info("🌐 Using HTTP");
        const http = await import("node:http"); // Dynamic import for `http`
        return http.createServer(app);
    }
})();

server.listen(PORT, () =>
    log.info(`⚡️ Server is running at https://localhost:${PORT}`),
);

const gracefulExit = () => {
    log.info(
        "Server is running at http://localhost:${PORT} Application is being terminated",
    );
    // If the Node process ends, close the Mongoose connection
    void stopMongoClient();
};

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

process.on("unhandledRejection", (reason, _promise) => {
    log.error(`Unhandled Rejection: `, reason);

    process.exit(1);
});

process.on("unhandledException", (err) => {
    log.error(`Unhandled exception: `, err);

    process.exit(1);
});
