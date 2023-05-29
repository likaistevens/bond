import express from "express";
import fs from "fs-extra";
import { BondConfig } from "../../../__type__";
import path from "path";
import { prettifyCode } from "../../utils";
import chalk from "chalk";
import { IncomingMessage, ServerResponse } from "http";
import proxy from "express-http-proxy";
import cors from "cors";

export const startServer = async (config: BondConfig["mock"]) => {
  if (!config) {
    return;
  }

  const cwd = process.cwd();
  const { port = 8001 } = config;

  const middleware = require(path.join(
    cwd,
    config?.outputDir || "",
    "server",
    "middleware.js"
  ));

  const server = express();

  // server.use(
  //   proxy("apollo.study.youdao.com", {
  //     filter: function (req, res) {
  //       // console.log(req);
  //       return !(req.url && pathList.includes(req.url));
  //     },
  //   })
  // );

  server.use((req: IncomingMessage, res, next) => {
    const referer = req.headers.referer;
    const origin = new URL(referer || req.headers.host || "").origin;
    res.setHeader("Access-Control-Allow-Credentials", "true");
    cors({
      origin,
    })(req, res, next);
  });

  server.use(middleware);

  server.listen(port, () => {
    console.log(
      chalk.green(`
        Bond Mock Server is running...

        http://localhost:${port}
      `)
    );
  });
};
