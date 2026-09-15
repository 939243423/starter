require('dotenv').config()

const express = require('express')
const cors = require('cors')
const env = require('./config/env')
const routes = require('./routes')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const upload = require('./middlewares/uploadMiddleware')
const securityHeaders = require('./middlewares/securityHeaders')

require('./config/db') // 初始化并连接 SQLite

const app = express()

app.use(securityHeaders)
app.use(cors({ origin: env.corsOrigin }))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))
app.use('/uploads', express.static(env.uploadDir))

// 文件上传示例：POST /api/upload （字段名 file）
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ code: 1, message: '未收到文件' })
  res.json({ code: 0, message: 'ok', data: { url: `/uploads/${req.file.filename}` } })
})

app.use('/api', routes)

app.use('/api', notFound)
app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`[server] 已启动: http://localhost:${env.port}  (${env.nodeEnv})`)
})
