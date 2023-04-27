import { BondConfig, Swagger, SwaggerPathMethodObject } from "../type";
import { update, set } from "lodash";

/** 将 swagger 中的 tags 的 name 和 description 交换，同时需要完成 paths[x].post.tags 中的替换 */
export const transferTags = (
  swaggers: Swagger[],
  customConfig?: BondConfig["customConfig"]
): Swagger[] => {
  return swaggers.map((swagger) => {
    const newTags: Swagger["tags"] = [];
    const tagName2DescMap: Record<string, string> = {};
    swagger.tags.forEach((tag) => {
      let trimDesc = tag.description.replaceAll(" ", "");

      if (customConfig?.removeController) {
        if (trimDesc.endsWith("Controller")) {
          trimDesc = trimDesc.replace(/Controller$/, "");
        }
      }

      tagName2DescMap[tag.name] = trimDesc;
      newTags.push({
        name: trimDesc,
        description: tag.name,
      });
    });
    set(swagger, "tags", newTags);

    Object.entries(swagger.paths).forEach(([path, body]) => {
      Object.entries(body).forEach(([method, param]) => {
        update(param, "tags", (tags: SwaggerPathMethodObject["tags"]) => {
          return tags.map((tag) => tagName2DescMap[tag]);
        });
      });
    });

    return swagger;
  });
};
