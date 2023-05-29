import fs from "fs-extra";
import Mock from "mockjs";
import path from "path";
import { prettifyCode } from "../../../../utils";
import { DATA_OVERWRITE_MODE } from "../const";

export const writeData = async ({
  mockPatternObj,
  outputDataDir,
}: {
  mockPatternObj: Record<string, Record<string, any>>;
  outputDataDir: string;
}) => {
  await Promise.all(
    Object.entries(mockPatternObj).map(([operationId, mockPattern]) => {
      const mockData = Mock.mock(mockPattern);
      const filePath = path.join(outputDataDir, `${operationId}.js`);
      return writeWithoutOverwrite({ filePath, mockData });
    })
  );
};

const writeWithoutOverwrite = async ({
  filePath,
  mockData,
}: {
  filePath: string;
  mockData: any;
}): Promise<void> => {
  const isOverwrite = await isOverwriteInData(filePath);
  if (!isOverwrite) {
    const jsonStr = prettifyCode(
      `module.exports = ${JSON.stringify(mockData)};`
    );
    await fs.writeFile(filePath, jsonStr);
  }
};

const isOverwriteInData = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    if (data?.includes(DATA_OVERWRITE_MODE)) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
