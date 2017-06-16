'use strict';

var transformResponse = require('./utils').transformResponse;

function InvalidParamsError(message) {
  this.name = 'INVALID_PARMAS';
  this.message = message || '参数不合法';
}

module.exports = function(Baas) {
  function Query(tableName) {
    if (tableName == null) throw new InvalidParamsError('tableName 不能为空'); // eslint-disable-line eqeqeq
    if (typeof tableName !== 'string') throw new InvalidParamsError('tableName 必须是字符串而非: ' + typeof tableName);
    this.tableName = tableName;
    this.queryBuilder = {};
  }
  Query.prototype.find = function(query) {
    var tableName = this.tableName;
    return Baas.api.get('/tables/' + tableName, {
      params: { query: query || this.queryBuilder }
    }).then(function(res) {
      return transformResponse(tableName, res.data);
    });
  };
  Query.prototype.get = function(id) {
    var tableName = this.tableName;
    if (!id) throw new InvalidParamsError('id 不能为空');
    return Baas.api.get('/tables/' + tableName + '/' + id).then(function(res) {
      return transformResponse(tableName, res.data);
    });
  };
  Query.prototype.equalTo = function(key, value) {
    this.queryBuilder[key] = value;
    return this;
  };
  Query.prototype.lessThan = function(key, value) {
    this.queryBuilder[key] = { '$lt': value };
    return this;
  };
  Query.prototype.limit = function(value) {
    this.queryBuilder['$limit'] = value;
    return this;
  };
  Query.prototype.skip = function(value) {
    this.queryBuilder['$skip'] = value;
    return this;
  };
  Query.prototype.sort = function(value) {
    this.queryBuilder['$sort'] = value;
    return this;
  };
  Query.prototype.count = function(query) {
    return Baas.api.get('/tables/' + this.tableName + '/count', {
      params: { query: query || this.queryBuilder }
    }).then(function(res) { return res.data; });
  };
  Baas.Query = Query;
};

