---
title: '在 KubeSphere 中开启高度自动化的微服务可观测性'
tag: 'KubeSphere'
keywords: 'KubeSphere, 微服务, Kubernetes, 云原生, DeepFLow'
description: ' 使用 KubeSphere 的所有用户可以从 KubeSphere 的应用商店中快速部署 DeepFlow，为微服务应用轻松开启高度自动化的全栈、全链路可观测性。'
createTime: '2022-08-24'
author: 'DeepFlow'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-deepflow-cover.png'
---

Kubernetes 为开发者们带来了巨大的微服务部署便利，但同时也将可观测性建设的重要性提升到了前所未有的程度：大量微服务之间错综复杂的调用关系难以梳理，应用性能瓶颈链路难以排查，应用异常难以定位。从现在开始，使用 KubeSphere 的所有用户可以从 KubeSphere 的应用商店中快速部署 DeepFlow，为微服务应用轻松开启**高度自动化**的**全栈、全链路**可观测性。

## 什么是 KubeSphere

KubeSphere 是在 Kubernetes 之上构建的面向云原生应用的分布式操作系统，完全开源，支持多云与多集群管理，提供全栈的 IT 自动化运维能力，简化企业的 DevOps 工作流。它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用 (plug-and-play) 的集成。

作为全栈的多租户容器平台，KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。KubeSphere 为用户提供构建企业级 Kubernetes 环境所需的多项功能，例如多云与多集群管理、Kubernetes 资源管理、DevOps、应用生命周期管理、微服务治理（服务网格）、日志查询与收集、服务与网络、多租户管理、监控告警、事件与审计查询、存储管理、访问权限控制、GPU 支持、网络策略、镜像仓库管理以及安全管理等。

GitHub 地址： https://github.com/kubesphere。

## 什么是 DeepFlow

[DeepFlow](https://github.com/deepflowys/deepflow) 是一款开源的高度自动化的可观测性平台，是为云原生应用开发者建设可观测性能力而量身打造的全栈、全链路、高性能数据引擎。DeepFlow 使用 eBPF、WASM、OpenTelemetry 等新技术，创新的实现了 AutoTracing、AutoMetrics、AutoTagging、SmartEncoding 等核心机制，帮助开发者提升埋点插码的自动化水平，降低可观测性平台的运维复杂度。利用 DeepFlow 的可编程能力和开放接口，开发者可以快速将其融入到自己的可观测性技术栈中。

GitHub 地址： https://github.com/deepflowys/deepflow。

## 为什么选择 DeepFlow

目前，社区已经拥有了非常丰富的 Metrics、Tracing、Logging 解决方案，比如著名的 Prometheus、Telegraf、SkyWalking、OpenTelemetry、Fluentd、Loki 等。随着 [eBPF](https://ebpf.io/) 技术的发展和 Linux 内核 4.X 版本的普及，可观测性迎来了更加**自动化**、更加**零侵扰**的玩法。在经过一番调研后，KubeSphere 选择将 DeepFlow 作为利用 eBPF 能力建设可观测性的开源解决方案，并将其集成到应用商店中。现在，KubeSphere 用户可使用应用模板，轻松将 DeepFlow 一键部署至 Kubernetes 环境中。

## 轻松部署 DeepFlow

你可以在 KubeSphere 应用商店中找到 DeepFlow，选择它并依次点击`安装` -> `下一步` -> `安装`，即可完成 DeepFlow 的部署。

![](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022081862fdd983e3ce6.png)

点击部署完成的应用，获取资源状态中的 deepflow-grafana 服务 NodePort，通过 `http://${K8S_NODE_IP}:${NodePort}` 即可访问 DeepFlow 的 Grafana：

![](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022081862fddd56b430f.png)

## 快速体验 DeepFlow

### Metrics

部署 DeepFlow 以后，**无需做任何操作**，访问 Grafana 即可查看所有微服务应用的 RED（Request/Error/Delay）**黄金指标**，以及所有微服务之间的**全景调用关系**（可在 [DeepFlow Online Demo](https://deepflow.yunshan.net/docs/zh/auto-metrics/application-metrics/) 中快速体验）：

![应用 RED 指标](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022081862fe47dc9a4a8.jpg)

结合 DeepFlow 的**全栈**数据采集能力和 **AutoTagging** 统一标签注入能力，也可快速判断两个微服务之间的瓶颈路径和原因：

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-deepflow-1.png)

### Tracing

DeepFlow 基于 eBPF 的 **AutoTracing** 能力（适用于 Linux Kernel 4.14+）可直接呈现微服务之间的分布式追踪火焰图，快速定位容器及 Service Mesh 场景下的应用性能瓶颈。下图是 Istio Bookinfo Demo 的零插码分布式追踪火焰图：

![eBPF Istio AutoTracing Demo](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022081862fe4891aa4a2.jpg)

DeepFlow 也支持广泛的数据集成能力，能够自动集成 Prometheus、Telegraf 的指标数据和 OpenTelemetry、SkyWalking 的追踪数据。其中对于 OpenTelemetry 和 SkyWalking 数据的集成可展现**无盲点**的分布式追踪能力，将应用、系统、网络 Span 展现在一个火焰图中。下图是一个 Spring Boot Demo 的无盲点分布式追踪火焰图：

![Spring Boot Tracing Demo](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202208226302f52162845.png)

### Logging

依靠应用协议解析能力，DeepFlow 支持自动采集 HTTP 1/2/S、Dubbo、MySQL、Redis、Kafka、MQTT、DNS 等应用的调用日志，以及与之对应的 TCP/UDP 网络流日志：

![应用调用日志](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022081862fe4835b4384.jpg)


