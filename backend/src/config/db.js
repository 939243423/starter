// sqlite3 是原生模块：装不上（缺编译环境 / Serverless 平台）时给出可行动的提示，而不是抛一堆栈
let sqlite3
try {
  sqlite3 = require('sqlite3').verbose()
} catch (err) {
  console.error('[db] 无法加载 sqlite3，原因：', err.message)
  console.error('[db] 处理建议：本机执行 `cd backend && npm install`；若为 Serverless 平台（Vercel 等）无编译环境或无持久磁盘，请改用外部数据库。')
  process.exit(1)
}
const fs = require('node:fs')
const path = require('node:path')
const env = require('./env')

const dbDir = path.dirname(env.dbFile)
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

const db = new sqlite3.Database(env.dbFile, (err) => {
  if (err) console.error('[db] 连接失败:', err.message)
  else console.log(`[db] SQLite 已连接: ${env.dbFile}`)
})

/** 字段补丁：字段已存在时静默跳过，保证旧库升级不报错 */
function ensureColumn(table, column, definition) {
  db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`, (err) => {
    if (!err) console.log(`[db] 补丁已应用: ${table}.${column}`)
  })
}

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `)

  ensureColumn('users', 'role', "TEXT DEFAULT 'user'")
  ensureColumn('users', 'created_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP')
})

/** Promise 包装：少写回调地狱 */
const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  })

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
  })

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })

// 注意：不要覆盖 db 实例自身的 all/get/run（会破坏 serialize 队列），
// 这里导出独立的 Promise 版本，内部仍调用原生实例方法。
module.exports = { db, all, get, run, ensureColumn }
