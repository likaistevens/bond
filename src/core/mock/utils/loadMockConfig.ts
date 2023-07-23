import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { BondConfig } from "../../../../__type__/index";
import {
  CONFIG_FILE_EXT,
  CONFIG_FILE_NAME,
  DEFAULT_MOCK_OUTPUT_DIR,
  DEFAULT_MOCK_SERVER_PORT,
} from "./const";
import os from "os";

const isWindows = os.type().toLowerCase().includes("windows");

export const loadMockConfig = async (): Promise<
  Omit<BondConfig, "mock"> & { mock: Required<BondConfig["mock"]> }
> => {
  const cwd = process.cwd();

  const configPaths = CONFIG_FILE_EXT.map((ext) =>
    path.resolve(cwd, `${CONFIG_FILE_NAME}.${ext}`)
  );
  const configPath = configPaths.find((p) => fs.existsSync(p));

  if (!configPath) {
    console.log(chalk.red(`找不到 ${CONFIG_FILE_NAME} 配置文件`));
    process.exit();
  }

  // TODO: 支持 esmodule （mjs）
  const userConfig = (
    await import(isWindows ? "file:\\" + configPath : configPath)
  ).default as BondConfig;
  const { output, mock } = userConfig;
  if (!mock?.input?.length) {
    console.log(chalk.red(`找不到 mock.input 配置`));
    process.exit();
  }

  const defaultMockConfig = {
    input: [],
    port: DEFAULT_MOCK_SERVER_PORT,
    pathList: [],
    whitelist: [],
    outputDir: path.join(output, DEFAULT_MOCK_OUTPUT_DIR),
    response: "",
  };

  return {
    ...userConfig,
    mock: {
      ...defaultMockConfig,
      ...mock,
    },
  };
};
