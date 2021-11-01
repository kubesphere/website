---
title: "介绍"
keywords: '监控, Prometheus, Prometheus Operator'
description: '介绍 KubeSphere 自定义监控功能和指标暴露，包括暴露方法和 ServiceMonitor CRD。'

linkTitle: "介绍"
weight: 10810
---

您可以使用 KubeSphere 的自定义监控功能以可视化的形式监控自定义应用指标。应用可以是第三方应用，例如 MySQL、Redis 和 Elasticsearch，也可以是您自己的应用。本文介绍自定义监控功能的使用流程。

KubeSphere 的监控引擎基于 Prometheus 和 Prometheus Operator。总体而言，要在 KubeSphere 中集成自定义应用指标，您需要执行以下步骤：

- 为您的应用[暴露 Prometheus 格式的指标](#步骤-1暴露-prometheus-格式的指标)。
- [应用 ServiceMonitor CRD](#步骤-2应用-servicemonitor-crd) 将应用程序与监控目标挂钩。
- [实现指标可视化](#步骤-3实现指标可视化)从而在监控面板上查看自定义指标趋势。

### 步骤 1：暴露 Prometheus 格式的指标

首先，您的应用必须暴露 Prometheus 格式的指标。Prometheus 暴露格式已经成为云原生监控领域事实上的标准格式。Prometheus 使用[基于文本的暴露格式](https://prometheus.io/docs/instrumenting/exposition_formats/)。取决于您的应用和使用场景，您可以采用以下两种方式暴露指标。

#### 直接暴露

直接暴露 Prometheus 格式的应用指标是云原生应用的常用方式。这种方式需要开发者在代码中导入 Prometheus 客户端库并在特定的端点 (Endpoint) 暴露指标。许多应用，例如 etcd、CoreDNS 和 Istio，都采用这种方式。

Prometheus 社区为大多数编程语言提供了客户端库。您可以在 [Prometheus Client Libraries](https://prometheus.io/docs/instrumenting/clientlibs/) 页面查看支持的语言。使用 Go 语言的开发者可参阅 [Instrumenting a Go Application for Prometheus](https://prometheus.io/docs/guides/go-application/) 了解如何编写符合 Prometheus 规范的应用程序。

[示例 Web 应用](../examples/monitor-sample-web/)演示了如何直接暴露 Prometheus 格式的应用指标。

#### 间接暴露

如果您不希望修改代码，或者由于应用由第三方提供您无法修改代码，您可以部署一个导出器作为代理，用于抓取指标数据并将其转换成 Prometheus 格式。

Prometheus 社区为大多数第三方应用，例如 MySQL，提供了生产就绪的导出器。您可以在 [Exporters and Integrations](https://prometheus.io/docs/instrumenting/exporters/) 页面查看可用的导出器。在 KubeSphere 中，建议[启用 OpenPitrix](../../../pluggable-components/app-store/) 并从应用商店部署导出器。应用商店中内置了面向 MySQL、Elasticsearch 和 Redis 的导出器。

请参阅[监控 MySQL](../examples/monitor-mysql/) 了解如何部署 MySQL 导出器并监控 MySQL 指标。

编写导出器与用 Prometheus 客户端库对应用进行监测类似，唯一的不同在于导出器需要连接应用并将应用指标转换成 Prometheus 格式。

### 步骤 2：应用 ServiceMonitor CRD

在上一步，您已经在 Kubernetes Service 对象中暴露了指标端点。在此步骤中您需要将这些新变更告知 KubeSphere 监控引擎。

ServiceMonitor CRD 由 [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) 定义。ServiceMonitor 包含指标端点的信息。KubeSphere 监控引擎通过 ServiceMonitor 对象获知从何处以及如何抓取指标。对于每一个监控目标，您需要应用一个 ServiceMonitor 对象以使应用程序（或导出器）与 KubeSphere 挂钩。

在 KubeSphere v3.0.0，您需要将 ServiceMonitor 和应用（或导出器）打包到 Helm Chart 中以便重复使用。在未来的版本中，KubeSphere 将提供图形化界面以方便操作。

请参阅[监控示例 Web 应用](../examples/monitor-sample-web/)了解如何打包 ServiceMonitor 和应用。

### 步骤 3：实现指标可视化

大约两分钟后，KubeSphere 监控引擎开始抓取和存储指标，随后您可以使用 PromQL 查询指标并设计操作面板和监控面板。

请参阅[查询](../visualization/querying/)了解如何编写 PromQL 表达式。有关监控面板功能的更多信息，请参阅[可视化](../visualization/overview/)。