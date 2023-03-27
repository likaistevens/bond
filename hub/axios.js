/**
 * copy from edu-mooc-react-components: src/core/hub/axios.js
 */

/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
import axios from 'axios';
import qs from 'qs';
import utils from '../utils';

let winDoc = typeof window === 'undefined' ? null : window?.document;
const DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';
const defaultResultResolver = resp => resp.data;

function Axios(opts) {
  this.opts = opts;
}

const getHeader = () => {
  const CSRF_TOKEN = utils.cookie.getValueByKey('NTESSTUDYSI', winDoc);
  return {
    'content-type': DEFAULT_CONTENT_TYPE,
    'edu-script-token': CSRF_TOKEN,
  };
};

const getParams = () => {
  return {
    csrfKey: utils.cookie.getValueByKey('NTESSTUDYSI', winDoc),
  };
};

Axios.of = opts => new Axios(opts);
Axios.setWinDoc = wd => {
  if (winDoc) return;
  winDoc = wd;
};

Axios.prototype = {
  setUrl(url) {
    this.opts.url = url;
    return Axios.of(this.opts);
  },
  setMethod(method) {
    this.opts.method = method.toLowerCase();
    return Axios.of(this.opts);
  },
  setHeads(h) {
    this.opts.headers || (this.opts.headers = getHeader());
    const headers = Object.assign({}, this.opts.headers, h);
    this.opts.headers = headers;
    return Axios.of(this.opts);
  },
  setParams(p) {
    const CSRF_TOKEN = utils.cookie.getValueByKey('NTESSTUDYSI', winDoc);
    this.opts.params ||
      (this.opts.params = {
        csrfKey: CSRF_TOKEN,
      });
    const params = Object.assign({}, this.opts.params, p);
    this.opts.params = params;
    return Axios.of(this.opts);
  },
  setData(d) {
    this.opts.data || (this.opts.data = {});
    const data = Object.assign({}, this.opts.data, d);
    this.opts.data = data;
    return Axios.of(this.opts);
  },
  async launch() {
    const {
      url,
      method = 'post',
      headers = getHeader(),
      params = getParams(),
      paramsSerializer = params => qs.stringify(params),
      data = {},
    } = this.opts;

    const opts = {
      ...this.opts,
      url,
      method,
      params,
      paramsSerializer,
      headers,
      withCredentials: true,
      data:
        headers['content-type'] === DEFAULT_CONTENT_TYPE
          ? qs.stringify(data)
          : data,
    };

    const resp = await axios(opts);
    return defaultResultResolver(resp);
  },
};

export default Axios;
