'use strict';

class InvalidParamsError {
  constructor(message) {
    this.name = 'INVALID_PARMAS';
    this.message = message || '参数不合法';
  }
}

module.exports = Baas => {
  class Query {
    constructor(className) {
      if (className == null) throw new InvalidParamsError('className 不能为空'); // eslint-disable-line eqeqeq
      if (typeof className !== 'string') throw new InvalidParamsError(`className 必须是字符串而非: ${typeof className}`);
      this.className = className;
    }
    find() { return Baas[Symbol.for('api')].get(this.className); }
  }
  Baas.Query = Query;
};

