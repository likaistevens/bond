import fs from "fs-extra";
import Mock from "mockjs";
import path from "path";
import { prettifyCode } from "../../../../utils";
import { DATA_OVERWRITE_MODE } from "../const";
import { smartMockPlugin } from "../smartMockPlugin";

export const writeData = async ({
  mockPatternObj,
  outputDataDir,
  whitelist,
  operationId2Path,
}: {
  mockPatternObj: Record<string, Record<string, any>>;
  outputDataDir: string;
  whitelist: string[];
  operationId2Path: Record<string, any>;
}) => {
  // 对基础 mock 数据进行字段识别，输出更符合业务场景的 mock 数据
  const newMockPatternObj = smartMockPlugin(mockPatternObj);
  fs.writeFile(
    path.resolve(process.cwd(), "./mockPatternObj.json"),
    JSON.stringify(newMockPatternObj)
  );

  await Promise.all(
    Object.entries(newMockPatternObj)
      .filter(
        ([operationId]) =>
          !whitelist.includes(operationId) &&
          !whitelist.includes(`${operationId}.js`) &&
          !whitelist.includes(operationId2Path[operationId])
      )
      .map(([operationId, mockPattern]) => {
        const mockData = Mock.mock(mockPattern);
        const filePath = path.join(outputDataDir, `${operationId}.js`);
        return writeWithoutOverwrite({
          filePath,
          mockData,
        });
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
