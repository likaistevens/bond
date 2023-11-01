import fs from "fs-extra";
import path from "path";
import { fetchFiles } from "./utils";
import { prettifyCode } from "../../utils";
import { BondConfig } from "../../../__type__";
import { isEmpty } from "lodash";
import { writeRequest } from "../mock/utils/write";
import child_process from "child_process";
import { DEFAULT_MOCK_SERVER_PORT } from "../mock/utils/const";

const cwd = process.cwd();

export const handleApiFiles = async ({
  output,
  request,
  mock,
}: {
  output: string;
  request: string;
  mock: BondConfig["mock"];
}) => {
  await removeCancelablePromise(output);

  replaceRequestFile({ output, request, mock });

  await removeHttpProtocol(output);

  formatAllFile(output);
};

/**
 * 移除 CancelablePromise 暂时不接入
 */
const removeCancelablePromise = async (output: string) => {
  const servicesDir = path.resolve(cwd, output, "./services");
  const files = await fs.readdir(servicesDir);
  const paths = files.map((file) => path.resolve(servicesDir, file));
  const bufferList = await fetchFiles(paths);
  const newBufferList = bufferList.map((b) => {
    const oldString = b.toString("utf-8");
    const newString = oldString
      .replaceAll(
        `import type { CancelablePromise } from '../core/CancelablePromise';\n`,
        ""
      )
      .replaceAll(`CancelablePromise`, "Promise");
    return Buffer.from(newString);
  });
  await Promise.all([
    ...newBufferList.map((data, i) => {
      fs.writeFile(paths[i], data);
    }),
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    }), // TODO: 这个地方写入，然后立即读取，会拿不到文件内容， 很奇怪
  ]);
};

/**
 * codegen 会将 request 路径的 request.ts 文件拷贝到 api 目录下。
 * 已知在 umi 项目中使用 umi-request 时，项目调用多个 request 会出现错误，具体原因待研究。 TODO
 * 因此采用 export 的方式，直接使用项目中已有的 request
 * */
const replaceRequestFile = ({
  output,
  request,
  mock,
}: {
  output: string;
  request: string;
  mock: BondConfig["mock"];
}) => {
  const requestAbs = path.resolve(cwd, request || "");
  const exportPath = path.relative(
    path.resolve(cwd, output, "./core"),
    requestAbs
  );

  if (!isEmpty(mock?.input) && !isEmpty(mock?.pathList)) {
    writeRequest({
      port: mock?.port || DEFAULT_MOCK_SERVER_PORT,
      output,
      request,
    });
  } else {
    // TODO: 通用方法去除文件后缀
    fs.writeFileSync(
      path.resolve(cwd, output, "./core/request.ts"),
      prettifyCode(`
        export * from "${exportPath.replace(".ts", "")}";
      `)
    );
  }
};

/**
 * 移除 OpenAPI 配置 url 中的协议部分，自动采用当前项目协议
 */
const removeHttpProtocol = (output: string) => {
  const OpenAPIPath = path.resolve(cwd, output, "./core/OpenAPI.ts");
  const oldString = fs.readFileSync(OpenAPIPath, { encoding: "utf-8" });
  fs.writeFileSync(
    OpenAPIPath,
    oldString.replaceAll("http:", "").replaceAll("https:", "")
  );
};

const formatAllFile = (output: string) => {
  try {
    child_process.execSync(`yarn prettier ${output} --write`);
  } catch (e) {
    console.log("Format Error \n", e);
  }
};
