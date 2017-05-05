'use strict';

const test = require('ava');
const appId = '59001b05a92424303cb240a9';
const Baas = require('..');

test('Baas.init set correct env && appId', t => {
  Baas.init({ appId });
  t.is(Baas.appId, appId);
});

test('Baas.init should use `prod` as default env', t => {
  Baas.init({ appId });
  t.is(Baas.env, 'prod');
});

test('Baas.init should throw when no appId is passed', t => {
  t.throws(Baas.init.bind(Baas));
});

test('Baas.init should throw when env besides alpha/beta/prod is passed', t => {
  t.throws(() => Baas.init({ appId, env: 'baas' }));
});

