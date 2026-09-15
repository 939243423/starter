const jwt = require('jsonwebtoken')
const env = require('../config/env')

const readToken = (req) => {
  const header = req.headers.authorization || ''
  const [type, value] = header.split(' ')
  return type === 'Bearer' ? value : header || null
}

/** 强制登录：无 token / token 失效直接 401|403 */
const verifyToken = (req, res, next) => {
  const token = readToken(req)
  if (!token) return res.status(403).json({ message: '缺少访问令牌' })

  jwt.verify(token, env.jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ message: '令牌无效或已过期' })
    req.userId = decoded.id
    req.userRole = decoded.role
    req.isGuest = false
    next()
  })
}

/** 游客友好：无 token 也放行，标记 req.isGuest = true */
const flexibleToken = (req, res, next) => {
  const token = readToken(req)
  if (!token) {
    req.isGuest = true
    return next()
  }
  jwt.verify(token, env.jwtSecret, (err, decoded) => {
    if (err) {
      req.isGuest = true
    } else {
      req.userId = decoded.id
      req.userRole = decoded.role
      req.isGuest = false
    }
    next()
  })
}

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: '需要管理员权限' })
  next()
}

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

module.exports = { verifyToken, flexibleToken, isAdmin, signToken }
