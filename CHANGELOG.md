# 更新日志

本文件记录模板的重要变更，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [1.0.0] - 2026-09-15

### 新增

- 前端骨架：Vue 3 + Vite 5 + Tailwind 3、Vue Router 4（含鉴权守卫）、vue-i18n 中英双语、lucide 图标
- 设计系统：`main.css` 令牌化（CSS 变量），内置玻璃拟态组件类、亮色主题 `.theme-light`、Toast/Dialog 全局 UI
- 数据请求：axios 封装，自动拆 `{ code, message, data }` 信封、统一错误提示、401 清态跳登录
- 后端骨架：Express 4 + SQLite（Promise 封装 + 建表与字段自动补丁）、JWT 三级鉴权、bcrypt 加密、multer 上传、统一响应与错误处理
- 示例代码：注册 / 登录 / me、示例 CRUD、健康检查、上传接口
- 游戏能力：`useGameLoop`（rAF 主循环 + dt 钳制 + FPS 统计，卸载自动销毁）、`useRequest`
- 工程脚本（零第三方依赖）：`setup` / `dev`（并行启动）/ `build` / `clean` / `create-app`（生成新项目）
- 部署：前后端 Dockerfile、Nginx 配置（SPA 回退 + `/api` 反代）、docker-compose
- 工程规范：AGENTS.md、GitHub Actions CI、MIT 协议

### 修复

- `db.js` 覆盖 sqlite3 实例方法导致 `db.serialize` 队列死锁（表现为健康检查正常但查库请求挂死），改为导出独立 Promise 包装
- `create-app` 替换页面标题时误伤 viewport meta
