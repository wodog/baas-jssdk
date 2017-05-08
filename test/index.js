'use strict';

const test = require('ava');
const axios = require('axios');
const appId = '59001b05a92424303cb240a9';
const tableName = 'todo';;
const Baas = require('..');

axios.interceptors.response.use(() => {
}, error => {
  const { path, method } = error.response.request;
  const url = path.split('?')[0];
  if (method.toLowerCase() === 'get' && url.endsWith(tableName)) {
    return Promise.resolve([]);
  } else {
    return Promise.resolve({});
  }
});

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

test('Baas.Object instance `set` methodl should set value on $model', t => {
  const todo = new Baas.Object({ tableName });
  const name = 'baas-test';
  todo.set('name', name);
  t.is(todo.$model.name, name);
});

test('Baas.Object instance `get` method should return Object property', t => {
  const todo = new Baas.Object({ tableName });
  const name = 'baas-test';
  todo.set('name', name);
  t.is(todo.get('name'), name);
});

test('Baas.Object instance `clone` method should return deepCopy of Object', t => {
  const todo = new Baas.Object({ tableName });
  const name = 'baas-test';
  todo.set('name', name);
  const clonedTodo = todo.clone();
  t.is(clonedTodo.get('name'), todo.get('name'));
  t.deepEqual(clonedTodo, todo);
});

test('Baas.Object instance `fetch` method should return resource based on `_id`', async t => {
  const todo = new Baas.Object({ tableName });
  todo._id = '590fec82038e2f362c1a9fb6';
  await todo.fetch();
  t.pass();
});

test('Baas.Object instance `save` method should send post request', async t => {
  const todo = new Baas.Object({ tableName });
  todo.set('name', 'baas-test');
  await todo.save();
  t.pass();
});

test('Baas.Object instance `save` method with _id property', async t => {
  const todo = new Baas.Object({ tableName });
  todo._id = '590fec82038e2f362c1a9fb6';
  todo.set('name', 'baas-test');
  await todo.save();
  t.pass();
});

test('Baas.Object instance `destroy` method with _id property', async t => {
  const todo = new Baas.Object({ tableName });
  todo._id = '590fec82038e2f362c1a9fb6';
  await todo.destroy();
  t.pass();
});

