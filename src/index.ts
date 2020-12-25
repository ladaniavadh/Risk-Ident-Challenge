import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import compression from "compression";
import { getApiRouter } from "./router";
import config from "config";

export async function init() {
  const app: express.Application = express();
  const port = config.get("port") || 3000; //   Port number for server

  app.set("port", port);
  app.use(bodyParser.json());
  app.use(compression({ threshold: 1 }));
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    res.locals.requestTime = new Date().getTime();
    next();
  });

  app.use("/api", getApiRouter());

  return app;
}
