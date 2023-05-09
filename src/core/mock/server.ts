import jsonServer from "json-server";
import fs from "fs-extra";
import { BondConfig } from "../../../__type__";
import path from "path";
import { prettifyCode } from "../../utils";
import chalk from "chalk";

export const startServer = async (config: BondConfig["mock"]) => {
  if (!config) {
    return;
  }

  const cwd = process.cwd();
  const defaultDbPath = path.join(
    cwd,
    config?.outputDir || "",
    "server",
    "db.json"
  );

  // const defaultMiddlewaresPath = path.join(cwd,config?.outputDir||'','db.json')
  const { db = defaultDbPath, port = 8001 } = config;
  const server = jsonServer.create();
  const router = jsonServer.router(db);
  const defaultMiddleware = jsonServer.defaults();
  const middleware = require(path.join(
    cwd,
    config?.outputDir || "",
    "server",
    "middleware.js"
  ));

  server.use(defaultMiddleware);
  server.use(middleware);
  server.use(router);

  server.listen(port, () => {
    console.log(
      chalk.green(`
    Bond Mock Server is running...

    http://localhost:${port}
  `)
    );
  });
};
