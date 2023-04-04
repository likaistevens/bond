# 自定义 request 文件

使用 axios 自定义 request 文件的简单示例。该文件会被拷贝到 [output]/core 目录中

```typescript
import axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import type { ApiRequestOptions } from "./ApiRequestOptions";
import type { OpenAPIConfig } from "./OpenAPI";

const axiosInstance = axios.create({
  // ...
});

export const request = <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions
): Promise<T> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request({
        url: `${config.BASE}${options.path}`,
        data: options.body,
        method: options.method,
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
```
