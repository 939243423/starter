#!/usr/bin/env node
/**
 * 一键安装依赖：根目录 -> frontend -> backend
 * 用法: npm run setup  (或 npm run setup -- --fresh 重新安装)
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const fresh = process.argv.includes('--fresh')
// 透传 --ignore-scripts：sqlite3 预编译包下载困难时可用（需先手动放置 sqlite3 目录）
const extraArgs = process.argv.includes('--ignore-scripts') ? ['--ignore-scripts'] : []

const run = (cmd, args, cwd, label) =>
  new Promise((resolve, reject) => {
    console.log(`\n> [${label}] ${cmd} ${args.join(' ')}`)
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' })
    child.on('error', reject)
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${label} 退出码 ${code}`))
    )
  })

const install = async (dir, label) => {
  const cwd = path.join(root, dir)
  if (fresh) {
    const { rmSync } = await import('node:fs')
    rmSync(path.join(cwd, 'node_modules'), { recursive: true, force: true })
  }
  await run('npm', ['install', '--no-audit', '--no-fund', ...extraArgs], cwd, label)
}

try {
  await install('frontend', 'frontend')
  await install('backend', 'backend')
  console.log('\n✅ 依赖安装完成。执行 npm run dev 启动（前端 5173 / 后端 3000）')
} catch (err) {
  console.error(`\n❌ ${err.message}`)
  if (err.message.includes('backend')) {
    console.error(`
常见原因：sqlite3 的预编译二进制从 GitHub 下载，网络不好会卡住或失败。可尝试：
  1) 设置镜像后重试
     npm config set sqlite3_binary_host_mirror https://npmmirror.com/mirrors/sqlite3
  2) 本地编译（需要 C++ 工具链）
     cd backend && npm rebuild sqlite3 --build-from-source
  3) 复制其他项目已装好的 node_modules/sqlite3 后执行
     npm run setup -- --ignore-scripts`)
  }
  process.exit(1)
}
