import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const getPlugins = () => {
  const plugins = [
    typescript({
      module: "esnext",
    }),
    nodeResolve(),
  ];
  if (process.env.NODE_ENV === "development") {
    return plugins;
  }
  return [...plugins, terser()];
};

export default {
  input: "src/index.ts",
  output: {
    exports: "named",
    file: "./dist/index.js",
    format: "cjs",
  },
  plugins: getPlugins(),
  external: [
    "openapi-typescript-codegen",
    "dotenv",
    "iconv-lite",
    "node-fetch",
  ],
};
