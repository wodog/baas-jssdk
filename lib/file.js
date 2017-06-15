'use strict';

var transformResponse = require('./utils').transformResponse;

function InvalidParamsError(message) {
  this.name = 'INVALID_PARMAS';
  this.message = message || '参数不合法';
}

module.exports = function(Baas) {
  Baas.File = function(tableName, file) {
    if (!tableName) throw new InvalidParamsError('tableName 不能为空');
    if (!(file instanceof Blob)) throw new InvalidParamsError('参数必须是一个 Blob 文件');
    this.tableName = tableName;
    this.file = file;
    this.name = file.name;
  };
  Baas.File.prototype.metaData = function(key) {
    if (key) return this.file[key];
    return this.file;
  };
  Baas.File.prototype.save = function(options) {
    options = options || {};
    var onProgress = options.onProgress;
    var fd = new FormData();
    var tableName = this.tableName;
    fd.append('file', this.file);
    return Baas.api.post('/tables/' + tableName + '/file', {
      data: fd,
      onUploadProgress: onProgress || function() {}
    }).then(function(res) { return transformResponse(tableName, res.data); });
  };
};

