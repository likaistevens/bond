import fs from "fs";
import http from "http";
import fetch, { RequestInit } from "node-fetch";
import * as OpenAPI from "openapi-typescript-codegen";
import dotenv from "dotenv";

dotenv.config();

const ENV = process.env;

const { cookie, input = "./swagger.json", output = "./", request } = ENV;

const isRemote = input?.startsWith("http");

const config = {
  url: input,
  headers: {
    cookie: cookie || "",
  },
  input,
  output,
  request,
};

const fetchSwagger: (
  url: string,
  options: RequestInit
) => Promise<Buffer> = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.arrayBuffer();
    return Buffer.from(data);
  } catch (e) {
    throw e;
  }
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

const generateAPI = (input: string, output: string) => {
  OpenAPI.generate({
    input,
    output,
    request,
  });
};

const run = async () => {
  if (isRemote) {
    try {
      const buf = await fetchSwagger(config.url, config);
      console.log(buf);
      const swaggerPath = await writeSwagger(buf);
      generateAPI(swaggerPath, output);
    } catch (e) {
      console.error(e);
    }
  } else {
    generateAPI(input, output);
  }
};

export default run;
