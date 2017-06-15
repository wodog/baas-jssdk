'use strict';

var Baas = require('./baas');

module.exports.transformResponse = function(tableName, data) {
  if (data instanceof Array) return data.map(function(item) { return new Baas.Object({ data: item, _id: item._id, tableName: tableName }); });
  return new Baas.Object({ data: data, _id: data._id, tableName: tableName });
};

