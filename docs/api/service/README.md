# Baas.sendEmail

**参数**

| 名字 | 类型 | 详细 |
| ---- | ---- | ------ |
| subject | string | 邮件主题 |
| message | string | 邮件内容 |
| receivers | Array | 接收邮箱 |

```js
Baas.sendEmail({
  subject: 'BaaS 测试',
  message: '这是一封测试邮件',
  receivers: ['fe@ele.me']
})
```
