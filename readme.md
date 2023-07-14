# Bond

1. 从本地或远程拉取 swagger 接口文件，自动生成对应接口调用方法以及接口结构体
2. 支持多个 swagger 进行合并。
3. 支持简单接口的 mock 数据生成，当后端未指定数据 example 时也能根据字段名给出更贴合业务场景的 mock 数据。

### 1. 安装

```bash
yarn add @ranbo/bond -D
```

### 2. 配置

| Name      |   Type   | Default   | Description                                |
| :-------- | :------: | :-------- | :----------------------------------------- | 
| `input`   | `string \| string[]` |    | swagger 文件的的地址，同时支持远程文件地址、本地文件地址，可远程、本地地址混合。存在多个文件地址，在 bond.config.js 中使用数组传入，在.env 中以 ; 分割。 |
| `output`  | `string` | ./api     | 输出路径。通常建议设置为 ./src/api                                   |
| `request` | `string` |           | 自定义 request 文件地址                    |
| `cookie`  | `string` |           | 非必需，远程地址有身份校验的时候需要传入 |
| `postfix`  | `string` |  Service   | Service 的后缀。若不希望有后缀，可以传入空字符。 |
| `customConfig`  | `CustomConfig` |           | 非必需，特性化配置。 |
| `mergeConfig`  | `MergeConfig` |           | 非必需，远程地址有身份校验的时候需要传入 |
| `mock`  | `MockConfig` |           | 非必需，需要 mock 时可以使用。 |

CustomConfig
```typescript
{
  /**
   * 以何种维度聚合 service
   * service: 一个 service 合并为一个 Service 文件，通常对应一个 basePath
   * controller: 默认方式，一个 controller 一个 Service 文件
   * all: 所有 controller 全部合并到一个 Service 文件
   * default = "controller"
   */
  servicesDimension?: "service" | "controller" | "all";
  /**
   * tags 中的 name 以 controller 结尾，可以设置 removeController 为 true 将其去除。
   * default = false
   */
  removeController?: boolean;
  /**
   * 以哪个字段作为 controller 分类的 key。
   * 默认是 “name”, 但是某些团队为了在 swagger UI 上展示效果明显，将 name 设置为中文，swagger 框架会自动将 controller 解析后作为 description
   */
  tagKey?: "name" | "description";
}
```

MergeConfig
```typescript
{
  /**
   * 按照数组顺序进行拼接，生成 operationId。 以下变量为保留词，会自动替换成对应变量并进行 camelCase 处理后拼接。其他字符串会经过 camelCase 处理后直接拼接。
   * 若无 swagger 合并需求，或 swagger 中对于 operationId 是规范的,可以不配置此项。
   * 若有 swagger 合并，且 operationId 是 swagger 框架层自动生成，则必须配置，否则可能存在调用方法名称冲突的情况，推荐设置为 ["method", "path"]
   * basePath: swagger 中的定义的 basePath
   * path: 具体某一请求的 path
   * method: 请求的方法，get、post ...
   * origin: 原始 operationId
   *
   * default = ["origin"]
   */
  operationId?: string[]; // basePath、 path、 origin、 method
}
```

MockConfig
```typescript
{
  /** 用于生成 mock 数据的 swagger 路径 */
  input: string[];
  /** mock 文件输出目录，默认为 "./mock-server" */
  outputDir?: string;
  /** 本地 mock 服务的端口号，默认为 8008 */
  port?: number;
  /** 需要生成 mock 数据的接口路径 */
  pathList?: string[];
  /** mock 数据文件白名单，传入 mock 数据的接口路径或 mock 数据文件的文件名，列表中的接口数据文件不会被重写。也可在 mock 数据文件中增加 @overwrite 注释禁止当前文件被重写 */
  whitelist?: string[];
  /** 使用模版自定义 response 的包裹, 其中的 $data 会被替换为 mock 数据 */
  response?: string;
}
```

支持 bond.config.js 配置文件（推荐） 和 .env 配置文件。
在项目根目录下新建 bond.config.js 文件, 配置以上参数。

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
yarn bond api
```

### Documentation

- [自定义 request 文件](docs/custom-request-file.md)

### TODO

- model 的合并
- 整理 middleware ，暴露方法允许自定义，暴露mockjs自定义pattern方法