name: Bug report
title: "修复："
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: 感谢反馈！请尽量填全，能省掉一轮来回沟通。

  - type: textarea
    id: what-happened
    attributes:
      label: 问题现象
      description: 实际发生了什么？期望是什么？
    validations:
      required: true

  - type: textarea
    id: reproduce
    attributes:
      label: 复现步骤
      placeholder: |
        1. npm run setup
        2. npm run dev
        3. 打开 http://localhost:5173/playground
        4. ...
    validations:
      required: true

  - type: input
    id: env
    attributes:
      label: 环境
      placeholder: Windows 11 / Node 20.11.0 / Chrome 126
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: 终端或浏览器报错
      description: 贴原文，不要只描述
      render: shell
