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

`Type: Object`

## set

设置 Object 对象数据集上的值。

```js
const todo = new Baas.Object({ tableName: 'todo' });
todo._id = '59001b05a92424303cb240a9';
todo.set('done', true);
```

**返回**

`void`

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
