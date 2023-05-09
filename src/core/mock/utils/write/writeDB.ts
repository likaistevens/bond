import path from "path";
import fs from "fs-extra";

const DEFAULT_DB_RELATIVE_PATH = "./db.json";

export const writeDB = async (outputServerDir: string) => {
  fs.writeFile(path.join(outputServerDir, DEFAULT_DB_RELATIVE_PATH), `{}`);
};
