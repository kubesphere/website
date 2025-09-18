---
title: "社区版详细功能清单"

layout: "features"

css: "scss/features.scss"

section1:
  title: "社区版详细功能清单"
  image: /images/features/banner.jpg

section2:
  title: "功能介绍"
  children:
    - icon: /images/features/cluster-management.svg
      name: 集群管理
      content: 跨云、跨基础设施的多个 Kubernetes 集群的集中式可视化管理与运维
    - icon: /images/features/multi-tenant-anagement.svg
      name: 多租户管理
      content: 跨集群、跨项目的资源逻辑隔离、网络隔离和细粒度的访问控制能力
    - icon: /images/features/app-management.svg
      name: 应用管理
      content: 统一的应用生命周期管理能力，对 Helm、Oporator 等类型应用提供统一的抽象层
    - icon: /images/features/k8s-resource-management.svg
      name: K8S资源管理
      content: 提供 Web 控制台对接 Kubernetes 原生 API 快速创建与管理 Kubernetes 资源
    - icon: /images/features/extension-management.svg
      name: 扩展组件管理
      content: 采用微内核+扩展组件的架构，按需定制、扩展平台能力
    - icon: /images/features/wiz-telemetry.svg
      name: WizTelemetry 可观测
      content: 对应用与基础设施性能及健康状态的全面洞察
      label: extension
    - icon: /images/features/devops.svg
      name: DevOps
      content: 提供端到端的工作流，集成主流 CI/CD 工具
      label: extension
    - icon: /images/features/gateway.svg
      name: KubeSphere 网关
      content: 基于流量的统一入口管理、七层负载均衡与多种路由策略
      label: extension
    - icon: /images/features/gatekeeper.svg
      name: GateKeeper
      content: 可灵活配置安全策略的准入控制器
    - icon: /images/features/metrics-server.svg
      name: Metrics Server
      content: 可扩展、高效的容器资源度量源，为 Kubernetes 内置的自动扩展管道提供服务
      label: opensource
    - icon: /images/features/nvidia.svg
      name: NVIDIA GPU Operator
      content: 在 Kubernetes 上创建、配置和管理 GPU
      label: opensource
    - icon: /images/features/deepseek.svg
      name: Deepseek
      content: 基于 ollama 运行 deepseek-r1 模型，对外提供 API 服务
      label: opensource
    - icon: /images/features/grafana.svg
      name: Grafana
      content: 开放且可组合的观测和数据可视化平台
      label: opensource
    - icon: /images/features/loki.svg
      name: Loki
      content: 可扩展、高可用、多租户日志聚合系统
      label: opensource
    - icon: /images/features/higress.svg
      name: Higress
      content: 基于 Istio 和 Envoy 的API 网关
      label: opensource
    - icon: /images/features/ob-operator.svg
      name: OB-Operator
      content: 管理 Kubernetes 集群中的 OceanBase 相关资源
      label: opensource
    - icon: /images/features/ob-operator.svg
      name: Oceanbas Dashboard
      content: OceanBase 交互式管理应用
      label: opensource
---
