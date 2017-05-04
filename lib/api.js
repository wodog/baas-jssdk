'use strict';

const axios = require('axios');
axios.defaults.headers.common['Content-Type'] = 'application/json';

class InvalidParamsError {
  constructor(message) {
    this.name = 'INVALID_PARMAS';
    this.message = message || '参数不合法';
  }
}

module.exports = Baas => {
  Baas[Symbol.for('api')] = ['get', 'post', 'patch', 'delete'].reduce((base, method) => {
    base[method] = (...args) => {
      let baseUrl = '//baas.ele.me/tables';
      let url = args[0];
      if (url == null) throw new InvalidParamsError('url 不能为空'); // eslint-disable-line eqeqeq
      if (typeof url !== 'string') throw new InvalidParamsError(`非法的 url: ${url}`);
      switch (Baas.env) {
        case 'alpha':
          baseUrl = '//httpizza.alpha.elenet.me/fe.baas_api/tables';
          break;
        case 'beta':
          baseUrl = '//httpizza.beta.elenet.me/fe.baas_api/tables';
          break;
      }
      const tableName = args[0].split('/')[0];
      if (!tableName) throw new InvalidParamsError(`url 格式非法：${args[0]}`);
      url = url.replace(/^\/?/, baseUrl + '/');
      const hasQueryString = /\?/.test(url);
      url += hasQueryString ? `&appId=${Baas.appId}` : `?appId=${Baas.appId}`;
      args[0] = url;
      if (~['post', 'patch'].indexOf(method)) {
        const body = args[1];
        if (body == null) throw new InvalidParamsError('body 不能为空');
        if (typeof body !== 'object') throw new InvalidParamsError(`非法的 body: ${body}`);
        args[1] = JSON.stringify({ body: args[1] });
      }
      args.push({ headers: { 'Content-Type': 'application/json' }, withCredentials: true });
      return axios[method](...args).then(({ data }) => {
        if (data instanceof Array) return data.map(item => new Baas.Object({ tableName, data: item }));
        return new Baas.Object({ tableName, data });
      });
    };
    return base;
  }, Object.create(null));
};

