'use strict';

function RequiredParamsError(message) {
  this.name = 'REQUIRED_PARAMS';
  this.message = message;
}

function InvalidParamsError(message) {
  this.name = 'INVALID_PARAMS';
  this.message = message;
}

RequiredParamsError.prototype = Object.create(Error.prototype);
InvalidParamsError.prototype = Object.create(Error.prototype);

module.exports = function(Baas) {
  Baas.sendEmail = function(params) {
    if (!params) throw new InvalidParamsError('参数不能为空');
    ['message', 'receivers', 'subject'].forEach(function(key) {
      if (!params[key]) throw new RequiredParamsError(key + ': 不能为空');
      switch (key) {
        case 'receivers':
          if (!(params[key] instanceof Array)) throw new InvalidParamsError('receivers 必须是数组');
          if (!params[key].length) throw new InvalidParamsError('receivers 不能为空');
          break;
        default:
          if (!params[key].trim()) throw new RequiredParamsError(key + ': 不能为空');
      }
    });
    return Baas.api.post('/email', params).then(function(res) { return res.data; });
  };
};

