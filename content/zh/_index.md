---
title: 面向云原生应用的容器混合云，支持 Kubernetes 多集群管理的 PaaS 容器云平台解决方案 | KubeSphere
description: KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，完全开源，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。


css: scss/index.scss

section1:
  title: KubeSphere 容器平台
  topic: 面向云原生应用的<br>容器混合云
  content: KubeSphere 愿景是打造一个以 Kubernetes 为内核的云原生分布式操作系统，它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用（plug-and-play）的集成，支持云原生应用在多云与多集群的统一分发和运维管理。

section2:
  title: 全栈的 Kubernetes 容器云 PaaS 解决方案
  content: KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。
  children:
    - name: 完全开源
      icon: /images/home/open-source.svg
      content: 通过 CNCF 一致性认证的 Kubernetes 平台，100% 开源，由社区驱动与开发

    - name: 简易安装
      icon: /images/home/easy-to-run.svg
      content: 支持部署在任何基础设施环境，提供在线与离线安装，支持一键升级与扩容集群

    - name: 功能丰富
      icon: /images/home/feature-rich.svg
      content: 在一个平台统一纳管 DevOps、云原生可观测性、服务网格、应用生命周期、多租户、多集群、存储与网络

    - name: 模块化 & 可插拔
      icon: /images/home/modular-pluggable.svg
      content: 平台中的所有功能都是可插拔与松耦合，您可以根据业务场景可选安装所需功能组件



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
        - content: 为企业交付一个通过 CNCF 认证和可信赖的 Kubernetes 发行版
        - content: 支持 Kubernetes 的多云与多集群管理，提供多云与多可用区的高可用

    - name: 开发者
      content: 从繁琐的 YAML 编辑工作中解放，让开发者只需专注于业务开发
      icon: /images/home/74.png
      children:
        - content: 为开发者提供向导式的用户体验，降低上手云原生技术栈的学习曲线
        - content: 内置常用的自动化部署环境，为应用（Java/NodeJs/Python/Go）部署提供定制化的容器运行环境
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
        - content: 提供按需容器资源申请，支持设置容器的弹性伸缩（HPA），提升应用的可靠性与灵活性
        - content: 支持导入 Helm 应用仓库可视化编辑与部署应用
        - content: 应用商店将支持运营，提供针对应用的计量与计费（v3.x）

section4:
  title: 主要功能
  content: 如果您在寻找一个可以媲美商业产品的开源项目，KubeSphere 会是您的选择。<br> <br>我们在 <a class='inner-a' target='_blank' href='https://github.com/kubesphere/kubesphere/blob/master/docs/roadmap.md'>RoadMap</a> 列出了下一个版本的规划，欢迎所有人为社区提供您的需求、建议与反馈。
  children:
    - name: 安装 Kubernetes 集群
      icon: /images/home/provisioning-kubernetes.svg
      content: 支持在任何基础设施上部署 Kubernetes，提供在线与离线安装，支持添加 GPU 节点

    - name: Kubernetes 资源管理
      icon: /images/home/k-8-s-resource-management.svg
      content: 提供 Web 控制台对接 Kubernetes 原生 API 快速创建与管理 Kubernetes 资源，内置多维度的可观测性

    - name: 多租户管理
      icon: /images/home/multi-tenant-management.svg
      content: 提供统一的认证鉴权与细粒度的基于角色的授权系统，支持对接 AD/LDAP

    - name: 支持多种存储与网络方案
      icon: /images/home/multi-tenant-management.svg
      content: 支持 GlusterFS、Ceph、NFS、LocalPV，提供多个 CSI 插件对接公有云与企业级存储；提供面向物理机 Kubernetes 环境的负载均衡器 <a class='inner-a' target='_blank' href='https://openelb.github.io/'>OpenELB</a>，支持网络策略可视化，支持 Calico、Flannel、Cilium、Kube-OVN 等网络插件

  features:
    - name: Kubernetes DevOps 系统
      icon: /images/home/dev-ops.svg
      content: 基于 Jenkins 为引擎打造的 CI/CD，内置 Source-to-Image 和 Binary-to-Image 自动化打包部署工具
      link: "devops/"
      color: orange

    - name: 基于 Istio 的微服务治理
      icon: /images/home/service.svg
      content: 提供细粒度的流量管理、流量监控、灰度发布、分布式追踪，支持可视化的流量拓扑
      link: "service-mesh/"
      color: red

    - name: 丰富的云原生可观测性
      icon: /images/home/rich.svg
      content: 提供多维度与多租户的监控、日志、事件、审计搜索，支持多种告警策略与通知渠道，支持日志转发
      link: "observability/"
      color: green

    - name: 云原生应用商店
      icon: /images/home/store.svg
      content: 提供基于 Helm 的应用商店与应用仓库，内置多个应用模板，支持应用生命周期管理
      link: "/docs/pluggable-components/app-store/"
      color: grape

    - name: Kubernetes 多集群管理
      icon: /images/home/management.svg
      content: 跨多云与多集群统一分发应用，提供集群高可用与灾备的最佳实践，支持跨级群的可观测性
      link: "/docs/multicluster-management/introduction/overview/"
      color: orange

    - name: Kubernetes 边缘节点管理
      icon: /images/home/network.svg
      content: 基于 KubeEdge 实现应用与工作负载在云端与边缘节点的统一分发与管理，解决在海量边、端设备上完成应用交付、运维、管控的需求
      link: "/docs/pluggable-components/kubeedge/"
      color: green

    - name: 多维度计量与计费
      icon: /images/home/multiple.svg
      content: 提供基于集群与租户的多维度资源计量与计费的监控报表，让 Kubernetes 运营成本更透明
      link: "/docs/toolbox/metering-and-billing/view-resource-consumption/"
      color: grape

section5:
  title: 面向云原生的架构，前后端分离
  frontEnd:
    title: Front End
    project: KubeSphere Console
    children:
      - icon: /images/home/mobx.jpg
      - icon: /images/home/koa.jpg
      - icon: /images/home/react.png

  backEnd:
    title: Back End (REST API)
    project: KubeSphere System
    group:
      - name: API Server
      - name: API Gateway
      - name: Controller Manager
      - name: Account Service


section6:
  title: 用户社区
  content: 已有来自全球的大量知名企业与组织将 KubeSphere 容器平台广泛应用在科研、生产环境以及他们的商业产品中，</br> 点击<a class='inner-a' target='_blank' href='case/'>案例学习</a>查看更详细的典型用户的实践案例文章。
  children:
    - icon: /images/home/section6-anchnet.jpg
    - icon: /images/home/section6-aviation-industry-corporation-of-china.jpg
    - icon: /images/home/section6-aqara.jpg
    - icon: /images/home/section6-bank-of-beijing.jpg
    - icon: /images/home/section6-benlai.jpg
    - icon: /images/home/section6-china-taiping.jpg
    - icon: /images/home/section6-changqing-youtian.jpg
    - icon: /images/home/section6-cmft.jpg
    - icon: /images/home/section6-extreme-vision.jpg
    - icon: /images/home/section6-guizhou-water-investment.jpg
    - icon: /images/home/section6-huaxia-bank.jpg
    - icon: /images/home/section6-inaccel.jpg
    - icon: /images/home/section6-maxnerva.jpg
    - icon: /images/home/section6-picc.jpg
    - icon: /images/case/section6-supaur.png
    - icon: /images/home/section6-sina.jpg
    - icon: /images/home/section6-sichuan-airlines.jpg
    - icon: /images/home/section6-sinopharm.jpg
    - icon: /images/home/section6-softtek.jpg
    - icon: /images/home/section6-spd-silicon-valley-bank.jpg
    - icon: /images/home/section6-vng.jpg
    - icon: /images/home/section6-webank.jpg
    - icon: /images/home/section6-wisdom-world.jpg
    - icon: /images/home/section6-yiliu.jpg
    - icon: /images/home/section6-zking-insurance.jpg

  btnContent: 案例学习
  btnLink: case/
  link: mailto:info@kubesphere.io
  linkContent: 希望加入用户社区并在 KubeSphere 官网展示您的 Logo？请邮件至 info@kubesphere.io
  joinTitle: 加入 KubeSphere 社区合作伙伴计划
  joinContent: 我们非常期待您加入 KubeSphere 社区合作伙伴计划，共同完善各自的生态，加速您的业务增长。
  joinLink: partner/
  image: /images/home/certification.jpg
---
