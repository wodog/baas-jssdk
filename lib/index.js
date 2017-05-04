'use strict';

const Baas = require('./baas');

require('./object')(Baas);
require('./api')(Baas);
require('./query')(Baas);

module.exports = Baas;

