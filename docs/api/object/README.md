# Baas.Object

BaaS 系统中数据的最小单元，映射到数据库中的一条记录。

## Constructor

**参数**

| 名字 | 类型 | 详细 |
| ---- | ---- | ------ |
| tableName | string | 指定 table 表 |
| data | object | 可选参数，设置 Object 的值 |

```js
new Baas.Object({
  tableName: 'todo',
  data: {
    title: 'Hello World',
    done: false
  }
});
```

**返回**

`Type: Baas.Object`

## set

设置 Object 对象数据集上的值。

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo.set('done', true);
```

**返回**

`Type: Baas.Object`

## get

根据 key 获取 Object 对象数据集上的值。

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo.set('done', true);

todo.get('done') // true
```

**返回**

`Type: Any`

## fetch

根据 `_id` 从服务端获取单条记录。

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo.fetch().then(() => alert('数据获取成功！'));
```

**返回**

`Type: Object`

## save

根据是否存在 `_id` 属性进行更新或者新建操作。

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo.set('done', true);
todo.save().then(() => alert('数据更新成功！'));

const todo = new Baas.Object({ tableName: 'todo' });
todo.set('title', 'Hello World');
todo.save().then(() => alert('数据创建成功！'));
```

## destroy

根据 `_id` 删除对应记录。

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo.destroy().then(() => alert('删除数据成功！'));
```

## clone

复制一个 Baas.Object 实例对象的数据

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo.set('done', true);

const newTodo = todo.clone();
newTodo.toJSON(); // { "done": true }
```

<p class="tip">clone 出来的对象不会继承原对象的 `_id` 属性</p>

## toJSON

返回一个 Baas.Object 的 JSON 数据

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo
  .set('name', 'use BaaS')
  .set('done', true);
todo.toJSON(); // { "_id": "59001b05a92424303cb240a9", "name": 'use BaaS', "done": true }
```

## inc

为某个 key 增加或减少一定的值，常用在点赞、UV/PV 访问量、计数器等场景，这个操作是原子级的，避免多点并发请求同一资源带来的问题。

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo.inc('likes', -1);
todo.save();
```

