# BaaS JSSDK

JavaScript SDK for BaaS

## 安装

### npm 安装

```js
// through npm
npm i baas-jssdk -S

// or yarn
yarn add baas-jssdk
```

### CDN

```html
<script src="//github.elemecdn.com/eleme/baas-jssdk/0.0.17/dist/baas-jssdk.min.js"></script>
```

## Hello World

<p class="warning">在开始之前请确保您已经在后台配置好应用和表结构</p>

```js
import Baas from 'baas-jssdk';

// 为 SDK 指定一个目标 App
Baas.init({ appId: '59001b05a92424303cb240a9' });
// 在 `todo` 表中创建一条记录
const todo = new Baas.Object({ tableName: 'todo' });

todo.set('name', 'Hello World');
todo.set('done', false);

// 或者
// const todo = new Baas.Object({
//   tableName: 'todo',
//   data: { name: 'Hello World', done: false }
// });

todo.save().then(() => {
  alert('Voila!');
});
```

## Changelog

- 2017.5.5 baas-jssdk releases 0.0.1! 🐣


