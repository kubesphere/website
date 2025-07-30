---
title: "可观测性"
layout: "scenario"

css: "scss/scenario.scss"

section1:
  title: KubeSphere 助您轻松实现可视化
  content: KubeSphere 提供了丰富的可视化功能，支持从基础设施到应用的多维度指标监控。此外，KubeSphere 还集成了许多常用的工具，包括多租户日志查询和收集、告警和通知等功能。
  image: /images/observability/banner.jpg
  showDownload: false

image: /images/observability/observability.jpg

section2:
  title: 可发现性、可观测性、安全性：一站式集成您所需的所有特性
  list:
    - title: 多维度监控
      image: /images/observability/multi-dimensional-monitoring.png
      contentList:
        - content: <span>基础设施监控</span> 提供 Kubernetes 控制平面和集群节点指标
        - content: <span>应用资源监控</span> 支持 CPU、内存、网络和存储等监控指标
        - content: <span>资源用量排行</span> 提供节点、企业空间和项目的资源用量排行情况
        - content: <span>服务组件监控</span> 支持快速定位组件故障
        - content: <span>自定义监控指标</span> 提供自定义应用指标监控面板（v3.0.0）

    - title: 日志查询和收集
      image: /images/observability/log-query-and-collection.png
      contentList:
        - content: <span>多租户日志管理</span> 实现不同租户日志分权分域
        - content: <span>多层次日志查询</span> 按项目、工作负载、容器组、容器和关键字查询日志，从多层次定位问题
        - content: <span>多日志收集平台</span> 支持 Elasticsearch、Kafka 和 Fluentd 等平台
        - content: <span>服务组件监控</span> 支持快速定位组件故障

    - title: 灵活告警和通知
      image: /images/observability/flexible-alerting-and-notification.png
      contentList:
        - content: <span>丰富告警规则</span> 提供多租户多维度的监控指标
        - content: <span>灵活告警策略</span> 支持自定义包含多条告警规则的告警策略
        - content: <span>多级监控指标</span> 覆盖从基础设施到工作负载的多级资源监控
        - content: <span>灵活告警规则</span> 支持自定义指标的监控时段、时长和告警优先级
        - content: <span>集成 AlertManager</span> 支持多种通知渠道（v3.0.0）

section3:
  title: 观看 KubeSphere 云原生可观测性演示
  videoLink: https://www.youtube.com/embed/uf0TTowc56I
  showDownload: false
  bgLeft: /images/service-mesh/3-2.svg
  bgRight: /images/service-mesh/3.svg
---
