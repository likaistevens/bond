import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { BondConfig } from "../../../../__type__/index";

const configFileExt = ["js", "cjs"];
const configFileName = "bond.config";

export const loadMockConfig = async (): Promise<BondConfig["mock"]> => {
  const cwd = process.cwd();

  const configPaths = configFileExt.map((ext) =>
    path.resolve(cwd, `${configFileName}.${ext}`)
  );
  const configPath = configPaths.find((p) => fs.existsSync(p));

  if (!configPath) {
    console.log(chalk.red(`找不到 ${configFileName} 配置文件`));
    process.exit();
  }

  // TODO: 支持 esmodule （mjs）
  const userConfig = (await import(configPath)).default;

  return userConfig.mock;
};
