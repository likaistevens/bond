import fs from "fs-extra";
import path from "path";
import * as OpenAPI from "openapi-typescript-codegen";
import dotenv from "dotenv";
import { fetchFiles, loadConfig, mergeSwagger, sleep } from "./utils";
import ora from "ora";

dotenv.config();

const cwd = process.cwd();

const bond = async () => {
  const { url, headers, output, request } = await loadConfig();

  try {
    fs.removeSync(path.resolve(cwd, output));
    const fetchSpinner = ora();
    fetchSpinner.start("正在从远端获取 swagger 文件");
    const bufList = await fetchFiles(url, { headers });
    await sleep(2000);
    fetchSpinner.succeed("获取 swagger 文件成功 !");

    const mergeSpinner = ora();
    const swaggerFilePaths = bufList.map((_, i) =>
      path.resolve(cwd, `./temp_${i}.json`)
    );
    await Promise.all(
      bufList.map((b, i) => fs.writeFile(swaggerFilePaths[i], b))
    );
    const swaggerPath = "./swagger.json";
    // TODO 校验是否可以合并
    const finalSwagger = await mergeSwagger(swaggerFilePaths);
    fs.writeFileSync(
      path.resolve(cwd, swaggerPath),
      JSON.stringify(finalSwagger)
    );
    swaggerFilePaths.forEach((path) => fs.unlink(path, () => {}));
    mergeSpinner.succeed("合并 swagger 文件成功 !");
    const generateSpinner = ora();
    generateSpinner.start("正在生成接口文件");
    await OpenAPI.generate({
      input: swaggerPath,
      output: output,
      request,
    });
    await sleep(1000);
    // ---------- 替换 request ，CancelablePromise
    const servicesDir = path.resolve(cwd, output, "./services");
    const files = await fs.readdir(servicesDir);
    const paths = files.map((file) => path.resolve(servicesDir, file));
    const bufferList = await fetchFiles(paths);
    const newBufferList = bufferList.map((b) => {
      const oldString = b.toString("utf-8");
      const newString = oldString
        // .replace(
        //   `import { request as __request } from '../core/request';`,
        //   `import { request as __request } from '${request}';`
        // )
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
