import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { BondConfig } from "../type";

const configFileName = "bond.config.js";

export const loadConfig = async (): Promise<BondConfig> => {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, configFileName);

  const isConfigExist = fs.existsSync(configPath);

  if (!isConfigExist) {
    console.log(chalk.red(`找不到 ${configFileName} 配置文件`));
    process.exit();
  }

  const urls: string[] = [];
  const config = (await import(configPath)).default;
  const { cookie, input = "./swagger.json", output = "./api" } = config;

  if (Array.isArray(input)) {
    urls.push(...input);
  } else {
    if (input.includes(";")) {
      urls.push(...input.split(";"));
    } else if (!!input) {
      urls.push(input);
    }
  }

  if (urls.length === 0) {
    console.log(chalk.red(`缺少 swagger 文件路径`));
    process.exit();
  }

  return {
    ...config,
    input: urls,
    output,
    headers: {
      cookie: cookie || "",
    },
  };
};
