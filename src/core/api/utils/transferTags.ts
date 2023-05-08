import { BondConfig, Swagger, SwaggerPathMethodObject } from "../type";
import { update, set, camelCase, upperFirst } from "lodash";

/** 将 swagger 中的 tags 的 name 和 description 交换，同时需要完成 paths[x].post.tags 中的替换 */
export const transferTags = (
  swaggers: Swagger[],
  customConfig?: BondConfig["customConfig"]
): Swagger[] => {
  return [...swaggers].map((swagger) => {
    if (
      customConfig?.servicesDimension === "service" ||
      customConfig?.servicesDimension === "all"
    ) {
      const baseService = upperFirst(camelCase(swagger.basePath));
      const newTags = [{ name: baseService, description: swagger.info.title }];
      set(swagger, "tags", newTags);

      Object.entries(swagger.paths).forEach(([path, body]) => {
        Object.entries(body).forEach(([method, param]) => {
          if (customConfig?.servicesDimension === "service") {
            set(param, "tags", [baseService]);
          } else if (customConfig?.servicesDimension === "all") {
            set(param, "tags", [""]);
          }
        });
      });
    } else {
      if (customConfig?.tagKey === "description") {
        const newTags: Swagger["tags"] = [];
        const tagName2DescMap: Record<string, string> = {};
        swagger.tags.forEach((tag) => {
          let newName = upperFirst(tag.description.replaceAll(" ", "")); // cn
          let newDesc = tag.name; // zh

          if (customConfig?.removeController) {
            if (newName.endsWith("Controller")) {
              newName = newName.replace(/Controller$/, "");
            }
          }

          tagName2DescMap[newDesc] = newName; // zh => cn
          newTags.push({
            name: newName, // en
            description: newDesc, // zh
          });
        });
        set(swagger, "tags", newTags);

        Object.entries(swagger.paths).forEach(([path, body]) => {
          Object.entries(body).forEach(([method, param]) => {
            update(param, "tags", (tags: SwaggerPathMethodObject["tags"]) => {
              return tags.map((tag) => tagName2DescMap[tag]); // zh => en
            });
          });
        });
      } else {
        if (customConfig?.removeController) {
          swagger.tags.forEach((tag) => {
            if (tag.name.endsWith("Controller")) {
              set(tag, "name", tag.name.replace(/Controller$/, ""));
            }
          });
        }
      }
    }

    return swagger;
  });
};
