# 贡献指南

感谢你愿意让这个模板更好。提交前请花两分钟读完下面几条。

## 开发环境

```bash
git clone https://github.com/939243423/starter.git
cd starter
npm run setup
npm run dev
```

Node >= 18（推荐 20 LTS）。

## 提交前检查（`npm run build` 不够，请全部过一遍）

1. `cd frontend && npm run build` —— 必须零错误零警告
2. `npm run dev:api` 后访问 `http://localhost:3000/api/health` —— 必须返回 `code: 0`
3. 改动了页面 —— 至少在浏览器里点一遍受影响路径
4. 新增环境变量 —— 同步更新根 `.env.example`（和 `frontend/.env.example`）
5. 不要提交 `.env`、数据库文件、`node_modules`、`dist`

## 代码规范

- 前端组件用 `<script setup>` + Composition API；公共逻辑抽到 `composables/`，不要塞进组件
- 颜色只用 `main.css` 里的 CSS 变量或 Tailwind 扩展色（`bg-surface`、`text-muted`、`border-line`），禁止裸写刺眼色值
- 交互反馈统一用 `dialog.toast / confirm / alert / loading`，不要用原生 `alert()`
- 后端只返回 `{ code, message, data }`，SQL 必须参数绑定
- 注释精简：只解释"为什么"，不要重复"做了什么"

## 提交信息

统一中文前缀，一句话说清改动：

```
功能：新增 xxx
修复：修复 xxx
重构：优化 xxx
文档：更新 xxx
```

## Pull Request

- 一个 PR 只做一件事，范围越小越快合
- 描述里说明：改了什么、为什么要改、怎么验证
- 涉及破坏性变更（改脚本参数、目录结构、接口约定），请在描述顶部标出 **BREAKING** 并说明迁移方式

## 报告问题

提 Issue 时请带上：操作系统 + Node 版本、复现步骤、期望与实际表现、终端报错原文。能附上最小复现仓库最好。

## 行为准则

对事不对人，讨论代码而不是讨论人。保持友好。
