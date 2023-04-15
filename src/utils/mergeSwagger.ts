import { Swagger } from "../type";
import { readJsonFiles } from "./readJsonFiles";

export const mergeSwagger = async (paths: string[]): Promise<Swagger> => {
  const swaggerList = await readJsonFiles(paths);
  const basePathList = swaggerList.map((s) => s.basePath);
  const finalSwagger = {
    swagger: swaggerList[0].swagger,
    info: swaggerList[0].info,
    host: swaggerList[0].host,
    basePath: "/",
    tags: swaggerList.reduce((pre, cur) => {
      return pre.concat(cur.tags);
    }, [] as string[]),
    paths: swaggerList.reduce((pre, cur, index) => {
      return Object.assign(
        pre,
        Object.fromEntries(
          Object.entries(cur.paths).map(([key, value]) => {
            return [basePathList[index] + key, value];
          })
        )
      );
    }, {}),
    securityDefinitions: swaggerList[0].securityDefinitions,
    definitions: swaggerList.reduce((pre, cur) => {
      return Object.assign(pre, cur.definitions);
    }, {}),
  };

  return finalSwagger;
};
