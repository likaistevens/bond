import swaggerParserMock from "swagger-parser-mock";
import fs from "fs-extra";
// import Mock from "mockjs";
import { loadMockConfig } from "./utils/loadMockConfig";
import { Swagger } from "../api/type";
import { resolveOperationId } from "../api/utils";
// import { prettifyCode } from "../../utils";
import { startServer } from "./server";
import path from "path";
// import { writeDB } from "./utils/write/writeDB";
import {
  MOCK_RES_CODE,
  OperationIdHandleList,
  UTIL_RELATIVE_PATH,
} from "./utils/const";
import {
  writeData,
  writeMiddleWare,
  writeRequest,
  writeUtils,
} from "./utils/write";

const cwd = process.cwd();

/** 生成 mock 相关的代码 */
export const mockGen = async () => {
  const { mock, output, request } = await loadMockConfig();
  if (!mock) {
    return;
  }
  const mockOutPutDir = mock.outputDir;
  const mockInput = mock.input;
  const outputDataDir = path.resolve(cwd, mockOutPutDir, "data");
  const outputServerDir = path.resolve(cwd, mockOutPutDir, "server");
  fs.ensureDirSync(outputDataDir);
  fs.ensureDirSync(outputServerDir);

  const swaggerObjList = await Promise.all(
    mockInput.map((p) => fs.readJson(path.join(cwd, p)))
  );

  // swagger-client 不支持本地路径。可使用 spec 字段手动传入。
  // https://github.com/swagger-api/swagger-js/issues/2703
  const mockedSwaggerList = await Promise.all(
    swaggerObjList.map((s) => swaggerParserMock({ spec: s }))
  );

  // 合并所有 mockedSwagger 中的 paths，都已包含 example
  const mockedSwaggerPathsObj = mockedSwaggerList.reduce((pre, next) => {
    return { ...pre, ...next.paths };
  }, {}) as Swagger["paths"];

  const mockPatternObj: Record<string, Record<string, any>> = {};
  Object.entries(mockedSwaggerPathsObj).forEach(([path, methodBody]) => {
    Object.entries(methodBody).forEach(([method, body]) => {
      const key = resolveOperationId(
        {
          basePath: "",
          origin: body.operationId,
          method,
          path,
        },
        { operationId: OperationIdHandleList }
      );
      try {
        if (mock.pathList.includes(path)) {
          const exampleStr = body.responses[MOCK_RES_CODE].example;
          if (exampleStr) {
            mockPatternObj[key] = JSON.parse(exampleStr);
          }
        }
      } catch {}
    });
  });

  await Promise.all([
    writeData({ mockPatternObj, outputDataDir }),
    // writeDB(outputServerDir),
    writeUtils(path.join(outputServerDir, UTIL_RELATIVE_PATH)),
    writeRequest({ output, request, port: mock.port }),
    writeMiddleWare({
      mockedSwaggerPathsObj,
      mockPatternObj,
      // outputDataDir,
      outputServerDir,
      pathList: mock.pathList,
    }),
  ]);
};

/** 启动 mock 服务 */
export const mockServer = async () => {
  const { mock } = await loadMockConfig();
  if (!mock) {
    return;
  }
  startServer(mock);
};

export const mock = async () => {
  await Promise.all([mockGen, mockServer]);
};

export default mock;
