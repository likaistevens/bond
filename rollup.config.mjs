import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    exports: "named",
    file: "./dist/index.js",
    format: "cjs",
  },
  plugins: [
    typescript({
      module: "esnext",
    }),
    nodeResolve(),
  ],
  external: [
    "openapi-typescript-codegen",
    "dotenv",
    "iconv-lite",
    "node-fetch",
  ],
};
