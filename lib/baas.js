'use strict';

const AVALIABLE_ENVS = ['alpha', 'beta', 'prod'];

class InvalidParamsError {
  constructor(message) {
    this.name = 'INVALID_PARMAS';
    this.message = message || '参数不合法';
  }
}

module.exports = {
  init({ env = 'prod', appId }) {
    if (!~AVALIABLE_ENVS.indexOf(env)) throw new InvalidParamsError(`不支持的 env: ${env}`);
    if (appId == null) throw new InvalidParamsError('appId 不能为空');
    this.env = env;
    this.appId = appId;
  }
};

