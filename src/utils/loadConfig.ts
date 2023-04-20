import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const configFileName = "bond.config.js";
const envName = ".env";

export const loadConfig = async () => {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, configFileName);
  const envPath = path.resolve(cwd, envName);

  const isConfigExist = fs.existsSync(configPath);
  const isEnvExist = fs.existsSync(envPath);

  if (!isConfigExist && !isEnvExist) {
    console.log(
      chalk.red(`找不到 ${configFileName} 配置文件 或 ${envName} 文件`)
    );
    process.exit();
  }

  const urls: string[] = [];
  let config;
  if (isConfigExist) {
    // console.log(chalk.green(`从 ${configFileName} 中读取配置`));
    config = (await import(configPath)).default;
  } else if (isEnvExist) {
    // console.log(chalk.green(`从 ${envName} 中读取配置`));
    config = process.env;
  }
  const {
    cookie,
    input = "./swagger.json",
    output = "./api",
    request,
  } = config;

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
    url: urls,
    headers: {
      cookie: cookie || "",
    },
    output,
    request,
  };
};
