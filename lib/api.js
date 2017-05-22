'use strict';

const axios = require('axios');
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

module.exports = Baas => {
  if (!Baas.appId) throw new Error('请先调用 Baas.init 初始化 appId');
  let baseURL = '//baas.ele.me';
  switch (Baas.env) {
    case 'alpha':
      baseURL = '//httpizza.alpha.elenet.me/fe.baas_api/tables';
      break;
    case 'beta':
      baseURL = '//httpizza.beta.elenet.me/fe.baas_api/tables';
      break;
  }
  baseURL += `?appId=${Baas.appId}`;
  Baas.api = axios.create({ baseURL });
  Baas.api.batch = (requests) => {
    return axios.post('/batch', JSON.stringify(requests)).then(({ data }) => {
      return data.map(response => {
        if (response instanceof Array) return response.map(item => new Baas.Object({ data: item }));
        return new Baas.Object({ data: response });
      });
    });
  };
};

