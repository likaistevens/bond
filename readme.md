# Bond

### 1. 安装

```bash
yarn add @ranbo/bond -D
```

### 2. 配置

| Name      |   Type   | Default   | Description                                |
| :-------- | :------: | :-------- | :----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`   | `string  | string[]` |                                            | swagger 文件的的地址，同时支持远程文件地址、本地文件地址，可远程、本地地址混合。存在多个文件地址，在 bond.config.js 中使用数组传入，在.env 中以 ; 分割。 |
| `output`  | `string` | ./api     | 输出路径                                   |
| `request` | `string` |           | 自定义 request 文件地址                    |
| `cookie`  | `string` |           | 非必需，远程地址需要身份校验的时候可以传入 |

支持 bond.config.js 配置文件（推荐） 和 .env 配置文件。

##### example:

.bond.config.js

```javascript
module.exports = {
  input: ["https://xxxxxx/v2/api-docs-1", "https://xxxxxx/v2/api-docs-2"],
  cookie: "xxxxxxx",
  output: "./api",
  request: "./src/utils/request.ts",
};
```

.env

```bash
input=https://xxxxxx/v2/api-docs-1;https://xxxxxx/v2/api-docs-2
cookie=xxxxxxxx
output=../front-web/api
request=./src/utils/request.ts
```

### 3. 运行

```bash
yarn bond
```

### Documentation

- [自定义 request 文件](docs/custom-request-file.md)
