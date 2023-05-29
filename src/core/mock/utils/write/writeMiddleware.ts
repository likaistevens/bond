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

export const writeMiddleWare = async ({
  mockedSwaggerPathsObj,
  mockPatternObj,
  // outputDataDir,
  outputServerDir,
  pathList,
}: {
  mockedSwaggerPathsObj: Swagger["paths"];
  mockPatternObj: Record<string, Record<string, any>>;
  // outputDataDir: string;
  outputServerDir: string;
  pathList: string[];
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
}: {
  operationId: string;
  method: string;
  path: string;
}) => {
  const routePattern = getRoutePath(path);

  return `if (req.method === "${method.toLocaleUpperCase()}" && isMatch("${routePattern}")(req.path)) {
      res.status(200).send(${operationId});
      return;
    }`;
};

const genMockDataImport = ({ operationId }: { operationId: string }) => {
  return `const ${operationId} = require("${DATA_DIR_RELATIVE_PATH}/${operationId}.js");`;
};
