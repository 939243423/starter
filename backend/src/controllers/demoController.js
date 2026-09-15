const db = require('../config/db')
const { ok, fail, created } = require('../utils/response')
const asyncHandler = require('../utils/asyncHandler')

/** 示例资源：列表公开，写入/删除需登录 */
exports.list = asyncHandler(async (req, res) => {
  const rows = await db.all(
    `SELECT i.id, i.title, i.created_at, u.username
     FROM items i LEFT JOIN users u ON u.id = i.user_id
     ORDER BY i.id DESC LIMIT 50`
  )
  ok(res, rows)
})

exports.create = asyncHandler(async (req, res) => {
  const title = String(req.body?.title || '').trim()
  if (!title) return fail(res, 'title 不能为空')

  const { id } = await db.run('INSERT INTO items (title, user_id) VALUES (?, ?)', [title, req.userId])
  const item = await db.get('SELECT id, title, created_at FROM items WHERE id = ?', [id])
  created(res, item)
})

exports.remove = asyncHandler(async (req, res) => {
  const { changes } = await db.run('DELETE FROM items WHERE id = ?', [req.params.id])
  if (!changes) return fail(res, '资源不存在', 404)
  ok(res, null, '删除成功')
})
