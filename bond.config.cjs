module.exports = {
  // input: [
  //   "https://apollo.study.youdao.com/senior-manager/v2/api-docs",
  //   "https://apollo.study.youdao.com/user-manager/v2/api-docs",
  //   "https://apollo.study.youdao.com/senior-service/v2/api-docs",
  // ],
  input: [
    // "./swagger copy.json",
    // "https://apollo.study.youdao.com/admin-manager/v2/api-docs",
    // "https://apollo.study.youdao.com/user-manager/v2/api-docs",
    // "https://apollo.study.youdao.com/school-service/v2/api-docs",
    "https://apollo.study.youdao.com/school-manager/v2/api-docs",
    // "https://apollo.study.youdao.com/user-service/v2/api-docs",
    // "https://apollo.study.youdao.com/course-service/v2/api-docs",
    // "https://apollo.study.youdao.com/vip-service/v2/api-docs",
    // "https://apollo.study.youdao.com/vip-manager/v2/api-docs",
    // "https://apollo.study.youdao.com/callback-manager/v2/api-docs",
    // "https://apollo.study.youdao.com/tiku-service/v2/api-docs",
    "https://apollo.study.youdao.com/tiku-manager/v2/api-docs",
    // "https://apollo.study.youdao.com/image-service/v2/api-docs",
    // "https://apollo.study.youdao.com/message-service/v2/api-docs",
    // "https://apollo.study.youdao.com/senior-service/v2/api-docs",
    "https://apollo.study.youdao.com/senior-manager/v2/api-docs",
    // "https://apollo.study.youdao.com/vip-service/v3/api-docs/v2/api-docs",
    // "https://apollo.study.youdao.com/vip-manager/v3/api-docs/v2/api-docs",
    // "https://apollo.study.youdao.com/callback-manager/v3/api-docs/v2/api-docs",
  ],
  cookie:
    "DICT_PERS=v2|urscookie||DICT||web||-1||1679881751634||115.236.119.138||shdtest@163.com||TFh4OGRMpBRkEk4klhLk50wFP4OGk4TK0OfPLT46MYWROfk4UMRLqB0klhLlWk4kWRUMnf6ukMJBRpZhLPLOLwK0;",
  output: "./api",
  request: "../front-admin-external/src/utils/request.ts",
  postfix: "",
  customConfig: {
    removeController: true,
    servicesDimension: "service", // "service" | "controller" | "all"
    tagKey: "description",
  },
  mergeConfig: {
    operationId: ["method", "path"], // basePath、 path、 origin、 method
  },
};
