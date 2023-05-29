import fs from "fs-extra";
import path from "path";
import * as OpenAPI from "openapi-typescript-codegen";
import dotenv from "dotenv";
import { fetchFiles, loadConfig } from "./utils";
import ora from "ora";
import { genMergedSwaggers } from "./genMergedSwaggers";
import { handleApiFiles } from "./handleApiFiles";

dotenv.config();

const cwd = process.cwd();

export const bond = async () => {
  try {
    // 读取配置文件
    const {
      input,
      headers,
      output,
      request,
      postfix,
      mergeConfig,
      customConfig,
      mock,
    } = await loadConfig();

    // 删除旧的输出文件夹
    fs.removeSync(path.resolve(cwd, output));

    // 读取所有 swagger 文件
    const fetchSpinner = ora().start("正在获取 swagger 文件");
    const bufList = await fetchFiles(input, { headers });
    fetchSpinner.succeed("获取 swagger 文件成功 !");

    // 将读取到的 swagger 文件进行合并，并写入项目当前目录
    const swaggerPaths = await genMergedSwaggers({
      bufList,
      customConfig,
      mergeConfig,
    });

    // 生成接口文件
    const generateSpinner = ora().start("正在生成接口文件");
    await Promise.all(
      swaggerPaths.map((p, i) =>
        OpenAPI.generate({
          input: p,
          // output: path.resolve(cwd, output, `./${i}`),
          output: path.resolve(cwd, output),
          request,
          postfix,
        })
      )
    );

    // 继续处理生成后的文件
    await handleApiFiles({ output, request, mock });
    generateSpinner.succeed(`接口文件生成成功 ${path.resolve(cwd, output)}`);
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
};

export default bond;
