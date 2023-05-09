import fs from "fs-extra";
import Mock from "mockjs";
import path from "path";
import { prettifyCode } from "../../../../utils";

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
      const filePath = path.join(outputDataDir, `${operationId}.json`);
      const jsonStr = prettifyCode(JSON.stringify(mockData), {
        parser: "json",
      });
      return fs.writeFile(filePath, jsonStr);
    })
  );
};
