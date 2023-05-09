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
    input: string[];
    outputDir: string;
    port: number;
    db?: string;
  };
};
