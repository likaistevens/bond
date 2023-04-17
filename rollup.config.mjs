import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import path from "path";

const getPlugins = () => {
  const plugins = [
    typescript({
      module: "esnext",
      exclude: "node_modules",
    }),
    commonjs({
      // include: "/node_modules/**"
    }),
    json(),
    nodeResolve({
      exportConditions: ["node"], // https://github.com/SBoudrias/Inquirer.js/issues/1153
    }),
  ];
  if (process.env.NODE_ENV === "development") {
    return plugins;
  }
  return [...plugins, terser()];
};

const cwd = process.cwd();

export default {
  input: path.resolve(cwd, "src/index.ts"),
  output: {
    dir: path.resolve(cwd, "./dist"),
    entryFileNames: "[name].js",
    // exports: "named",
    // file: path.resolve(cwd, "./dist/index.js"),
    format: "cjs",
  },
  plugins: getPlugins(),
  external: [
    "openapi-typescript-codegen",
    "dotenv",
    "iconv-lite",
    "node-fetch",
    "fs-extra",
    // "chalk",
    // "ora",
  ],
};
