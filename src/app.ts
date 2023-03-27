import * as fs from "fs";
import * as http from "http";
import * as OpenAPI from "openapi-typescript-codegen";

const config = {
  url: "http://apollo-admin.study.youdao.com/course-service/v2/api-docs",
  headers: {
    cookie:
      "DICT_PERS=v2|urscookie||DICT||web||-1||1679881751634||115.236.119.138||shdtest@163.com||TFh4OGRMpBRkEk4klhLk50wFP4OGk4TK0OfPLT46MYWROfk4UMRLqB0klhLlWk4kWRUMnf6ukMJBRpZhLPLOLwK0;",
  },
};

const fetchSwagger: (
  url: string,
  options: http.RequestOptions
) => Promise<Buffer> = async (url, options) => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    console.log(http, http.request);
    const request = http.request(url, options, (res) => {
      res.on("error", reject);
      res.on("data", (chunk) => {
        chunks.push(chunk);
      });
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        resolve(buf);
      });
    });
    request.end();
  });
};

const writeSwagger = async (buf: Buffer, output?: string) => {
  return new Promise((resolve, reject) => {
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

const generateAPI = (input?: string, output?: string) => {
  OpenAPI.generate({
    //   input: "./LIKAISTEVENS_1-Test-1.0.0-resolved.json",
    input: input || "./swagger.json",
    output: output || "./api",
    // request: "./hub/request.js",
  });
};

const run = async () => {
  const buf = await fetchSwagger(config.url, config);
  await writeSwagger(buf);
  await generateAPI();
};

run();
