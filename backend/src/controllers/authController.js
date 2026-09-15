const bcrypt = require('bcryptjs')
const db = require('../config/db')
const { signToken } = require('../middlewares/authMiddleware')
const { ok, fail } = require('../utils/response')
const asyncHandler = require('../utils/asyncHandler')

const PUBLIC_FIELDS = 'id, username, role, created_at'

const sanitize = (user) => {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

exports.register = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return fail(res, '用户名和密码不能为空')
  if (String(password).length < 6) return fail(res, '密码至少 6 位')

  const exist = await db.get('SELECT id FROM users WHERE username = ?', [username])
  if (exist) return fail(res, '用户名已被占用', 409)

  const hash = bcrypt.hashSync(String(password), 10)
  const { id } = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash])
  const user = await db.get(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [id])

  ok(res, { token: signToken(user), user: sanitize(user) }, '注册成功')
})

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return fail(res, '用户名和密码不能为空')

  const user = await db.get('SELECT * FROM users WHERE username = ?', [username])
  if (!user || !bcrypt.compareSync(String(password), user.password)) {
    return fail(res, '用户名或密码错误', 401)
  }

  ok(res, { token: signToken(user), user: sanitize(user) }, '登录成功')
})

exports.me = asyncHandler(async (req, res) => {
  const user = await db.get(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [req.userId])
  if (!user) return fail(res, '用户不存在', 404)
  ok(res, sanitize(user))
})
