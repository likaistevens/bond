import fs from "fs-extra";
import path from "path";
import {
  mergeSwagger,
  readJsonFiles,
  transferTags,
  validateSwaggers,
} from "./utils";
import ora from "ora";
import { BondConfig } from "../../../__type__";

const cwd = process.cwd();

export const genMergedSwaggers = async ({
  bufList,
  customConfig,
  mergeConfig,
}: {
  bufList: Buffer[];
  customConfig: BondConfig["customConfig"];
  mergeConfig: BondConfig["mergeConfig"];
}) => {
  const mergeSpinner = ora().start("正在合并 swagger 文件");
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

  return swaggerPaths;
};
