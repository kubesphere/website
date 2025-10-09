---
title: 面向云原生应用的容器混合云，支持 Kubernetes 多集群管理的 PaaS 容器云平台解决方案 | KubeSphere
description: KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，完全开源，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。

css: scss/index.scss

section1:
  title: KubeSphere 社区版
  topic: 面向云原生应用的容器混合云
  content: KubeSphere 愿景是打造一个以 Kubernetes 为内核的云原生分布式操作系统，<br/>它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用（plug-<br/>and-play）的集成，支持云原生应用在多云与多集群的统一分发和运维管理。
  btns:
    - content: 即刻体验
      link: /zh/news/kubesphere-community-edition-ga-announcement/#%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B
      class: experiense-btn
    - content: 申请免费授权
      link: https://kubesphere.com.cn/apply-license/
      class: apply-btn
  carouselItems:
    - image: /images/home/top-right-cn-1.png
    - image: /images/home/top-right-cn-2.png
    - image: /images/home/top-right-cn-3.png
    - image: /images/home/top-right-cn-4.png
    - image: /images/home/top-right-cn-5.png

tabs:
  children:
    - title: 免费产品
    - title: 开源项目

section2:
  title: 全栈的 Kubernetes 容器云 PaaS 解决方案
  content: KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。
  children:
    - name: 永久免费
      icon: /images/home/free.svg
      content: 零成本无忧使用，享受持续迭代的企业级功能，助您轻松构建云原生基石

    - name: 简易安装
      icon: /images/home/easy-to-run.svg
      content: 支持部署在任何基础设施环境，提供在线与离线安装，支持一键升级与扩容集群

    - name: 功能丰富
      icon: /images/home/feature-rich.svg
      content: 提供多租户、多集群、云原生可观测性、应用生命周期、存储与网络、DevOps

    - name: 灵活扩展
      icon: /images/home/modular-pluggable.svg
      content: 基于可插拔架构，可无缝集成任何主流开源工具，像搭积木一样按需扩展平台能力

section3:
  title: 不同团队的受益
  content: 平台内置的多租户设计，让不同的团队能够在一个平台中不同的企业空间下，更安全地从云端到边缘部署云原生应用。开发者通过界面点击即可快速部署项目，平台内置丰富的云原生可观测性与 DevOps 工具集帮助运维人员定位问题和快速交付。KubeSphere 还能帮助基础设施团队在数据中心与多个云上高效地部署与运维多集群，避免单一云厂商绑定。
  children:
    - name: 基础设施团队
      content: 实现从云端到数据中心自动化部署、扩容与升级集群
      icon: /images/home/7.svg
      children:
        - content: 提高资源利用率，减少内部基础设施的成本支出
        - content: 提供安全增强，支持多种存储与网络方案
        - content: 为企业交付可信赖的 Kubernetes 发行版
        - content: 支持 Kubernetes 的多云与多集群管理，提供多云与多可用区的高可用

    - name: 开发者
      content: 从繁琐的 YAML 编辑工作中解放，让开发者只需专注于业务开发
      icon: /images/home/74.png
      children:
        - content: 为开发者提供向导式的用户体验，降低上手云原生技术栈的学习曲线
        - content: 内置常用的自动化部署环境，为应用（Java/Node.js/Python/Go）部署提供定制化的容器运行环境
        - content: 提供开箱即用的工具集，帮助开发者将代码快速构建为可运行的容器镜像，提高开发效率
        - content: 提供应用商店和应用生命周期管理，缩短应用上线周期

    - name: 运维团队
      content: 构建一站式企业级的 DevOps 架构与可视化运维能力
      icon: /images/home/71.svg
      children:
        - content: 提供从平台到应用维度的日志、监控、事件、审计、告警与通知，实现集中式与多租户隔离的可观测性
        - content: 简化应用的持续集成、测试、审核、发布、升级与弹性扩缩容
        - content: 为云原生应用提供基于微服务的灰度发布、流量管理、网络拓扑与追踪
        - content: 提供易用的界面命令终端与图形化操作面板，满足不同使用习惯的运维人员

    - name: 用户
      content: 在 Kubernetes 上使用与运维应用变得极其简单
      icon: /images/home/80.svg
      children:
        - content: 通过应用商店一键部署与升级应用至 Kubernetes
        - content: 提供按需容器资源申请，提升应用的可靠性与灵活性
        - content: 支持导入 Helm 应用仓库可视化编辑与部署应用

section4:
  title: 产品应用场景

  features:
    - name: Kubernetes 多集群管理
      icon: /images/home/management.svg
      content: 跨多云与多集群统一分发应用，提供集群高可用与灾备的最佳实践，支持跨集群的可观测性
      link: "https://docs.kubesphere.com.cn/v4.2.0/07-cluster-management/10-multi-cluster-management/"
      color: grape

    - name: 丰富的云原生可观测性
      icon: /images/home/rich.svg
      content: 提供多维度与多租户的监控、日志、事件、审计搜索，支持多种告警策略与通知渠道，支持日志转发
      link: "observability/"
      color: red

    - name: Kubernetes DevOps 系统
      icon: /images/home/devops1.svg
      content: 基于 Jenkins 为引擎打造的 CI/CD，内置 Source-to-Image 和 Binary-to-Image 自动化打包部署工具
      link: "devops/"
      color: green

section5:
  title: 面向云原生的架构，前后端分离
  frontEnd:
    title: Front End
    project: KubeSphere Console
    children:
      - icon: /images/home/kube-design.jpg
      - icon: /images/home/koa.jpg
      - icon: /images/home/react.png

  backEnd:
    title: Back End (REST API)
    project: KubeSphere System
    group:
      - name: API Server
      - name: Controller Manager

section6:
  title: 用户案例
  content: 已有来自全球的大量知名企业与组织将 KubeSphere 容器平台广泛应用在科研、生产环境以及他们的商业产品中。
  children:
    - icon: /images/home/section6-anchnet.jpg
      link: /case/anchnet
    - icon: /images/case/logo-alphaflow.png
      link: /case/alphaflow
    - icon: /images/case/section6-aqara.jpg
      link: /case/aqara
    - icon: /images/home/section6-huaxia-bank.jpg
      link: /case/huaxia-bank
    - icon: /images/home/section6-benlai.jpg
      link: /case/benlai
    - icon: /images/case/uisee.png
      link: /case/uisee
    - icon: /images/case/section6-zto.png
      link: /case/zto
    - icon: /images/case/section6-hongya.png
      link: /case/hongyaa
    - icon: /images/case/chinamobile-iot.png
      link: /case/chinamobile-iot
    - icon: /images/case/logo-qunar.png
      link: /case/qunar
    - icon: /images/case/logo-turing.png
      link: /case/turing
    - icon: /images/case/segmentfault-logo.png
      link: /case/segmentfault
    - icon: /images/case/logo-msxf.png
      link: /case/msxf
    - icon: /images/case/section6-sinodata.png
      link: /case/sinodata
    - icon: /images/home/section6-vng.jpg
      link: /case/vng
    - icon: /images/case/logo-xdf.png
      link: /case/xdf
    - icon: /images/home/section6-extreme-vision.jpg
      link: /case/extreme-vision
    - icon: /images/case/section6-vesoft-4.png
      link: /case/vesoft
    - icon: /images/case/logo-keyenlinx.png
      link: /case/keyenlinx
    - icon: /images/case/logo-yiheda.png
      link: /case/yiheda
    - icon: /images/case/logo-eastcom.png
      link: /case/eastcom
    - icon: /images/case/logo-gxjtkyy.png
      link: /case/gxjtkyy
    - icon: /images/case/section6-maxnerva.jpg
      link: /case/maxnerva
    - icon: /images/case/logo-hshc.png
      link: /case/hshc
    - icon: /images/case/logo-vsleem.png
      link: /case/vsleem

  link: mailto:info@kubesphere.io
  linkContent: 希望加入用户社区并在 KubeSphere 官网展示您的 Logo？请邮件至 info@kubesphere.io
  joinTitle: 加入 KubeSphere 社区合作伙伴计划
  joinContent: 我们非常期待您加入 KubeSphere 社区合作伙伴计划，共同完善各自的生态，加速您的业务增长。
  joinLink: partner/
  image: /images/home/certification.png

section7:
  title: 产品功能架构
  image: /images/home/arch-cn.svg

section8:
  title: KubeSphere 自诞生以来始终坚持开源初心<br/>在全球云原生社区中持续贡献力量
  content: 作为企业级 Kubernetes 平台的先行者，KubeSphere 在多集群治理、可视化运维、统一可观测性和企业级 DevOps 集成等方面不断创新，推动了 Kubernetes 在企业场景的普及与落地。同时，KubeSphere 社区孵化了 KubeKey、OpenELB、 Fluent Operator 等开源项目，并深度协同 Grafana、Loki、Higress 等生态，形成了广泛的技术影响力。
  children:
    - name: KubeKey
      icon: /images/home/kube-key.svg
      content: 极速安装与运维工具，加速 Kubernetes 部署，适配多环境，自动化全生命周期管理

    - name: OpenELB
      icon: /images/home/open-elb.svg
      content: 原生负载均衡解决方案，填补裸金属 LB 空白，支持多网络模式，消除外部依赖

    - name: KubeEye
      icon: /images/home/kube-eye.svg
      content: Kubernetes 集群检测与诊断工具，发现配置风险与合规问题，诊断集群异常，提升 Kubernetes 稳定性与安全性

    - name: Fluent Operator
      icon: /images/home/fluent-operator.svg
      content: 云原生日志与数据采集引擎，统一日志采集与处理，扩展 Fluentd / Fluent Bit，提升运维可观测性，项目已捐献

    - name: OpenFunction
      icon: /images/home/open-function.svg
      content: 云原生、开源的 FaaS（函数即服务）框架，聚焦业务逻辑开发，抽象底层运行环境，加速云原生函数即服务落地

    - name: Notification-Manager
      icon: /images/home/notification-manager.svg
      content: 管理多租户 Kubernetes 环境中的消息通知，统一多租户通知渠道，支持邮件、钉钉、飞书、企业微信，提升消息管理效率

    - name: DevOps
      icon: /images/home/devops.svg
      content: 提供端到端的工作流，集成主流 CI/CD 工具，整合 CI/CD 工具，简化交付流程，提升迭代效率

    - name: Kube Design
      icon: /images/home/kube-design.svg
      content: 为 KubeSphere 控制台开发的一套包含组件、Hooks、Icon 的 React 库，覆盖场景丰富可用于开发各种 React 应用
---
