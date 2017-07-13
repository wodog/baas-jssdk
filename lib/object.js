'use strict';

var transformResponse = require('./utils').transformResponse;

function InvalidParamsError(message) {
  this.name = 'INVALID_PARMAS';
  this.message = message || '参数不合法';
}

function deepCopy(target) {
  var result = {};
  if (target == null) return target; // eslint-disable-line eqeqeq
  if (typeof target !== 'object') return target;
  if (target instanceof Array) return target.concat([]);
  for (var key in target) {
    if (!target.hasOwnProperty(key)) return;
    if (target instanceof Array) {
      result[key] = target.map(function(item) { return deepCopy(item); });
    } else {
      result[key] = deepCopy(target[key]);
    }
  }
}

module.exports = function(Baas) {
  Baas.Object = function(params) {
    var tableName = params.tableName;
    var _id = params._id;
    var data = params.data || {};
    if (_id) this._id = _id;
    if (!tableName) throw new InvalidParamsError('tableName 不能为空');
    if (typeof tableName !== 'string' || !tableName.trim()) throw new InvalidParamsError('非法的 tableName：' + tableName);
    this.tableName = tableName;
    this.$model = data;
  };
  Baas.Object.fetchAll = function(objs) {
    var tableName = this.tableName;
    objs.forEach(function(obj) { if (!(obj instanceof Baas.Object)) throw new InvalidParamsError('obj: ' + JSON.stringify(obj) + ' 不是一个合法的 Baas.Object 实例'); });
    return Baas.api.batch(objs.map(function(obj) {
      return {
        method: 'queryRecord',
        id: obj._id,
        tableName: obj.tableName
      };
    })).then(function(res) { return transformResponse(tableName, res.data); });
  };
  Baas.Object.prototype.set = function(key, value) {
    if (value instanceof Baas.Object) {
      var tableName = value.tableName;
      var _id = value._id;
      this.$model[key] = { __type: 'Pointer', tableName: tableName, _id: _id };
    } else {
      this.$model[key] = value;
    }
    return this;
  };
  Baas.Object.prototype.get = function(key) {
    if (typeof key !== 'string') throw new InvalidParamsError('key 不能为空');
    if (!this.$model.hasOwnProperty(key)) throw new InvalidParamsError('key: ' + key + ' 不存在');
    return this.$model[key];
  };
  Baas.Object.prototype.fetch = function() {
    var _id = this._id;
    var tableName = this.tableName;
    var self = this;
    if (!_id) throw new InvalidParamsError('资源需要通过 _id 属性获取');
    return Baas.api.get('/tables/' + tableName + '/' + _id)
      .then(function(res) { return transformResponse(tableName, res.data); })
      .then(function(data) {
        self.$model = data.$model;
        return data;
      });
  };
  Baas.Object.prototype.save = function() {
    var method = this._id ? 'patch' : 'post';
    var tableName = this.tableName;
    return Baas.api[method]('/tables/' + tableName + (this._id ? '/' + this._id : ''), this.$model).then(function(res) { return transformResponse(tableName, res.data); });
  };
  Baas.Object.prototype.destroy = function() {
    var _id = this._id;
    var tableName = this.tableName;
    if (!_id) throw new InvalidParamsError('_id 属性不能为空');
    return Baas.api.delete('/tables/' + tableName + '/' + _id).then(function(res) { return transformResponse(tableName, res.data); });
  };
  Baas.Object.prototype.clone = function() {
    var tableName = this.tableName;
    var $model = this.$model;
    var data = deepCopy($model);
    return new Baas.Object({ tableName: tableName, data: data });
  };
  Baas.Object.prototype.toJSON = function() {
    var data = deepCopy(this.$model);
    var _id = this._id;
    if (_id) data._id = _id;
    return JSON.stringify(data);
  };
  Baas.Object.prototype.inc = function(key, value) {
    if (!key) throw new Error('参数不能为空');
    if (isNaN(value)) throw new Error('inc 的值必须是 Number 类型');
    this.$model.$inc = this.$model.$inc || {};
    this.$model.$inc[key] = value;
  };
};

