'use strict';

var Baas = require('./baas');

require('./object')(Baas);
require('./query')(Baas);
require('./file')(Baas);

module.exports = Baas;

