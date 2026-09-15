#!/usr/bin/env node
/**
 * 生产构建：前端 vite build + 后端依赖自检
 * 用法: npm run build
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')

const run = (cmd, args, cwd, label) =>
  new Promise((resolve, reject) => {
    console.log(`\n> [${label}] ${cmd} ${args.join(' ')}`)
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' })
    child.on('error', reject)
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${label} 退出码 ${code}`))))
  })

try {
  await run('npm', ['run', 'build'], path.join(root, 'frontend'), 'frontend')
  if (!fs.existsSync(path.join(root, 'backend', 'node_modules'))) {
    console.log('\n⚠️  backend 依赖未安装，跳过后端检查；可先执行 npm run setup')
  }
  console.log(`\n✅ 构建完成，产物: ${path.join(root, 'frontend', 'dist')}`)
} catch (err) {
  console.error(`\n❌ ${err.message}`)
  process.exit(1)
}
