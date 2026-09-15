#!/usr/bin/env node
/**
 * 清理构建产物与依赖（不使用系统 rm，跨平台安全）
 * 用法: npm run clean        # 清 dist
 *       npm run clean -- all # 清 dist + node_modules
 */
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const all = process.argv.includes('all')

const targets = [path.join(root, 'frontend', 'dist')]
if (all) {
  targets.push(path.join(root, 'frontend', 'node_modules'))
  targets.push(path.join(root, 'backend', 'node_modules'))
}

for (const t of targets) {
  if (fs.existsSync(t)) {
    fs.rmSync(t, { recursive: true, force: true })
    console.log(`removed: ${t}`)
  }
}
console.log('✅ 清理完成')
