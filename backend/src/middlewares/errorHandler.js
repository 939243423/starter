/** 404 */
const notFound = (req, res) => res.status(404).json({ code: 1, message: `接口不存在: ${req.method} ${req.path}` })

/** 统一错误处理：生产环境不回传堆栈 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  console.error(`[error] ${req.method} ${req.path} ->`, err.message)
  res.status(status).json({
    code: 1,
    message: status === 500 ? '服务器内部错误' : err.message,
    ...(process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }),
  })
}

module.exports = { notFound, errorHandler }
