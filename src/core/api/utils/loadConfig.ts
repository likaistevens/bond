import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { BondConfig } from "../../../../__type__";
import os from "os";

const isWindows = os.type().toLowerCase().includes("windows");
const configFileExt = ["js", "cjs"];
const configFileName = "bond.config";

export const loadConfig = async (): Promise<BondConfig> => {
  const cwd = process.cwd();

  const configPaths = configFileExt.map((ext) =>
    path.resolve(cwd, `${configFileName}.${ext}`)
  );
  const configPath = configPaths.find((p) => fs.existsSync(p));

  if (!configPath) {
    console.log(chalk.red(`找不到 ${configFileName} 配置文件`));
    process.exit();
  }

  const urls: string[] = [];
  // TODO: 支持 esmodule （mjs）
  const userConfig = (
    await import(isWindows ? "file:\\" + configPath : configPath)
  ).default;
  const { cookie, input = "./swagger.json", output = "./api" } = userConfig;

  if (Array.isArray(input)) {
    urls.push(...input);
  } else {
    if (input.includes(";")) {
      urls.push(...input.split(";"));
    } else if (!!input) {
      urls.push(input);
    }
  }

  const config = {
    ...userConfig,
    input: urls,
    output,
    headers: {
      cookie: cookie || "",
    },
  };

  validateConfig(config);

  return config;
};

const validateConfig = (config: BondConfig) => {
  const { input, postfix, customConfig } = config;

  if (input.length === 0) {
    console.log(chalk.red(`缺少 swagger 文件路径`));
    process.exit();
  }

  if (typeof postfix !== "undefined" && !postfix) {
    if (customConfig?.servicesDimension === "all") {
      console.log(
        chalk.red(
          `customConfig.servicesDimension 为 all 时， postfix 不允许为空字符串`
        )
      );
      process.exit();
    }

    if (customConfig?.servicesDimension !== "service") {
      console.log(
        chalk.yellow(
          `postfix 为空字符串时，请校验 tags 的 name 不可为全中文。 否则 Service 文件名可能为空`
        )
      );
    }
  }

  // TODO: course-manager 的 swagger 配置有问题，需要后端下次开发时修改
  // if (input.find((x) => x.includes("course-manager/v2/api-docs"))) {
  //   console.log(chalk.red(`course-manager 暂不支持，请联系管理员`));
  //   process.exit();
  // }
};
