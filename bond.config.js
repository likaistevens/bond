module.exports = {
  input: [
    "https://apollo.study.youdao.com/senior-manager/v2/api-docs",
    "https://apollo.study.youdao.com/user-manager/v2/api-docs",
    "https://apollo.study.youdao.com/senior-service/v2/api-docs",
  ],
  cookie:
    "DICT_PERS=v2|urscookie||DICT||web||-1||1679881751634||115.236.119.138||shdtest@163.com||TFh4OGRMpBRkEk4klhLk50wFP4OGk4TK0OfPLT46MYWROfk4UMRLqB0klhLlWk4kWRUMnf6ukMJBRpZhLPLOLwK0;",
  output: "./api",
  request: "../front-web/api/core/request.ts",
};