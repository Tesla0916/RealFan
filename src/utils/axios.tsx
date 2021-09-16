import axios from 'axios';
import { message } from 'antd';

const BASE_HOST = ''; // http://39.105.160.236:8090
const BASE_URL = BASE_HOST ? `${BASE_HOST}` : '';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  transformRequest: [],
  headers: {
    Accept: '*/*',
  },
});

// 对请求进行拦截
instance.interceptors.request.use((config) => config);

// 对接口返回进行拦截
instance.interceptors.response.use((result) => {
  if (result.data.status === 0) {
    // 判断不同的code类型
  }
  return result.data;
}, (thrown) => {
  message.error('接口请求超时');
  if (axios.isCancel(thrown)) {
    return Promise.reject(new Error('请求被阻断'));
  }
  return Promise.reject(thrown);
});

const get = function (url: string, opts = {}, config = {}) {
  return instance
    .get(
      url,
      {
        params: {
          ...opts,
          ...config,
        },
      },
    ).catch();
};

const post = function (url: string, opts = {}, config = {}) {
  return instance
    .post(
      url,
      { ...opts },
      {
        transformRequest: (data) => JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...config,
        },
      },
    ).catch();
};

export default {
  get, post,
};
