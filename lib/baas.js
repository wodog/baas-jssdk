'use strict';

const axios = require('axios');
const AVALIABLE_ENVS = ['alpha', 'beta', 'prod'];

function InvalidParamsError(message) {
  this.name = 'INVALID_PARMAS';
  this.message = message || '参数不合法';
}

module.exports = {
  init({ env = 'prod', appId }) {
    if (!~AVALIABLE_ENVS.indexOf(env)) throw new InvalidParamsError(`不支持的 env: ${env}`);
    if (appId == null) throw new InvalidParamsError('appId 不能为空'); // eslint-disable-line eqeqeq
    this.env = env;
    this.appId = appId;
    let baseURL = '//baas.ele.me';
    switch (env) {
      case 'alpha':
        baseURL = '//httpizza.alpha.elenet.me/fe.baas_api';
        break;
      case 'beta':
        baseURL = '//httpizza.beta.elenet.me/fe.baas_api';
        break;
    }
    const httpClient = axios.create({ baseURL });
    httpClient.defaults.headers.common['Content-Type'] = 'application/json';
    httpClient.defaults.withCredentials = true;
    this.api = ['get', 'post', 'put', 'patch', 'delete'].reduce((base, method) => {
      base[method] = (...args) => {
        const url = args[0];
        const hasQueryString = /\?/.test(url);
        args[0] += hasQueryString ? '&' : '?';
        args[0] += `appId=${appId}`;
        if (~['post', 'put', 'patch'].indexOf(method)) {
          const data = args[1];
          args[1] = { body: data };
        }
        return httpClient[method](...args);
      };
      return base;
    }, Object.create(null));
    this.api.batch = (requests) => {
      return httpClient.post(`/batch?appId=${appId}`, JSON.stringify(requests));
    };
  },
  version: '0.0.11'
};

