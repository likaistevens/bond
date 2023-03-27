/**
 * 基于axios封装请求
 * 配置request请求时的默认参数
 */
import axios from 'axios';
import Cookies from 'js-cookie';
import { Modal } from 'antd';
import { Base64 } from 'js-base64';
import qs from 'qs';

/** 用作环境判断 */
const ENV_KEY = 'Environment';
const _currentEnv = null;

const setScope = scope => {
  const str = JSON.stringify({ scope });
  return Base64.encode(str);
};

// 异常处理
const errorHandler = error => {
  const { response } = error;
  debugger;
  if (response && response.status) {
    const codeMessage = {
      200: '服务器成功返回请求的数据。',
      401: '用户没有权限（令牌、用户名、密码错误）。',
      500: '服务器发生错误，请检查服务器。',
      502: '网关错误。',
      503: '服务不可用，服务器暂时过载或维护。',
      504: '网关超时。',
    };
    const { status } = response;
    const errorText = response?.statusText || codeMessage[status];
    // if (response.status === 401) {
    //   window.location.href = 'https://ids.corp.youdao.com/auth/realms/sso/protocol/openid-connect/auth?client_id=http://ke-cms-inner.study.youdao.com/&redirect_uri=http://ke-cms-inner.study.youdao.com/api/rd/login/callback&response_type=code';
    // }

    Modal.error({
      title: `请求错误`,
      content: errorText,
    });
  }

  return response;
};

const request = axios.create({
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 30000,
  async: true,
  crossDomain: true,
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
});

// request 拦截器
request.interceptors.request.use(config => {
  const csrfKey = Cookies.get('NTESSTUDYSI');

  const {
    url,
    method = 'post',
    data,
    withCredentials,
    isNeedCsrfKey,
    file,
    scope,
    params,
    headers,
  } = config || {};

  // if (withCredentials === false) {
  //   options.credentials = 'same-origin';
  // }

  config.url =
    isNeedCsrfKey === false
      ? url
      : `${url}${url.includes('?') ? '&' : '?'}csrfKey=${csrfKey}`;

  if (method.toLowerCase() === 'get') {
    // 兼容处理get 请求没传 params
    if (!params) {
      config.params = data;
    }
  } else if (!config?.requestType && config) {
    config.requestType = 'form';
  }

  // 设置请求头
  if (!config.headers['content-type']) {
    // 如果没有设置请求头
    config.headers['content-type'] =
      'application/x-www-form-urlencoded;charset=utf-8';
    if (config.method === 'post') {
      config.data = qs.stringify(config.data); // 序列化,比如表单数据
    }
  }

  // 根据当前页面链接判断是否为admin后台且为post请求，如果是的话需要增加环境参数
  const isAdminPost =
    /icourse163\.org\/backend/.test(location.href) &&
    method.toUpperCase() === 'POST';

  // 是否为file上传
  config.headers = file
    ? {}
    : {
        // nei不允许插入edu-script-token，会造成cors不能跨域
        ...(~config.url.indexOf('nei.hz.netease.com') ||
        ~config.url.indexOf('wanproxy.127.net')
          ? {}
          : { 'edu-script-token': csrfKey }),
        ...headers,
        ...(scope ? { 'eds-scope': setScope(scope) } : {}),
        ...(/icourse163\.com/.test(location.href)
          ? { 'Accept-Language': 'en' }
          : {}),
        ...(_currentEnv && isAdminPost && /web\/j/.test(fetchUrl)
          ? { [ENV_KEY]: _currentEnv }
          : {}),
      };

  return { ...config };
});

request.interceptors.response.use(async res => {
  const { code, message } = res?.data || {};
  const { config } = res;
  if (code === undefined) {
    return res?.data;
  }
  if (code !== 0 && !config.notShowErr) {
    Modal.error({
      title: `请求错误`,
      content: message,
    });
    return;
  }

  return res?.data?.result;
});

export default request;
