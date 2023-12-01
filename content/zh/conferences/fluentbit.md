---
title: '使用 Fluent Bit 实现云边统一可观测性'
author: '霍秉杰'
createTime: '2022-10-24'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon-a-2022-ben.png'
---

## 议题信息

### 议题简介

随着云原生边缘计算技术的兴起，越来越多的组织开始使用 Kubernetes 结合边缘计算框架来管理边缘的资源和工作负载。其中一些边缘计算框架（如 KubeEdge）将边缘节点作为云端 K8s 集群的一部分进行管理，这对于用户管理边缘节点和边缘应用是个巨大的挑战。

其中一个挑战就是可观测性，例如：

- 与云端使用相同的方式对边缘节点和应用程序进行监控和告警。
- 与云端使用相同的方式收集和检索边缘节点和应用程序日志。
在本次分享中，Fluent Operator maintainers 将讨论以下内容:

- 使用 Fluent Operator 管理云端和边缘环境中的 FluentBit。
- 使用 FluentBit 收集边缘节点和应用的日志，并转发到云端。
- 使用 FluentBit 收集边缘节点和应用程序的监控指标并将其通过 remote write 方式写入云端 Prometheus 长期存储。
- 集中管理边缘和云端的日志和监控指标。

### 分享者简介

霍秉杰是 KubeSphere 可观测性和 Serverless 团队的 Leader，还是 Fluent Operator 和 FaaS 项目 OpenFunction 的创始人，同时也是多个可观测性开源项目的作者和架构师，如 Kube-Events、Notification Manager 等。他热爱云原生和开源技术，是 KEDA、Prometheus Operator、Thanos、Loki、Falco 等项目的贡献者。

### 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeCon-America-2022-ben.mp4" type="video/mp4">
</video>

**以下是本分享对应的文章内容。整理人：米开朗基杨、大飞哥。**

## Fluent Operator 简介

2019 年 1 月 21 日，KubeSphere 社区为了满足以云原生的方式管理 Fluent Bit 的需求开发了 FluentBit Operator，并在 2020 年 2 月 17 日发布了 v0.1.0 版本。此后产品不断迭代，一直维护到 v0.8.0，实现了 Fluent Bit 配置的热加载，而无需重启整个 Fluent Bit 容器。2021 年 8 月，Kubesphere 团队将该项目捐献给 Fluent 社区，并从 v0.9.0 一直持续迭代到 v0.13.0。

2022 年 3 月，FluentBit Operator 正式更名为 Fluent Operator，因为我们增加了对 Fluentd 的支持，而且把 FluentBit CRDs 定义范围从命名空间扩大到集群级别，并于 2022 年 3 月 25 日发布了里程碑版本 v1.0.0。

## 整体架构预览

![](https://pek3b.qingstor.com/kubesphere-community/images/202212011544896.jpeg)

Fluent Operator 可以构建完整的云原生日志采集通道。Fluent Bit 小巧轻量，适合作为 Agent 收集日志；Fluentd 插件丰富功能强大，适合对日志进行集中处理，二者可以独立使用，也可以协作共存，使用方案非常灵活。

### 仅使用 Fluent Bit 收集日志

Fluent Operator 可以非常便捷地部署 FluentBit Daemonset 服务，运行于各计算节点。当然集群层级的 Fluent Bit CRD 也可以配置各种 Input，Filter，Parser，Output 等。Fluent Bit 支持将日志直接导出到 ElasticSearch，Kafka，Loki，S3 等众多目标服务，这些只需配置 CRD 即可。

![](https://pek3b.qingstor.com/kubesphere-community/images/202212011545963.jpeg)

### 仅使用 Fluentd 收集日志

Fluent Operator 可以非常便捷地将 Fluentd 部署为 Statefulset 服务，应用可以通过 HTTP，Syslog 等方式发送日志，同时 Fluentd 还支持级联模式，即 Fluentd 可以接收来自另一个 Fluentd 服务的日志。类比于 Fluent Bit，Fluentd 也支持集群级别的 CRD 配置，可以方便的配置 Input，Filter，Parser，Output 等。Fluentd 内置支持上百种插件，输入输出都非常丰富。

![](https://pek3b.qingstor.com/kubesphere-community/images/202212011545688.jpeg)

### 同时使用 Fluentd 和 Fluent Bit

Fluentd 和 Fluent Bit 在设计架构上极为相似，都有着丰富的社区插件支持，但二者侧重的使用场景有所差异。Fluent Bit 小巧精致，资源消耗少，更适合作为 Agent 来采集日志，而 Fluentd 相对前者功能更加丰富，作为数据中转站或数据治理服务更为贴切。所以绝大多数场景中，二者配合可以构建出灵活高效且扩展性极强的日志收集流水线。

![](https://pek3b.qingstor.com/kubesphere-community/images/202212011614750.jpeg)


## v1.0 后的重要更新

至 Fluent Operator 发布 v1.0.0 至今，仍然在高速迭代。v1.1.0 版本新增了对 OpenSearch 输出的支持；v1.5.0 新增了对 Loki 输出的支持，同时还增加了对监控指标（Metrics）采集的支持，支持清单如下：

* Node Exporter 指标采集
* Prometheus Scrape 指标采集
* Fluent Bit 指标采集
* Prometheus 远程写入的输出信息采集
* OpenTelemetry 输出采集

正是基于对监控指标采集的支持，Fluent Operator 才可以完美构建云边统一的可观测性。

**以上内容关注的是对云端资源的数据采集，下面我们来看看 Fluent Operator 在边缘计算场景下的支持情况。**

我们使用的边缘计算框架是 KubeEdge，下面我给大家介绍下 KubeEdge 这个项目。

## KubeEdge 介绍

KubeEdge 是 CNCF 孵化的面向边缘计算场景、专为边云协同设计的云原生边缘计算框架，除了 KubeEdge 之外还有很多其他的边缘计算框架，比如 K3s。K3s 会在边缘端创建完整的 K8s 集群，而 KubeEdge 只是在边缘端创建几个边缘节点（Edge Node），边缘节点通过加密隧道连接到云端的 K8s 集群，这是 KubeEdge 与 K3s 比较明显的差异。

KubeEdge 的边缘节点会运行一个与 Kubelet 类似的组件叫 Edged，比 Kubelet 更轻量化，用来管理边缘节点的容器。Edged 也会暴露 Prometheus 格式的监控指标，而且暴露方式和 Kubelet 保持一致，都是这种格式：`127.0.0.1:10350/metrics/cadvisor`。

![](https://pek3b.qingstor.com/kubesphere-community/images/202212011458874.jpeg)

## 统一可观测性方案架构

下面着重讲解**如何使用 Fluent Bit 来实现云边统一的可观测性**。

直接来看架构图，云端部署了一个 K8s 集群，边缘端运行了一系列边缘节点。云端通过 Prometheus Agent 从 Node Exporter、Kubelet 和 kube-state-metrics 等组件中收集监控指标，同时还部署了一个 Fluent Operator 用来同时管理和部署云端和边缘端的 Fluent Bit Daemonset 实例。

![](https://pek3b.qingstor.com/kubesphere-community/images/202212011453741.jpeg)

对于边缘节点来说，情况就不那么乐观了，因为边缘节点资源有限，无法部署以上这些组件来收集可观测性数据。因此我们对边缘端的监控指标收集方案进行了改良，将 Prometheus (Agent) 替换为 Fluent Bit，并移除了 Node Expoter，使用更轻量的 **Fluent Bit Node Exporter Metrics 插件**来替代，同时使用 **Fluent Bit Prometheus Scrape Metrics 插件**来收集边缘端 Edged 和工作负载的监控指标。

这个架构的优点是只需要在边缘端部署一个组件 Fluent Bit，而且可以同时收集边缘节点和边缘应用的日志和监控指标，对于资源紧张的边缘节点来说，这是一个非常完美的方案。

## 统一可观测性方案实践

最后给大家演示下如何在边缘端部署 Fluent Bit，并使用它来收集边缘节点的监控指标和日志数据。Fluent Bit 的部署方式通过自定义资源（CR）**FluentBit** 来声明，内容如下：

```yaml
apiVersion: fluentbit.fluent.io/v1alpha2
kind: FluentBit
metadata:
  name: fluentbit-edge
  namespace: fluent
  labels:
    app.kubernetes.io/name: fluent-bit
spec:
  image: kubesphere/fluent-bit:v1.9.9
  positionDB:
    hostPath:
      path: /var/lib/fluent-bit/
  resources:
    requests:
      cpu: 10m
      memory: 25Mi
    limits:
      cpu: 500m
      memory: 200Mi
  fluentBitConfigName: fluent-bit-config-edge
  tolerations:
    - operator: Exists
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: node-role.kubernetes.io/edge
            operator: Exists
  hostNetwork : true
  volumes:
    - name: host-proc
      hostPath:
        path: /proc/
    - name: host-sys
      hostPath:
        path: /sys/
  volumesMounts:
    - mountPath: /host/sys
      mountPropagation: HostToContainer
      name: host-sys 
      readOnly: true
    - mountPath: /host/proc
      mountPropagation: HostToContainer
      name: host-proc 
      readOnly: true
```

我们通过 Node Affinity 将 Fluent Bit 指定部署到边缘节点。为了能够替代 Node Exporter 组件的功能，还需要将 Node Exporter 用到的主机路径映射到容器中。

接下来需要通过自定义资源 `ClusterInput` 创建一个 **Fluent Bit Prometheus Scrape Metrics 插件**来收集边缘端工作负载的监控指标：

```yaml
apiVersion: fluentbit.fluent.io/v1alpha2
kind: ClusterInput
metadata:
  name: prometheus-scrape-metrics-edge
  labels:
    fluentbit.fluent.io/enabled: "true"
    node-role.kubernetes.io/edge: "true"
spec:
  prometheusScrapeMetrics:
    tag: kubeedge.*
    host: 127.0.0.1
    port: 10350
    scrapeInterval: 30s
    metricsPath : /metrics/cadvisor 
```

并通过自定义资源 `ClusterInput` 再创建一个 **Fluent Bit Node Exporter Metrics 插件**来收集边缘节点的监控指标（替代 Node Exporter）：

```yaml
apiVersion: fluentbit.fluent.io/v1alpha2
kind: ClusterInput
metadata:
  name: node-exporter-metrics-edge
  labels:
    fluentbit.fluent.io/enabled: "true"
    node-role.kubernetes.io/edge: "true"
spec:
  nodeExporterMetrics:
    tag: kubeedge.*
    scrapeInterval: 30s
    path :
        procfs: /host/proc
        sysfs : /host/sys
```

最后还需要通过自定义资源 `ClusterOutput` 创建一个 **Fluent Bit Prometheus Remote Write 插件**，用来将边缘端收集到的监控指标写入到 K8s 集群的 Prometheus 长期存储中。

```yaml
apiVersion: fluentbit.fluent.io/v1alpha2
kind: ClusterOutput
metadata:
  name: prometheus-remote-write-edge
  labels:
    fluentbit.fluent.io/enabled: "true"
    node-role.kubernetes.io/edge: "true"
spec:
  matchRegex: (?:kubeedge|service)\.(.*)
  prometheusRemoteWrite:
    host: <cloud-prometheus-service-host>
    port: <cloud-prometheus-service-port>
    uri: /api/v1/write
    addLabels : 
      app : fluentbit
      node: ${NODE_NAME}
      job : kubeedge
```

基于上述步骤，最终我们通过 Fluent Bit 实现了云边统一的可观测性。

## 总结

虽然 Fluent Bit 的初衷是收集日志，但最近也开始支持收集 Metrics 和 Tracing 数据，这一点很令人兴奋，这样就可以使用一个组件来同时收集所有的可观测性数据（Log、Metrics、Tracing）了。如今 Fluent Operator 也支持了这些功能，并通过自定义资源提供了简单直观的使用方式，想要使用哪些插件直接通过自定义资源声明即可，一目了然。

当然，Fluent Operator 这个项目还很年轻，也有很多需要改进的地方，欢迎大家参与到该项目中来，为其添砖加瓦。