'use strict';

const transformResponse = require('./utils').transformResponse;

function InvalidParamsError(message) {
  this.name = 'INVALID_PARMAS';
  this.message = message || '参数不合法';
}

module.exports = Baas => {
  Baas.Object = function({ tableName, _id, data = {} }) {
    if (_id) this._id = _id;
    if (!tableName) throw new InvalidParamsError('tableName 不能为空');
    if (typeof tableName !== 'string' || !tableName.trim()) throw new InvalidParamsError(`非法的 tableName：${tableName}`);
    this.tableName = tableName;
    this.$model = data;
  };
  Baas.Object.fetchAll = (objs) => {
    objs.forEach(obj => { if (!(obj instanceof Baas.Object)) throw new InvalidParamsError(`obj: ${JSON.stringify(obj) } 不是一个合法的 Baas.Object 实例`); });
    return Baas.api.batch(objs.map(obj => {
      return {
        method: 'queryRecord',
        id: obj._id,
        tableName: obj.tableName
      };
    })).then(({ data }) => transformResponse(this.tableName, data));
  };
  Baas.Object.prototype.set = function(key, value) {
    if (value instanceof Baas.Object) {
      const { tableName, _id } = value;
      this.$model[key] = { __type: 'Pointer', tableName, _id };
    } else {
      this.$model[key] = value;
    }
    return this;
  };
  Baas.Object.prototype.get = function(key) {
    if (typeof key !== 'string') throw new InvalidParamsError('key 不能为空');
    if (!Reflect.has(this.$model, key)) throw new InvalidParamsError('key 不存在');
    return this.$model[key];
  };
  Baas.Object.prototype.fetch = function() {
    const { _id } = this;
    if (!_id) throw new InvalidParamsError('资源需要通过 _id 属性获取');
    return Baas.api.get(`/tables/${this.tableName}/${_id}`)
      .then(({ data }) => transformResponse(this.tableName, data))
      .then(data => {
        this.$model = data.$model;
        return data;
      });
  };
  Baas.Object.prototype.save = function() {
    const method = this._id ? 'patch' : 'post';
    return Baas.api[method](`/tables/${this.tableName + (this._id ? '/' + this._id : '')}`, this.$model).then(({ data }) => transformResponse(this.tableName, data));
  };
  Baas.Object.prototype.destroy = function() {
    const { _id } = this;
    if (!_id) throw new InvalidParamsError('_id 属性不能为空');
    return Baas.api.delete(`/tables/${this.tableName}/${_id}`).then(({ data }) => transformResponse(this.tableName, data));
  };
  Baas.Object.prototype.clone = function() {
    const { tableName, $model } = this;
    const data = Object.assign({}, $model);
    return new Baas.Object({ tableName, data });
  };
  Baas.Object.prototype.toJSON = function() {
    const data = Object.assign({}, this.$model);
    const { _id } = this;
    if (_id) data._id = _id;
    return JSON.stringify(data);
  };
};

