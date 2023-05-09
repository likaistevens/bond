import fs from "fs-extra";
import { prettifyCode } from "../../../../utils";

export const writeUtils = async (path: string) => {
  const utilsStr = `const { pathToRegexp } = require("path-to-regexp");
  
      const isMatch = (routePattern) => (routePath) => {
        const regexp = pathToRegexp(routePattern);
        return !!regexp.exec(routePath);
      };
  
      module.exports = { isMatch };
    `;

  await fs.writeFile(path, prettifyCode(utilsStr));
};
