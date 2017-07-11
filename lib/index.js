'use strict';

var Baas = require('./baas');

require('./object')(Baas);
require('./query')(Baas);
require('./file')(Baas);
require('./service')(Baas);

module.exports = Baas;

