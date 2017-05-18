'use strict';

class InvalidParamsError {
  constructor(message) {
    this.name = 'INVALID_PARMAS';
    this.message = message || '参数不合法';
  }
}

module.exports = Baas => {
  class Query {
    constructor(tableName) {
      if (tableName == null) throw new InvalidParamsError('tableName 不能为空'); // eslint-disable-line eqeqeq
      if (typeof tableName !== 'string') throw new InvalidParamsError(`tableName 必须是字符串而非: ${typeof tableName}`);
      this.tableName = tableName;
      this.queryBuilder = Object.create(null);
    }
    find(query) { return Baas.api.get(`/tables/${this.tableName}`, { params: query || this.queryBuilder }); }
    get(id) {
      if (!id) throw new InvalidParamsError('id 不能为空');
      return Baas.api.get(`/tables/${this.tableName}/${id}`);
    }
    equalTo(key, value) {
      this.queryBuilder[key] = value;
      return this;
    }
    count() { return Baas.api.get(`/tables/${this.tableName}/count`); }
  }
  Baas.Query = Query;
};

