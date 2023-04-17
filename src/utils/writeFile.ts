import fs from "fs-extra";

export const writeFile = async (buf: Buffer, output: string) => {
  return new Promise<string>((resolve, reject) => {
    const _output = output;
    fs.writeFile(_output, buf, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(_output);
      }
    });
  });
};
