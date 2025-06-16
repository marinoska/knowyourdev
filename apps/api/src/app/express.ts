import express, { ErrorRequestHandler } from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import logger from "./logger.js";
import { normalizeError } from "./errors.js";
import cors from "cors";
import routes from "@/routes/index.js";
// Init Mongo connection
import "./mongo.js";
import { globals } from "./globals.js";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import { env } from "@/app/env.js";

const log = logger("Application");
void globals.init();

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  const error = normalizeError(err);
  const statusCode = error.status();

  if (statusCode >= 400 && statusCode < 500) {
    log.debug(`Client error while handling ${req.url}:`, error.log());
  } else {
    log.error(`Exception while handling ${req.url}:`, error.log());
  }

  res.status(statusCode).json(error.json());
};

const app = express();

const checkJwt = auth({
  audience: env("AUTH0_API_AUDIENCE"),
  issuerBaseURL: env("AUTH0_API_ISSUER"),
  tokenSigningAlg: "RS256",
});

app.use(cors({ origin: env("ALLOWED_ORIGIN"), credentials: true }));

app.use(checkJwt);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", routes.apiRouter);
// app.use('/', routes.publicRouter);
app.use(errorHandler);

export default app;
