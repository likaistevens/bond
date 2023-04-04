# 第一版使用说明

### 1. 安装

```bash
yarn add @ranbo/bond -D
```

### 2. 在项目根目录创建 .env 文件配置以下字段

| Name      |   Type   | Default | Description                                           |
| :-------- | :------: | :------ | :---------------------------------------------------- |
| `input`   | `string` |         | 输入的 Swagger 文件的地址，可以是远程地址或者本地路径 |
| `output`  | `string` |         | 输出路径                                              |
| `request` | `string` |         | 自定义 request 文件地址                               |
| `cookie`  | `string` |         | 非必需，远程地址需要身份校验的时候可以传入            |

##### example:

.env

```bash
input=https://xxxxxx/v2/api-docs
cookie=xxxxxxxx
output=../front-web/api
request=../front-web/request.ts
```

### 3. 运行

```bash
yarn bond
```

### Documentation

- [自定义 request 文件](docs/custom-request-file.md)
