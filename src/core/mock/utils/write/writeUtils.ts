import fs from "fs-extra";
import { prettifyCode } from "../../../../utils";

export const writeUtils = async (path: string) => {
  const utilsStr = `const pathToRegexp = require("path-to-regexp");
  
      const isMatch = (routePattern) => (routePath) => {
        /** 兼容老版本 */
        const _pathToRegexp = pathToRegexp.pathToRegexp || pathToRegexp;
        const regexp = _pathToRegexp(routePattern);
        return !!regexp.exec(routePath);
      };
  
      module.exports = { isMatch };
    `;

  await fs.writeFile(path, prettifyCode(utilsStr));
};
