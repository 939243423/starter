require('dotenv').config()

const path = require('node:path')

const DEFAULT_SECRET = 'dev_secret_please_change'

const raw = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || DEFAULT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  dbFile: process.env.DB_FILE || path.resolve(__dirname, '../../data/app.db'),
  uploadDir: path.resolve(__dirname, '../../uploads'),
}

raw.isProd = raw.nodeEnv === 'production'

// 生产环境不得使用默认密钥，否则任何人都能伪造 token
if (raw.isProd && raw.jwtSecret === DEFAULT_SECRET) {
  console.error('[env] 生产环境必须设置 JWT_SECRET（当前仍为默认值），服务已拒绝启动。')
  process.exit(1)
}

/** 集中管理环境变量，缺失时给出兜底值 */
module.exports = raw
