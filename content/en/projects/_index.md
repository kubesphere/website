---
title: "Open Source Community - Open Source Community - KubeSphere | Enterprise container platform, built on Kubernetes"
description: KubeSphere is an open source container platform based on Kubernetes for enterprise app development and deployment, suppors installing anywhere from on-premise datacenter to any cloud to edge.
keywords: KubeSphere, Kubernetes Dashboard,  Install Enterprise Kubernetes, DevOps, Istio, Service Mesh, Jenkins, container platform

css: "scss/projects.scss"
name: Open Source Projects
groups:
  - name: Container Platform
    children:
      - title: KubeSphere 容器平台
        icon: images/projects/kubesphere.svg
        link: "https://github.com/kubesphere/kubesphere"
        description: 基于 Kubernetes 之上构建的以应用为中心的多租户容器平台，支持部署运行在任何基础设施之上，提供简单易用的操作界面以及向导式 UI，旨在解决 Kubernetes 的存储、网络、安全与易用性等痛点。
  
  - name: App Management
    children:
      - title: OpenPitrix
        icon: images/projects/openpitrix.svg
        link: "https://github.com/openpitrix/openpitrix"
        description: 开源的多云应用管理平台，用来在多云环境下打包、部署和管理不同类型的应用，包括传统应用、微服务应用以及 Serverless 应用等，其中云平台包括 AWS、Kubernetes、QingCloud、VMWare。

  - name: Storage Plugins
    children:
      - title: QingStor-CSI
        icon: images/projects/qingstor.svg
        link: "https://github.com/yunify/qingstor-csi"
        description: QingStor CSI 插件实现 CSI 接口，使容器编排平台（如 Kubernetes）能够使用 NeonSAN 分布式存储的资源。目前，QingStor CSI 插件实现了存储卷管理和快照管理功能，并在 Kubernetes v1.12 环境中通过了 CSI Sanity 测试。
      
      - title: QingCloud-CSI
        icon: images/projects/qingcloud.svg
        link: "https://github.com/yunify/qingcloud-csi"
        description: QingCloud CSI 插件实现了 CSI 接口，并使容器管理平台能够使用 QingCloud 云平台的块存储资源。目前，QingCloud CSI 插件已经在 Kubernetes v1.14/v1.15 环境中通过了 CSI 测试。
  
  - name: Network Plugins
    children:
      - title: Porter LB 插件
        icon: images/projects/porter.svg
        link: "https://github.com/kubesphere/porter"
        description: 适用于物理部署 Kubernetes 环境的负载均衡器插件，Porter 使用物理交换机实现，利用 BGP 和 ECMP 从而达到性能最优和高可用性，提供用户在物理环境暴露 LoadBalancer 类型服务与云上获得一致性体验。

      - title: Qingcloud Load Balancer
        icon: images/projects/qingcloud.svg
        link: "https://github.com/yunify/qingcloud-cloud-controller-manager"
        description: QingCloud 云平台的负载均衡器插件，使用户能够在 QingCloud 云平台快速创建 LoadBalancer 类型的服务并暴露给集群外部访问。

      - title: Hostnic-CNI
        icon: images/projects/qingcloud.svg
        link: "https://github.com/yunify/hostnic-cni"
        description: QingCloud 云平台的负载均衡器插件，会直接调用 QingCloud 云平台的接口去创建网卡，并将容器的内部的接口连接到网卡上，不同 Node 上的 Pod 能够借助云平台的 SDN 进行通讯。


  - name: CI/CD
    children:
      - title: S2i-operator
        icon: images/projects/s2i-operator.svg
        link: "https://github.com/kubesphere/s2ioperator"
        description: S2I ( Source to Image )是一款自动将代码容器化的工具，通过预置的模板来支持多种语言和框架，比如 Java、Nodejs、Python 等，提供 CLI、API 和 webhook，是一种 CI/CD 的实现方式。

  - name: Notification & Alerting
    children:
      - title: Notification（通知系统）
        icon: images/projects/notification.svg
        link: "https://github.com/openpitrix/notification"
        description: 通用的企业级高性能的分布式通知系统，面向云原生的设计，可独立部署与使用，支持邮件通知，计划新增 WebSocket、微信、SMS 短信等通知渠道。

      - title: Alert（告警系统）
        icon: images/projects/alert.svg
        link: "https://github.com/kubesphere/alert"
        description: 通用的企业级高性能的分布式告警系统，面向云原生的设计，可独立部署与使用，支持集群、Workload、Pod、容器级别的自定义告警规则。


  - name: Logging Operator
    children:
      - title: Fluentbit-operator
        icon: images/projects/fluentbit-operator.svg
        link: "https://github.com/kubesphere/fluentbit-operator"
        description: Fluent Bit Operator 实现以声明式配置的方式，对 Fluent Bit 动态管理和运维。可帮助开发者将日志信息与应用程序打包在一起。借助 CRD 可以在其图表中描述应用程序的行为。


  - name: Identity Management
    children:
      - title: IM
        icon: images/projects/im.svg
        link: "https://github.com/kubesphere/im"
        description: 通用的身份认证管理系统
---