import express from "express";
import { getUserRouter } from "./users/user.router";

export function getApiRouter(): express.Router {
  const apiRouter = express.Router();
  const transactionRouter = getUserRouter();
  apiRouter.use("/transactions", transactionRouter);
  return apiRouter;
}
