#!/usr/bin/env node
/**
 * 基于当前架子生成一个全新的应用 / 游戏项目
 *
 * 用法（在架子根目录执行）:
 *   npm run create -- my-game
 *   npm run create -- my-game --target D:\ai\apps\my-game
 *   npm run create -- my-game --title "我的小游戏" --force
 */
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATE_ROOT = path.resolve(here, '..')

const args = process.argv.slice(2)
const positional = args.filter((a) => !a.startsWith('--'))
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : undefined
}

const name = positional[0]
if (!name) {
  console.error('❌ 缺少项目名。用法: npm run create -- <project-name> [--target <dir>]')
  process.exit(1)
}
if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
  console.error('❌ 项目名只能包含字母、数字、点、下划线和中划线')
  process.exit(1)
}

const targetArg = flag('target')
const target = path.resolve(typeof targetArg === 'string' ? targetArg : path.join(process.cwd(), name))
const title = typeof flag('title') === 'string' ? flag('title') : name
const force = flag('force') === true

if (target === TEMPLATE_ROOT || target.startsWith(TEMPLATE_ROOT + path.sep)) {
  console.error('❌ 目标目录不能位于架子内部（会递归复制）')
  process.exit(1)
}
if (fs.existsSync(target) && fs.readdirSync(target).length > 0 && !force) {
  console.error(`❌ 目标目录已存在且非空: ${target}\n   加 --force 覆盖，或换一个目录`)
  process.exit(1)
}

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vite', '.cache', 'coverage'])
const SKIP_FILES = new Set(['_bootstrap_dirs.py', '.DS_Store', 'Thumbs.db'])

const copy = (src, dest) => {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src)) {
      if (SKIP_DIRS.has(entry) || SKIP_FILES.has(entry)) continue
      copy(path.join(src, entry), path.join(dest, entry))
    }
    return
  }
  if (SKIP_FILES.has(path.basename(src))) return
  // 跳过本地数据库文件（保留 .gitkeep）
  if (/\.db(-journal|-wal|-shm)?$/.test(src)) return
  fs.copyFileSync(src, dest)
}

fs.mkdirSync(target, { recursive: true })
copy(TEMPLATE_ROOT, target)

// 改名：根 / 前端 / 后端 package.json
const patchJson = (relPath, mutate) => {
  const file = path.join(target, relPath)
  if (!fs.existsSync(file)) return
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'))
  mutate(json)
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf-8')
}
patchJson('package.json', (j) => (j.name = name))
patchJson('frontend/package.json', (j) => (j.name = `${name}-frontend`))
patchJson('backend/package.json', (j) => (j.name = `${name}-backend`))

// 改标题：index.html
const htmlFile = path.join(target, 'frontend', 'index.html')
if (fs.existsSync(htmlFile)) {
  let html = fs.readFileSync(htmlFile, 'utf-8')
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${title}$2`)
  fs.writeFileSync(htmlFile, html, 'utf-8')
}

// 生成 .env
const envExample = path.join(target, '.env.example')
if (fs.existsSync(envExample) && !fs.existsSync(path.join(target, '.env'))) {
  fs.copyFileSync(envExample, path.join(target, '.env'))
  // 随机化默认 JWT 密钥，避免沿用示例值
  const crypto = await import('node:crypto')
  const envFile = path.join(target, '.env')
  const content = fs
    .readFileSync(envFile, 'utf-8')
    .replace('change_me_to_a_random_string', crypto.randomBytes(24).toString('hex'))
  fs.writeFileSync(envFile, content, 'utf-8')
}

console.log(`\n✅ 新项目已生成: ${target}`)
console.log(`\n下一步:`)
console.log(`  cd "${target}"`)
console.log(`  npm run setup   # 安装前后端依赖`)
console.log(`  npm run dev     # 前端 http://localhost:5173  |  后端 http://localhost:3000`)
