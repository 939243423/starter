# AGENTS.md — App Starter 开发规范

本文件是 AI / 协作者在本架子中工作时必须遵守的规范。修改代码前先阅读。

## 1. 工程基线与禁止事项

- 前端 Vue 3 组合式 API（`<script setup>`），后端 CommonJS + Express。
- **禁止**把业务代码写进 `components/` 根层，公共组件才放这里；页面一律 `views/<Name>/index.vue`。
- **禁止**引入与当前任务无关的重依赖（图表、AI SDK、UI 库等），需要时先说明理由。
- **禁止**提交 `.env`、数据库文件、`node_modules`、构建产物。
- **禁止**硬编码密钥，一律走 `process.env` / `import.meta.env`。

## 2. 目录职责

| 目录 | 只允许放 |
| --- | --- |
| `frontend/src/api` | axios 实例、拦截器、业务 API 出口（`api` 对象） |
| `frontend/src/components` | 跨页面复用组件（布局、弹窗、Toast、通用表单控件） |
| `frontend/src/composables` | 无渲染的逻辑复用（游戏循环、请求状态、事件监听等） |
| `frontend/src/views` | 页面，一个功能一个目录，主文件固定 `index.vue` |
| `frontend/src/stores` | 轻量响应式全局状态，不引入 Pinia |
| `backend/src/controllers` | 请求解析、业务编排、响应封装 |
| `backend/src/routes` | 只做路由与中间件挂载，不写业务逻辑 |

页面内部若拆子组件，放在 `views/<Name>/components/` 下，不要外溢到全局 `components/`。

## 3. 设计规范

- 视觉语言：Linear / Apple 极简 + 玻璃拟态（glassmorphism）。
- 颜色必须走 `main.css` 的 CSS 变量（`--accent`、`--surface`、`--border`、`--muted`），或使用 Tailwind 扩展色 `bg-surface / text-muted / border-line`。禁止裸写纯红纯蓝等刺眼色值。
- 复用既有组件类：`.glass-card` `.btn .btn-primary .btn-ghost` `.input` `.chip` `.divider` `.text-gradient`；需要新样式优先扩展这一层，而不是在页面里堆 utility。
- 交互反馈统一走 `dialog.toast / dialog.confirm / dialog.alert / dialog.loading`，**禁止 `alert()`、`confirm()`**。
- 动效克制：优先 `card-hover`、`animate-fade-up`、`animate-float`；过渡时长 200–350ms。

## 4. 接口约定

- 后端统一响应 `{ code: 0, message, data }`，失败 `{ code: 1, message }` + 合适 HTTP 状态码。
- 前端拦截器负责拆信封、错误提示、401 跳转；页面内**不要**再重复写一层错误 toast。
- 所有 SQL 必须使用参数绑定（`db.run(sql, [params])`），**禁止字符串拼接**。
- 写操作接口默认挂 `verifyToken`；确需游客访问时用 `flexibleToken` 并自行处理 `req.isGuest`。

## 5. 游戏 / 交互开发约定

- 帧循环一律用 `composables/useGameLoop.js`，不要直接手写 `requestAnimationFrame`（避免组件卸载后泄漏）。
- 物理 / 位移使用回调传入的 `dt`（秒），不要用固定步长或依赖帧率。
- Canvas 需处理 `devicePixelRatio` 缩放与容器尺寸变化；清屏用 `clearRect` 而非重设 `canvas.width`（除非尺寸变化）。

## 6. 提交前检查

1. 前端：`cd frontend && npm run build` 必须无错误无警告。
2. 后端：至少启动一次 `npm run dev:api` 并请求 `GET /api/health`。
3. CI：GitHub Actions 会在 Node 20 / 22 上跑前端构建与接口冒烟，PR 必须绿灯。
4. 新增环境变量时同步更新 `.env.example`（根与 `backend/` 各一份）。
5. 用户可感知的改动同步更新 `README.md` / `README.zh-CN.md` 与 `CHANGELOG.md`。
4. 提交信息使用中文前缀：`功能：` / `修复：` / `重构：` / `文档：`。

## 7. 复用本架子

新增项目不要直接复制粘贴目录，使用 `npm run create -- <project-name>`，它会排除 `node_modules`、构建产物、本地数据库并重命名包名。
