import fs from "fs-extra";
import { Swagger } from "../type";

export const readJsonFiles = async (paths: string[]): Promise<Swagger[]> => {
  return Promise.all(paths.map((path) => fs.readJson(path)));
};
