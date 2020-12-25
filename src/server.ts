import express from "express";
import { init } from "./index";
import config from "config";

async function startServer() {
  const app: express.Application = await init();
  const port = config.get("port") || 3000; //   Port number for server
  app.listen(port, () => {
    console.log("Server established at http://localhost:" + port);
  });
}

startServer();
