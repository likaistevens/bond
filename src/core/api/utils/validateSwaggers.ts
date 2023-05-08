import { Swagger } from "../type";
import chalk from "chalk";

export const validateSwaggers = (swaggers: Swagger[]) => {
  const properties = [
    "swagger",
    "info",
    "host",
    "basePath",
    "tags",
    "paths",
    // "securityDefinitions",
    // "definitions",
  ];
  return swaggers.filter((swagger) => {
    const valid = properties.every((prop) =>
      Object.keys(swagger).includes(prop)
    );
    if (valid) {
      return true;
    } else {
      console.log(
        chalk.red(`检测到无效 swagger 已被过滤，${JSON.stringify(swagger)}`)
      );
      return false;
    }
  });
};
