---
title: "概述"
keywords: "Kubernetes, KubeSphere, 可插拔组件, 概述"
description: "了解 KubeSphere 中的关键组件以及对应的资源消耗。"
linkTitle: "概述"
weight: 6100
version: "v3.4"
---

从 2.1.0 版本开始，KubeSphere 解耦了一些核心功能组件。这些组件设计成了可插拔式，您可以在安装之前或之后启用它们。如果您不启用它们，KubeSphere 会默认以最小化进行安装部署。

不同的可插拔组件部署在不同的命名空间中。您可以根据需求启用任意组件。强烈建议您安装这些可插拔组件来深度体验 KubeSphere 提供的全栈特性和功能。

有关如何启用每个组件的更多信息，请参见本章的各个教程。

## 资源要求

在您启用可插拔组件之前，请确保您的环境中有足够的资源，具体参见下表。否则，可能会因为缺乏资源导致组件崩溃。

{{< notice note >}}

CPU 和内存的资源请求和限制均指单个副本的要求。

{{</ notice >}}

### KubeSphere 应用商店

| 命名空间 | openpitrix-system                        |
| -------- | ---------------------------------------- |
| CPU 请求 | 0.3 核                                   |
| CPU 限制 | 无                                       |
| 内存请求 | 300 MiB                                  |
| 内存限制 | 无                                       |
| 安装     | 可选                                     |
| 备注     | 该组件可用于管理应用生命周期。建议安装。 |

### KubeSphere DevOps 系统

| 命名空间 | kubesphere-devops-system                                     | kubesphere-devops-system         |
| -------- | ------------------------------------------------------------ | -------------------------------- |
| 安装模式 | All-in-One 安装                                              | 多节点安装                       |
| CPU 请求 | 34 m                                                         | 0.47 核                        |
| CPU 限制 | 无 | 无 |
| 内存请求 | 2.69 G                                                       | 8.6 G                            |
| 内存限制 | 无 | 无 |
| 安装     | 可选                                                         | 可选                             |
| 备注     | 提供一站式 DevOps 解决方案，包括 Jenkins 流水线、B2I 和 S2I。 | 其中一个节点的内存必须大于 8 G。 |

### KubeSphere 监控系统

| 命名空间 | kubesphere-monitoring-system                                 | kubesphere-monitoring-system | kubesphere-monitoring-system |
| -------- | ------------------------------------------------------------ | ---------------------------- | ---------------------------- |
| 子组件   | 2 x Prometheus                                               | 3 x Alertmanager             | Notification Manager         |
| CPU 请求 | 100 m                                                        | 10 m                         | 100 m                        |
| CPU 限制 | 4 core                                                       | 无                           | 500 m                        |
| 内存请求 | 400 MiB                                                      | 30 MiB                       | 20 MiB                       |
| 内存限制 | 8 GiB                                                        |                              | 1 GiB                        |
| 安装     | 必需                                                         | 必需                         | 必需                         |
| 备注     | Prometheus 的内存消耗取决于集群大小。8 GiB 可满足 200 个节点/16,000 个容器组的集群规模。 |                              |                              |

{{< notice note >}}

KubeSphere 监控系统不是可插拔组件，会默认安装。它与其他组件（例如日志系统）紧密关联，因此将其资源请求和限制也列在本页中，供您参考。

{{</ notice >}} 

### KubeSphere 日志系统

| 命名空间 | kubesphere-logging-system                                    | kubesphere-logging-system                    | kubesphere-logging-system               | kubesphere-logging-system                           |
| -------- | ------------------------------------------------------------ | -------------------------------------------- | --------------------------------------- | --------------------------------------------------- |
| 子组件   | 3 x Elasticsearch                                            | fluent bit                                   | kube-events                             | kube-auditing                                       |
| CPU 请求 | 50 m                                                         | 20 m                                         | 90 m                                    | 20 m                                                |
| CPU 限制 | 1 core                                                       | 200 m                                        | 900 m                                   | 200 m                                               |
| 内存请求 | 2 G                                                          | 50 MiB                                       | 120 MiB                                 | 50 MiB                                              |
| 内存限制 | 无                                                           | 100 MiB                                      | 1200 MiB                                | 100 MiB                                             |
| 安装     | 可选                                                         | 必需                                         | 可选                                    | 可选                                                |
| 备注     | 可选组件，用于存储日志数据。不建议在生产环境中使用内置 Elasticsearch。 | 日志收集代理。启用日志系统后，它是必需组件。 | Kubernetes 事件收集、过滤、导出和告警。 | Kubernetes 和 KubeSphere 审计日志收集、过滤和告警。 |

### KubeSphere 告警和通知

| 命名空间 | kubesphere-alerting-system |
| -------- | -------------------------- |
| CPU 请求 | 0.08 core                  |
| CPU 限制 | 无                         |
| 内存请求 | 80 M                       |
| 内存限制 | 无                         |
| 安装     | 可选                       |
| 备注     | 告警和通知需要同时启用。   |

### KubeSphere 服务网格

| 命名空间 | istio-system                                           |
| -------- | ------------------------------------------------------ |
| CPU 请求 | 1 core                                                 |
| CPU 限制 | 无                                                     |
| 内存请求 | 3.5 G                                                  |
| 内存限制 | 无                                                     |
| 安装     | 可选                                                   |
| 备注     | 支持灰度发布策略、流量拓扑、流量管理和分布式链路追踪。 |
