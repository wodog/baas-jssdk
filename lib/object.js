'use strict';

class InvalidParamsError {
  constructor(message) {
    this.name = 'INVALID_PARMAS';
    this.message = message || '参数不合法';
  }
}

module.exports = Baas => {
  Baas.Object = function({ tableName, data = {} }) {
    this.tableName = tableName;
    this.$model = data;
  };
  Baas.Object.extend = (tableName) => new Baas.Object({ tableName });
  Baas.Object.prototype.set = function(key, value) { this.$model[key] = value; };
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
    if (!_id) throw new InvalidParamsError('Object 不存在');
    return Baas[Symbol.for('api')].delete(this.tableName + `/${_id}`);
  };
};

