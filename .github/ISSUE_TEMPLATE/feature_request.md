name: Feature request
title: "功能："
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: 想解决什么问题
      description: 说明场景，而不是只说想要的功能
    validations:
      required: true

  - type: textarea
    id: proposal
    attributes:
      label: 期望方案
      placeholder: 例如：新增 xxx 脚本 / 在 db.js 里提供 xxx 能力
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: 备选方案
      description: 你考虑过但觉得不合适的做法

  - type: checkboxes
    id: scope
    attributes:
      label: 影响范围
      options:
        - label: 前端
        - label: 后端
        - label: 工程脚本 / 部署
        - label: 文档
