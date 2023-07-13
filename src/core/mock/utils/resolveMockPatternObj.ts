import { Swagger } from "../../api/type";
import { resolveOperationId } from "../../api/utils";
import { MOCK_RES_CODE, OperationIdHandleList } from "./const";

export const resolveMockPatternObj = ({
  mockedSwaggerPathsObj,
  pathList,
}: {
  mockedSwaggerPathsObj: Swagger["paths"];
  pathList: string[];
}) => {
  const mockPatternObj: Record<string, Record<string, any>> = {};
  const operationId2Path: Record<string, any> = {};

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
      operationId2Path[key] = path;
      try {
        if (pathList.includes(path)) {
          const exampleStr = body.responses[MOCK_RES_CODE].example;
          if (exampleStr) {
            mockPatternObj[key] = JSON.parse(exampleStr);
          }
        }
      } catch {}
    });
  });
  return { mockPatternObj, operationId2Path };
};
