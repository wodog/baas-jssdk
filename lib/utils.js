'use strict';

const Baas = require('./baas');

module.exports.transformResponse = (tableName, data) => {
  if (data instanceof Array) return data.map(item => new Baas.Object({ data: item, _id: item._id, tableName }));
  return new Baas.Object({ data, _id: data._id, tableName });
};

