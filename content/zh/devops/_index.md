---
title: "KubeSphere DevOps"
layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: KubeSphere DevOps 提供端到端的工作流，集成主流 CI/CD 工具，提升交付能力
  content: KubeSphere DevOps 提供基于 Jenkins 的 CI/CD 流水线，支持自动化工作流，包括 Binary-to-Image (B2I) 和 Source-to-Image (S2I) 等，帮助不同的组织加快产品上市时间。
  content2:
  image: /images/devops/banner.png
  showDownload: true
  inCenter: true

image: /images/devops/dev-ops.png

section2:
  title: 自动检出 (Checkout) 代码、测试、分析、构建、部署并发布
  list:
    - title: 开箱即用的 CI/CD 流水线
      image: /images/devops/CD-pipeline.png
      contentList:
        - content: <span>易于集成至您的 SCM，</span>支持 GitLab/GitHub/BitBucket/SVN
        - content: <span>图形编辑面板设计，</span>可创建 CI/CD 流水线且无需编写 Jenkinsfile
        - content: <span>集成 SonarQube，</span>实现源代码质量分析
        - content: <span>支持依赖项缓存，</span>加快构建和部署
        - content: <span>动态构建 Agent，</span>根据需要自动创建 Pod

    - title: 内置自动化工具箱
      image: /images/devops/Built-in-automated-toolkits.png
      contentList:
        - content: <span>Source-to-Image</span> 从源代码构建可再现容器镜像，无需编写 Dockerfile
        - content: <span>Binary-to-image</span> 将您的制品自动构建成可运行镜像
        - content: <span>支持自动化构建和推送</span>镜像至任意仓库，并最终部署至 Kubernetes
        - content: <span>卓越的可恢复性和灵活性，</span>您可以在需要补丁时重新构建并重新运行 S2I/B2I

    - title: 使用 Jenkins 流水线实现 DevOps
      image: /images/devops/Clear-insight.png
      contentList:
        - content: <span>融合 Git 和 Kubernetes，实现云原生应用自动化交付</span>
        - content: <span>基于 KubeSphere 多租户体系，为 DevOps 工程团队打造合作平台</span>
        - content: <span>易于观察，</span>为 S2I/B2I 构建以及流水线提供动态日志
        - content: 在流水线中提供审计、告警和通知功能，确保快速定位并解决问题
        - content: 支持添加 Git SCM Webhook，在提交新的 Commit 到分支时触发 Jenkins 构建

section3:
  title: 观看 KubeSphere 一站式 DevOps 工作流操作演示
  videoLink: https://www.youtube.com/embed/c3V-2RX9yGY
  image: /images/service-mesh/15.jpg
  showDownload: true
  content: 想自己动手体验实际操作？
  btnContent: 开始动手实验
  link: docs/pluggable-components/devops/
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---
