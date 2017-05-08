'use strict';

class InvalidParamsError {
  constructor(message) {
    this.name = 'INVALID_PARMAS';
    this.message = message || '参数不合法';
  }
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
    return Baas[Symbol.for('api')].batch(objs.map(obj => {
      return {
        method: 'queryRecord',
        id: obj._id,
        tableName: obj.tableName
      };
    }));
  };
  Baas.Object.prototype.set = function(key, value) {
    this.$model[key] = value;
    return this.$model;
  };
  Baas.Object.prototype.get = function(key) {
    if (typeof key !== 'string') throw new InvalidParamsError('key 不能为空');
    if (!Reflect.has(this.$model, key)) throw new InvalidParamsError('key 不存在');
    return this.$model[key];
  };
  Baas.Object.prototype.fetch = function() {
    const { _id } = this;
    if (!_id) throw new InvalidParamsError('资源需要通过 _id 属性获取');
    return Baas[Symbol.for('api')].get(this.tableName + `/${_id}`).then(data => {
      this.$model = data.$model;
      return data;
    });
  };
  Baas.Object.prototype.save = function() {
    const { _id } = this;
    if (_id) {
      return Baas[Symbol.for('api')].patch(this.tableName + `/${_id}`, this.$model);
    } else {
      return Baas[Symbol.for('api')].post(this.tableName, this.$model);
    }
  };
  Baas.Object.prototype.destroy = function() {
    const { _id } = this;
    if (!_id) throw new InvalidParamsError('_id 属性不能为空');
    return Baas[Symbol.for('api')].delete(this.tableName + `/${_id}`);
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

