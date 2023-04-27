export type BondConfig = {
  input: string[];
  cookie: string;
  output: string;
  request: string;
  mergeConfig: {
    /**
     * 按照数组顺序进行拼接，生成 operationId。 以下变量为保留词，会自动替换成对应变量并进行 camelCase 处理后拼接。其他字符串会经过 camelCase 处理后直接拼接
     * basePath、path、method
     * origin：原始 operationId
     * default: undefined
     */
    operationId?: string[]; // basePath、 path、 origin、 method、
  };
  customConfig: {
    /**
     * tags 中的 name 以 controller 结尾，可以设置 removeController 为 true 将其去除。
     * default: false
     */
    removeController?: boolean;
  };
  headers?: Record<string, string>;
};

export interface GenericConfigObject {
  [key: string]: unknown;
}

export type LoadConfigFile = typeof loadConfigFile;

export function loadConfigFile(
  fileName: string,
  commandOptions: any
): Promise<any>;

export type SwaggerPathMethodObject = {
  tags: string[];
  summary: string;
  operationId: string;
  consumes: string[];
  produces: string[];
  parameters: {
    name: string;
    in: string;
    description: string;
    required: boolean;
    type: string;
  }[];
  responses: Record<
    string | number,
    { description: string; schema: { type: string } }
  >;
  security: any[];
  deprecated: boolean;
};

export type Swagger = {
  swagger: string;
  info: {
    description: string;
    version: string;
    title: string;
    license: {
      name: string;
      url: string;
    };
  };
  host: string;
  basePath: string;
  tags: {
    name: string;
    description: string;
  }[];
  paths: Record<string, Record<string, SwaggerPathMethodObject>>;
  securityDefinitions: Record<string, any>;
  definitions: Record<string, any>;
};
