import { camelCase, set, update } from "lodash";
import { BondConfig, Swagger } from "../type";
import { readJsonFiles } from "./readJsonFiles";

export const mergeSwagger = async (
  paths: string[] | Swagger[],
  mergeConfig?: BondConfig["mergeConfig"]
): Promise<Swagger[]> => {
  if (paths.length === 0) {
    return [] as Swagger[];
  }
  let swaggerList: Swagger[] = [];
  if (typeof paths[0] === "string") {
    swaggerList = await readJsonFiles(paths as string[]);
  } else {
    swaggerList = paths as Swagger[];
  }
  // 以 host 为 key 进行映射
  const host2SwaggerMap: Record<string, Swagger[]> = {};
  swaggerList.forEach((s) => {
    if (host2SwaggerMap[s.host]) {
      host2SwaggerMap[s.host].push(s);
    } else {
      host2SwaggerMap[s.host] = [s];
    }
  });
  // 每个元素都是 host 相同，进行聚合后的 swagger
  const mergedSwaggerList = Object.values(host2SwaggerMap).map((swaggerList) =>
    merge(swaggerList, mergeConfig)
  );
  return mergedSwaggerList;
};

const merge = (
  swaggerList: Swagger[],
  mergeConfig?: BondConfig["mergeConfig"]
): Swagger => {
  const basePathList = swaggerList.map((s) => s.basePath);
  const finalSwagger = {
    swagger: swaggerList[0].swagger,
    // TODO
    info: {
      description: swaggerList.map((s) => s.info.description).join(" & "),
      version: swaggerList.map((s) => s.info.version).join(" & "),
      title: swaggerList.map((s) => s.info.title).join(" & "),
      license: swaggerList[0].info.license,
    },
    host: swaggerList[0].host,
    basePath: "/",
    tags: swaggerList.reduce((pre, cur) => {
      return pre.concat(cur.tags);
    }, [] as Swagger["tags"]),
    paths: swaggerList.reduce((pre, cur, index) => {
      return Object.assign(
        pre,
        Object.fromEntries(
          Object.entries(cur.paths).map(([path, body]) => {
            const newPath = basePathList[index] + path;
            const newBody = { ...body };
            Object.entries(newBody).forEach(([method, params]) => {
              const operationId = params.operationId;
              const newOperationId = resolveOperationId(
                {
                  basePath: basePathList[index],
                  path,
                  method,
                  origin: operationId,
                },
                mergeConfig
              );
              set(params, "operationId", newOperationId);
            });
            return [newPath, newBody];
          })
        )
      );
    }, {}),
    // TODO
    securityDefinitions: swaggerList[0].securityDefinitions,
    definitions: swaggerList.reduce((pre, cur) => {
      return Object.assign(pre, cur.definitions);
    }, {}),
  };

  return finalSwagger;
};

const resolveOperationId = (
  params: {
    basePath: string;
    path: string;
    method: string;
    origin: string;
    [k: string]: string;
  },
  mergeConfig?: BondConfig["mergeConfig"]
) => {
  if (!mergeConfig?.operationId) {
    return params.origin;
  }
  const str = mergeConfig.operationId
    .map((patten) => {
      return params[patten] || patten;
    })
    .join("-");
  return camelCase(str);
};
