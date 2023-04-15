import fs from "fs";
import path from "path";
import * as OpenAPI from "openapi-typescript-codegen";
import dotenv from "dotenv";
import { fetchFiles, mergeSwagger } from "./utils";

dotenv.config();

const ENV = process.env;
const cwd = process.cwd();

const { cookie, input = "./swagger.json", output = "./", request } = ENV;

const config = {
  url: input,
  headers: {
    cookie: cookie || "",
  },
  input,
  output,
  request,
};

const writeSwagger = async (buf: Buffer, output?: string) => {
  return new Promise<string>((resolve, reject) => {
    const _output = output || "./swagger.json";
    fs.writeFile(_output, buf, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(_output);
      }
    });
  });
};

const run = async () => {
  try {
    const bufList = await fetchFiles(config.url, config);
    const swaggerFilePaths = await Promise.all(
      bufList.map((b, i) =>
        writeSwagger(b, path.resolve(cwd, `./temp_${i}.json`))
      )
    );
    // TODO 校验是否可以合并
    const finalSwagger = await mergeSwagger(swaggerFilePaths);
    fs.writeFileSync(
      path.resolve(cwd, "./swagger.json"),
      JSON.stringify(finalSwagger)
    );
    swaggerFilePaths.forEach((path) => fs.unlink(path, () => {}));
    const swaggerPath = "./swagger.json";
    OpenAPI.generate({
      input: swaggerPath,
      output: output,
      request,
    });
  } catch (e) {
    console.error(e);
  }
};
run();
export default run;
