'use strict';

const Baas = require('./baas');

require('./object')(Baas);
require('./query')(Baas);

module.exports = Baas;

