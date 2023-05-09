import prettier, { Options } from "prettier";

const baseOption: Options = {
  printWidth: 120,
  trailingComma: "all",
  arrowParens: "always",
  parser: "babel",
};

export const prettifyCode = (code: string, options?: Options) =>
  prettier.format(code, {
    ...baseOption,
    ...(options || {}),
  });
