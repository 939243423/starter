/**
 * 基础安全响应头（不引第三方依赖，等价于 helmet 的最小子集）
 * 需要 CSP / HSTS 等更强策略时请自行追加
 */
const securityHeaders = (req, res, next) => {
  res.removeHeader('X-Powered-By') // 不暴露 Express
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  next()
}

module.exports = securityHeaders
