import path from "path";
import fs from "fs-extra";
import { prettifyCode } from "../../../../utils";
import {
  CONFIG_FILE_NAME,
  DEFAULT_MOCK_SERVER_HOST,
  DEFAULT_MOCK_SERVER_PROTOCOL,
  OPENAPI_RELATIVE_PATH,
} from "../const";

const cwd = process.cwd();

export const writeRequest = ({
  port,
  output,
  request,
}: {
  port: number;
  output: string;
  request: string;
}) => {
  const requestAbs = path.resolve(cwd, request || "");
  const requestExportPath = path.relative(
    path.resolve(cwd, output, "./core"),
    requestAbs
  );

  const requestOutputDirPath = path.resolve(cwd, output, "./core");
  const requestOutputPath = path.resolve(requestOutputDirPath, "request.ts");
  const configRelativePath = path.relative(
    requestOutputDirPath,
    path.resolve(cwd, `./${CONFIG_FILE_NAME}`)
  );

  const mockServerHost = `${DEFAULT_MOCK_SERVER_PROTOCOL}//${DEFAULT_MOCK_SERVER_HOST}:${port}`;

  const requestFileStr = `
        import config from '${configRelativePath}';
        import { request as _request } from '${requestExportPath.replace(
          ".ts",
          ""
        )}';
        import { OpenAPIConfig } from '${OPENAPI_RELATIVE_PATH}';
        
        export const request = async (OpenAPI: OpenAPIConfig, options: any) => {
          const pathList: string[] = config?.mock?.pathList || [];
          const isDev = process.env.NODE_ENV === 'development';
          if (pathList.length && isDev) {
            const url = options?.url || '';
            const isMock = pathList.includes(url);
            if (isMock) {
              return _request({ ...OpenAPI, BASE: '${mockServerHost}' }, options);
            }
          } 
          return _request(OpenAPI, options);
    };
    `;

  // TODO: 通用方法去除文件后缀
  fs.writeFileSync(requestOutputPath, prettifyCode(requestFileStr));
};
