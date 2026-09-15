/** 包装 async 路由，自动把异常转交错误中间件 */
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
