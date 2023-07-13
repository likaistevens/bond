import path from "path";
import fs from "fs-extra";
import { prettifyCode } from "../../../../utils";
import { Swagger, SwaggerPathMethodObject } from "../../../api/type";
import { resolveOperationId } from "../../../api/utils";
import {
  DATA_DIR_RELATIVE_PATH,
  MIDDLEWARE_RELATIVE_PATH,
  OperationIdHandleList,
  UTIL_RELATIVE_PATH,
} from "../const";
import chalk from "chalk";

export const writeMiddleWare = async ({
  mockedSwaggerPathsObj,
  mockPatternObj,
  // outputDataDir,
  outputServerDir,
  pathList,
  response,
}: {
  mockedSwaggerPathsObj: Swagger["paths"];
  mockPatternObj: Record<string, Record<string, any>>;
  // outputDataDir: string;
  outputServerDir: string;
  pathList: string[];
  response: string;
}) => {
  const mockDataImportStr = Object.entries(mockPatternObj)
    .map(([operationId]) =>
      genMockDataImport({
        operationId,
      })
    )
    .join("\n");

  const handleStr = Object.entries(mockedSwaggerPathsObj)
    .reduce((pre, next) => {
      const [path, methodBody] = next;
      const temp = Object.entries(methodBody).map(([method, body]) => {
        return {
          path,
          method,
          body,
        };
      });
      return [...pre, ...temp];
    }, [] as { path: string; method: string; body: SwaggerPathMethodObject }[])
    .filter((o) => pathList.includes(o.path))
    .map((o) => {
      const operationId = resolveOperationId(
        {
          basePath: "",
          origin: o.body.operationId,
          method: o.method,
          path: o.path,
        },
        { operationId: OperationIdHandleList }
      );
      return genHandleStr({
        operationId,
        method: o.method,
        path: o.path,
        response,
      });
    })
    .join("\n \n");

  const resWithMockData = `
    const { isMatch } = require("${UTIL_RELATIVE_PATH}");
    ${mockDataImportStr}

    module.exports = (req, res, next) => {
      ${handleStr}

      next();
    };
    `;

  await fs.writeFile(
    path.join(outputServerDir, MIDDLEWARE_RELATIVE_PATH),
    prettifyCode(resWithMockData)
  );
};

const getRoutePath = (path: string, queryParams?: string[]) => {
  const queryList = queryParams?.map((param) => `${param}=:${param}`);
  return queryList?.length ? `${path}?${queryList.join("&")}` : `${path}`;
};

const genHandleStr = ({
  operationId,
  method,
  path,
  response,
}: {
  operationId: string;
  method: string;
  path: string;
  response: string;
}) => {
  const routePattern = getRoutePath(path);
  const needResponseWrapper = response && response.includes("$data");
  const responseData = needResponseWrapper
    ? response.replaceAll("$data", operationId)
    : operationId;

  if (response && !response.includes("$data")) {
    console.log(
      chalk.yellow(
        "mock.response must contain the $data symbol to indicate mock data"
      )
    );
  }

  return `if (req.method === "${method.toLocaleUpperCase()}" && isMatch("${routePattern}")(req.path)) {
      res.status(200).send(${responseData});
      return;
    }`;
};

const genMockDataImport = ({ operationId }: { operationId: string }) => {
  return `const ${operationId} = require("${DATA_DIR_RELATIVE_PATH}/${operationId}.js");`;
};
