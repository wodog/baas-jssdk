'use strict';

var axios = require('axios');
var AVALIABLE_ENVS = ['alpha', 'beta', 'prod'];

function InvalidParamsError(message) {
  this.name = 'INVALID_PARMAS';
  this.message = message || '参数不合法';
}

module.exports = {
  init: function(params) {
    var env = params.env || 'prod';
    var appId = params.appId;
    if (!~AVALIABLE_ENVS.indexOf(env)) throw new InvalidParamsError('不支持的 env:' + env);
    if (appId == null) throw new InvalidParamsError('appId 不能为空'); // eslint-disable-line eqeqeq
    this.env = env;
    this.appId = appId;
    var baseURL = '//baas.ele.me';
    switch (env) {
      case 'alpha':
        baseURL = '//httpizza.alpha.elenet.me/fe.baas_api';
        break;
      case 'beta':
        baseURL = '//httpizza.beta.elenet.me/fe.baas_api';
        break;
    }
    if (typeof window === 'undefined') baseURL = 'http:' + baseURL;
    var httpClient = axios.create({ baseURL: baseURL });
    var headers = params.headers || {};
    Object.keys(headers).forEach(function(header) {
      httpClient.defaults.headers.common[header] = headers[header];
    });
    httpClient.defaults.headers.common['Content-Type'] = 'application/json';
    httpClient.defaults.withCredentials = true;
    this.api = ['get', 'post', 'put', 'patch', 'delete'].reduce(function(base, method) {
      base[method] = function(url, data, config) {
        var hasQueryString = /\?/.test(url);
        url += hasQueryString ? '&' : '?';
        url += 'appId=' + appId;
        if (~['post', 'put', 'patch'].indexOf(method)) {
          return httpClient[method](url, { body: data }, config);
        }
        return httpClient[method](url, data);
      };
      return base;
    }, {});
    this.api.batch = function(requests) {
      return httpClient.post('/batch?appId=' + appId, JSON.stringify(requests));
    };
  },
  version: '0.0.17'
};

