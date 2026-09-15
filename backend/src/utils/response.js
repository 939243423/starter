/** 统一成功响应: { code: 0, data } */
const ok = (res, data = null, message = 'ok') => res.json({ code: 0, message, data })

/** 统一失败响应: { code: 1, message } */
const fail = (res, message = '请求失败', status = 400) =>
  res.status(status).json({ code: 1, message, data: null })

const created = (res, data, message = '创建成功') => res.status(201).json({ code: 0, message, data })

module.exports = { ok, fail, created }
