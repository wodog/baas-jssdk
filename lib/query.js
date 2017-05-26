'use strict';

const transformResponse = require('./utils').transformResponse;

function InvalidParamsError(message) {
  this.name = 'INVALID_PARMAS';
  this.message = message || '参数不合法';
}

module.exports = Baas => {
  class Query {
    constructor(tableName) {
      if (tableName == null) throw new InvalidParamsError('tableName 不能为空'); // eslint-disable-line eqeqeq
      if (typeof tableName !== 'string') throw new InvalidParamsError(`tableName 必须是字符串而非: ${typeof tableName}`);
      this.tableName = tableName;
      this.queryBuilder = Object.create(null);
    }
    find(query) { return Baas.api.get(`/tables/${this.tableName}`, { params: { query: query || this.queryBuilder } }).then(({ data }) => transformResponse(this.tableName, data)); }
    get(id) {
      if (!id) throw new InvalidParamsError('id 不能为空');
      return Baas.api.get(`/tables/${this.tableName}/${id}`).then(({ data }) => transformResponse(this.tableName, data));
    }
    equalTo(key, value) {
      this.queryBuilder[key] = value;
      return this;
    }
    lessThan(key, value) {
      this.queryBuilder[key] = { '$lt': value };
      return this;
    }
    limit(value) {
      this.queryBuilder['$limit'] = value;
      return this;
    }
    skip(value) {
      this.queryBuilder['$offset'] = value;
      return this;
    }
    count(query) { return Baas.api.get(`/tables/${this.tableName}/count`, { params: { query: query || this.queryBuilder } }).then(({ data }) => data); }
  }
  Baas.Query = Query;
};

