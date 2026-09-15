#!/usr/bin/env node
/**
 * 并行启动开发服务
 * 用法: npm run dev          # 前后端一起
 *       npm run dev:web      # 仅前端
 *       npm run dev:api      # 仅后端
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
import net from 'node:net'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const only = process.argv[2] // web | api | undefined

const COLORS = { web: '\x1b[36m', api: '\x1b[35m', reset: '\x1b[0m' }

const targets = []
if (!only || only === 'web') targets.push({ dir: 'frontend', cmd: 'dev', label: 'web', color: COLORS.web })
if (!only || only === 'api') targets.push({ dir: 'backend', cmd: 'dev', label: 'api', color: COLORS.api })

/** 读取后端端口（.env 优先，默认 3000） */
const readApiPort = () => {
  for (const f of ['.env', '.env.local', 'backend/.env']) {
    const file = path.join(root, f)
    if (fs.existsSync(file)) {
      const m = fs.readFileSync(file, 'utf-8').match(/^PORT\s*=\s*(\d+)/m)
      if (m) return Number(m[1])
    }
  }
  return 3000
}

const isPortBusy = (port) =>
  new Promise((resolve) => {
    const srv = net.createServer()
    srv.once('error', () => resolve(true))
    srv.once('listening', () => srv.close(() => resolve(false)))
    srv.listen(port, '127.0.0.1')
  })

// 启动前体检：端口占用是最常见的"起来了但用不了"原因
const checks = []
if (!only || only === 'api') checks.push(['api', readApiPort()])
if (!only || only === 'web') checks.push(['web', 5173])

for (const [label, port] of checks) {
  if (await isPortBusy(port)) {
    console.warn(
      `\n⚠️  ${label} 端口 ${port} 已被占用，服务可能启动失败。` +
        (label === 'api'
          ? `\n   改端口：编辑 .env 的 PORT（同时同步 frontend/vite.config.js 的 proxy 目标）`
          : `\n   改端口：编辑 frontend/vite.config.js 的 server.port`) +
        `\n   或先停掉占用该端口的进程后重试。\n`
    )
  }
}

const children = []

const start = ({ dir, cmd, label, color }) => {
  const child = spawn('npm', ['run', cmd], {
    cwd: path.join(root, dir),
    shell: process.platform === 'win32',
    env: { ...process.env, FORCE_COLOR: '1' },
  })
  const pipe = (stream, out) => {
    stream.setEncoding('utf-8')
    stream.on('data', (chunk) => {
      chunk
        .split(/\r?\n/)
        .filter((l) => l.trim())
        .forEach((line) => out.write(`${color}[${label}]${COLORS.reset} ${line}\n`))
    })
  }
  pipe(child.stdout, process.stdout)
  pipe(child.stderr, process.stderr)
  child.on('exit', (code) => {
    console.log(`${color}[${label}]${COLORS.reset} 进程退出 (code=${code})，关闭其它服务...`)
    children.forEach((c) => c.pid !== child.pid && c.kill())
    process.exit(code ?? 0)
  })
  children.push(child)
}

targets.forEach(start)

const shutdown = () => {
  children.forEach((c) => c.kill())
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
