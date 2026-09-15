# Starter — 全栈初始化模板

[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?logo=node.js)](https://nodejs.org)
[![Vue](https://img.shields.io/badge/Vue-3.4-42b883?logo=vuedotjs)](https://vuejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

生产级**全栈初始化模板**：前端 Vue 3 + Vite + Tailwind，后端 Express + SQLite + JWT，用零依赖的 Node 脚本串起来。克隆下来跑两条命令，就得到一个自带鉴权、数据库、国际化、设计系统的可用应用 —— 适合做 Web 应用，也适合做浏览器小游戏。

[English](./README.md) · [贡献指南](./CONTRIBUTING.md)

---

## 为什么用它

| | |
| --- | --- |
| **该有的都有，不该有的没有** | 路由、鉴权、数据层、i18n、换肤、Toast/Dialog、上传、Docker 全齐，但不锁定 UI 框架，依赖体积可控 |
| **一条命令搞定** | `npm run setup` 装依赖，`npm run dev` 并行起服务（带前缀日志），`npm run build` 出包 |
| **自带模板生成器** | `npm run create -- my-game` 直接复制出一个新项目（自动改包名、随机 JWT 密钥、剔除 node_modules） |
| **为游戏而生** | `useGameLoop()` 提供 rAF 主循环 + delta time + FPS，组件卸载自动销毁 |
| **是设计系统不是皮肤** | 设计令牌全部收在 CSS 变量里，换亮色/换品牌色只动一个文件 |

## 功能一览

- **前端** — Vue 3（`<script setup>`）、Vue Router 4（含鉴权守卫）、Tailwind CSS 3、vue-i18n（中英双语）、lucide 图标、axios 封装（自动拆信封、统一错误提示、401 跳登录）
- **后端** — Express 4、SQLite（Promise 封装）、JWT 三级鉴权（`verifyToken` / `flexibleToken` / `isAdmin`）、bcrypt 加密、multer 上传、统一响应与错误处理、表结构自动补丁
- **工程** — Vite 代理、nodemon 热重载、`@` 路径别名、零依赖脚本、Docker + Nginx 配置、GitHub Actions CI
- **示例页面** — 首页（设计系统展示）、Playground（接口 + 鉴权 + 游戏循环演示）、登录页、受保护路由、404

## 快速开始

```bash
git clone https://github.com/939243423/starter.git my-app
cd my-app
npm run setup     # 安装前后端依赖
npm run dev       # 前端 http://localhost:5173   后端 http://localhost:3000
```

打开 <http://localhost:5173>，进 **Playground** 可以看到健康检查、注册登录、增删改查的完整链路。

### 三种用法

1. **GitHub 模板** — 在仓库页点 **Use this template**
2. **degit** — `npx degit 939243423/starter my-app && cd my-app && npm run setup`
3. **生成脚本** — 把本仓库当"模具"长期使用：
   ```bash
   npm run create -- my-game                                  # 生成 ./my-game
   npm run create -- my-game --target ../apps/my-game --title "我的小游戏"
   ```

## 目录结构

```
.
├── scripts/                 # 零依赖 Node 工具链
│   ├── setup.mjs            # 安装前后端依赖
│   ├── dev.mjs              # 并行启动 web + api
│   ├── build.mjs            # 生产构建
│   ├── create-app.mjs       # 基于本骨架生成新项目
│   └── clean.mjs            # 清理 dist / node_modules
├── frontend/
│   └── src/
│       ├── api/             # axios 实例 + 业务 API 出口
│       ├── assets/main.css  # 设计令牌 + 组件类
│       ├── components/      # AppShell、GlobalDialog、ToastList
│       ├── composables/     # useGameLoop、useRequest
│       ├── i18n/            # 中英文案
│       ├── router/          # 路由 + 鉴权守卫
│       ├── stores/          # 轻量响应式全局状态
│       ├── utils/           # storage、dialog/toast
│       └── views/           # 一个页面一个目录，主文件 index.vue
└── backend/
    └── src/
        ├── config/          # env.js、db.js（SQLite + 建表补丁）
        ├── controllers/     # 业务处理
        ├── middlewares/     # 鉴权、上传、安全头、错误处理
        ├── routes/          # 统一挂在 /api 下
        └── utils/           # 响应封装、asyncHandler
```

## 命令

| 命令 | 说明 |
| --- | --- |
| `npm run setup` | 安装前后端依赖（`-- --fresh` 强制重装） |
| `npm run dev` | 同时启动前端 5173 与后端 3000 |
| `npm run dev:web` / `npm run dev:api` | 只启动一端 |
| `npm run build` | 构建前端到 `frontend/dist` |
| `npm run create -- <name>` | 基于本骨架生成新项目 |
| `npm run clean [-- all]` | 清理 dist（加 `all` 连带 node_modules） |

## 开发约定

**接口信封** — 统一 `{ code: 0, message, data }`。axios 拦截器自动拆出 `data`，调用处直接拿业务数据；`code !== 0` 或 HTTP 异常会弹 toast，`401` 会清空登录态并跳登录页。

**鉴权** — `verifyToken`（强制登录）、`flexibleToken`（游客可访问，用 `req.isGuest` 判断）、`isAdmin`（管理员）。

**新增页面** — 建 `frontend/src/views/<Name>/index.vue`，在 `router/index.js` 注册，需要登录加 `meta: { requiresAuth: true }`。

**新增接口** — 逻辑写 `controllers/`，在 `routes/` 挂路由并在 `routes/index.js` 注册，最后在 `frontend/src/api/request.js` 暴露。SQL 一律参数绑定：`db.run(sql, [params])`。

**换肤** — 令牌都在 `frontend/src/assets/main.css` 的 CSS 变量里，给 `<html>` 加 `.theme-light` 即可（或调用 `stores/app.js` 的 `applyTheme('light')`）。

**游戏循环** — 用 `composables/useGameLoop.js`，不要在组件里手写 `requestAnimationFrame`；位移用 `dt` 保证不同帧率下速度一致。

## 环境变量

复制 `.env.example` 为 `.env`（生成新项目时会自动做）：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `3000` | 后端端口 |
| `NODE_ENV` | `development` | `production` 时隐藏错误堆栈 |
| `JWT_SECRET` | 开发环境兜底 | **生产必须设置**，否则服务拒绝启动 |
| `JWT_EXPIRES_IN` | `7d` | Token 有效期 |
| `CORS_ORIGIN` | `*` | 允许的跨域来源 |
| `DB_FILE` | `backend/data/app.db` | SQLite 文件路径 |
| `VITE_API_BASE` | `/api` | 前端接口基址（开发期由 Vite 代理） |

## Docker 部署

```bash
docker compose up -d --build    # 前端 :8080，后端 :3000
```

前端镜像用 Vite 构建后由 Nginx 托管（SPA 回退 + `/api` 反代后端）。数据在 `./backend/data`，上传文件在 `./backend/uploads`。

## 常见问题

**`npm install` 卡在 sqlite3** — 预编译包从 GitHub 下载，可能被墙或很慢。安装前设置镜像：
```bash
npm config set sqlite3_binary_host_mirror https://npmmirror.com/mirrors/sqlite3
```
或本地编译（`npm rebuild sqlite3 --build-from-source`，需要 C++ 工具链）。若机器上已有装好 `sqlite3@5.x` 的项目，也可直接复制其 `node_modules/sqlite3` 后执行 `npm install --ignore-scripts`。

**端口被占用** — `npm run dev` 启动前会检测 3000/5173 并给出提示。改后端端口改 `.env` 的 `PORT`，改前端端口改 `frontend/vite.config.js` 的 `server.port`（记得同步代理目标）。

**只要前端** — 删掉 `backend/` 并去掉 `vite.config.js` 的 proxy 配置即可，`npm run dev:web` 本来就只跑前端。

## 贡献

欢迎 Issue 与 PR，详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 开源协议

[MIT](./LICENSE)，随便用，无需署名。
