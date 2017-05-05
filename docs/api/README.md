# Baas

BaaS SDK 全局对象

## init

为 SDK 指定 API 环境及设置 appId

<p class="tip">目前支持的环境有 alpha/beta/prod</p>

**参数**

| 名字 | 类型 | 详细 |
| ---- | ---- | ------ |
| env | string | 只能使用 alpha/beta/prod，默认是 prod |
| appId | string | 指定操作的 app |

```js
Baas.init({
  env: 'prod',
  appId: '58b6741a918d885ae123a948'
})
```

**返回**

`void`

