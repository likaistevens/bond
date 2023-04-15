import fetch, { RequestInit } from "node-fetch";
import fs from "fs-extra";

const isRemote = (url: string) => {
  return url.startsWith("http");
};

export const fetchFiles: (
  url: string | string[],
  options: RequestInit
) => Promise<Buffer[]> = async (url, options) => {
  try {
    const urls: string[] = [];
    if (Array.isArray(url)) {
      urls.push(...url);
    } else {
      if (url.includes(";")) {
        urls.push(...url.split(";"));
      } else {
        urls.push(url);
      }
    }
    return Promise.all<Buffer>(
      urls.map((url) => {
        return new Promise(async (resolve, reject) => {
          try {
            if (isRemote(url)) {
              const response = await fetch(url, options);
              const data = await response.arrayBuffer();
              resolve(Buffer.from(data));
            } else {
              const data = await fs.readFile(url);
              resolve(data);
            }
          } catch (e) {
            reject(e);
          }
        });
      })
    );
  } catch (e) {
    throw e;
  }
};
