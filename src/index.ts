import fs from "fs-extra";
import path from "path";
import * as OpenAPI from "openapi-typescript-codegen";
import dotenv from "dotenv";
import {
  fetchFiles,
  loadConfig,
  mergeSwagger,
  readJsonFiles,
  transferTags,
  validateSwaggers,
} from "./utils";
import ora from "ora";
import chalk from "chalk";

dotenv.config();

const cwd = process.cwd();

const bond = async () => {
  try {
    // 读取配置文件
    const { input, headers, output, request, mergeConfig, customConfig } =
      await loadConfig();

    // course-manager 的 swagger 配置有问题，需要后端下次开发时修改
    if (input.find((x) => x.includes("course-manager/v2/api-docs"))) {
      console.log(chalk.red(`course-manager 暂不支持，请联系管理员`));
      process.exit();
    }

    // 删除旧的输出文件夹
    fs.removeSync(path.resolve(cwd, output));

    // 读取所有 swagger 文件
    const fetchSpinner = ora();
    fetchSpinner.start("正在获取 swagger 文件");
    const bufList = await fetchFiles(input, { headers });
    fetchSpinner.succeed("获取 swagger 文件成功 !");

    // 合并 swagger 文件
    const mergeSpinner = ora();
    const tempSwaggerFilePaths = bufList.map((_, i) =>
      path.resolve(cwd, `./temp_${i}.json`)
    );
    await Promise.all(
      bufList.map((b, i) => fs.writeFile(tempSwaggerFilePaths[i], b))
    );
    const originSwaggers = await readJsonFiles(tempSwaggerFilePaths);
    const validateOriginSwaggers = validateSwaggers(originSwaggers);
    const swaggers = transferTags([...validateOriginSwaggers], customConfig);
    const mergedSwaggerList = await mergeSwagger(swaggers, mergeConfig);
    const swaggerPaths =
      mergedSwaggerList.length > 1
        ? mergedSwaggerList.map((_, i) =>
            path.resolve(cwd, `./swagger_${i}.json`)
          )
        : [path.resolve(cwd, `./swagger.json`)];
    await Promise.all(
      mergedSwaggerList.map((s, i) =>
        fs.writeFile(swaggerPaths[i], JSON.stringify(s))
      )
    );
    tempSwaggerFilePaths.forEach((path) => fs.unlink(path, () => {}));
    mergeSpinner.succeed("合并 swagger 文件成功 !");

    // 生成接口文件
    const generateSpinner = ora();
    generateSpinner.start("正在生成接口文件");
    await Promise.all(
      swaggerPaths.map((p, i) =>
        OpenAPI.generate({
          input: p,
          // output: path.resolve(cwd, output, `./${i}`),
          output: path.resolve(cwd, output),
          request,
        })
      )
    );

    // ---------- 替换 request ，CancelablePromise
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
    await Promise.all(
      newBufferList.map((data, i) => {
        fs.writeFile(paths[i], data);
      })
    );
    // TODO: 通用方法去除文件后缀
    const requestAbs = path.resolve(cwd, request || "");
    const exportPath = path.relative(
      path.resolve(cwd, output, "./core"),
      requestAbs
    );
    fs.writeFileSync(
      path.resolve(cwd, output, "./core/request.ts"),
      `export * from "${exportPath.replace(".ts", "")}";`
    );
    // ---------------------------------------------
    // // ---------- 删除 request 文件
    // fs.unlink(path.resolve(cwd, output, "./core/request.ts"));
    // ---------------------------------------------
    // -------------------- 去除协议 -------------------------
    const OpenAPIPath = path.resolve(cwd, output, "./core/OpenAPI.ts");
    const oldString = fs.readFileSync(OpenAPIPath, { encoding: "utf-8" });
    fs.writeFileSync(
      OpenAPIPath,
      oldString.replaceAll("http:", "").replaceAll("https:", "")
    );
    generateSpinner.succeed(`接口文件生成成功 ${path.resolve(cwd, output)}`);
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
};

export default bond;
