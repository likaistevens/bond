export type BondConfig = {
  input: string[];
  cookie: string;
  output: string;
  request: string;
  /**
   * Service name postfix (default: "Service")
   */
  postfix: string;
  mergeConfig: {
    /**
     * 按照数组顺序进行拼接，生成 operationId。 以下变量为保留词，会自动替换成对应变量并进行 camelCase 处理后拼接。其他字符串会经过 camelCase 处理后直接拼接
     * basePath、path、method
     * origin：原始 operationId
     *
     * default: undefined
     */
    operationId?: string[]; // basePath、 path、 origin、 method
  };
  customConfig: {
    /**
     * 以何种维度聚合 service
     * service: 一个 service 合并为一个 Service 文件，通常对应一个 basePath
     * controller: 默认方式，一个 controller 一个 Service 文件
     * all: 所有 controller 全部合并到一个 Service 文件
     *
     * default: "controller"
     */
    servicesDimension?: "service" | "controller" | "all";
    /**
     * tags 中的 name 以 controller 结尾，可以设置 removeController 为 true 将其去除。
     *
     * default: false
     */
    removeController?: boolean;
    /**
     * 以哪个字段作为 controller 分类的 key。
     * 默认是 “name”, 但是某些团队为了在 swagger UI 上展示效果明显，将 name 设置为中文，swagger 框架会自动将 controller 解析后作为 description
     */
    tagKey?: "name" | "description";
  };
  headers?: Record<string, string>;
  mock?: {
    /** 用于生成 mock 数据的 swagger 路径 */
    input: string[];
    /** mock 文件输出目录，默认为 "./mock-server" */
    outputDir?: string;
    /** 本地 mock 服务的端口号，默认为 8008 */
    port?: number;
    // db?: string;
    /** 需要生成 mock 数据的接口路径 */
    pathList?: string[];
    /** mock 数据文件白名单，传入 mock 数据的接口路径或 mock 数据文件的文件名，列表中的接口数据文件不会被重写。也可在 mock 数据文件中增加 @overwrite 注释禁止当前文件被重写 */
    whitelist?: string[];
    /** 使用模版自定义 response 的包裹, 其中的 $data 会被替换为 mock 数据 */
    response?: string;
  };
};
