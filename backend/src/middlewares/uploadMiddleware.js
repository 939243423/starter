const multer = require('multer')
const path = require('node:path')
const crypto = require('node:crypto')
const fs = require('node:fs')
const env = require('../config/env')

if (!fs.existsSync(env.uploadDir)) fs.mkdirSync(env.uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    const ext = path.extname(file.originalname).toLowerCase()
    cb(allowed.includes(ext) ? null : new Error('不支持的文件类型'), allowed.includes(ext))
  },
})

module.exports = upload
