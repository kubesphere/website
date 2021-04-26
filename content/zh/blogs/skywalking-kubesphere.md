---
title: 'KubeSphere 部署 SkyWalking 至 Kubernetes 开启无侵入 APM'
tag: 'SkyWalking,Kubernetes,APM,KubeSphere'
createTime: '2020-03-11'
author: 'Feynman'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200311155321.png'
---

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311155321.png)

Kubernetes 天然适合分布式的微服务应用。然而，当开发者们将应用从传统的架构迁移到 Kubernetes 以后，会发现分布式的应用依旧存在各种各样的问题，例如大量微服务间的调用关系复杂、系统耗时或瓶颈难以排查、服务异常定位困难等一系列应用性能管理问题，而 APM 正是实时监控并管理微服务应用性能的利器。

## 为什么需要 APM

APM 无疑是在大规模的微服务开发与运维场景下是必不可少的一环，APM 需要主要从这三个角度去解决三大场景问题：

- 测试角度：性能测试调优监控总览，包括容器总体资源状况（如 CPU、内存、IO）与链路总体状况
- 研发角度：链路服务的细节颗粒追踪，数据分析与数据安全
- 运维角度：跟踪请求的处理过程，来对系统在前后端处理、服务端调用的性能消耗进行跟踪，实时感知并追踪访问体验差的业务

## 为什么选择 Apache SkyWalking

 社区拥有很丰富的 APM 解决方案，比如著名的 Pinpoint、Zipkin、SkyWalking、CAT 等。在经过一番调研后，KubeSphere 选择将 **Apache SkyWalking** 作为面向 Kubernetes 的 APM 开源解决方案，将 Apache SkyWalking 集成到了 KubeSphere，作为应用模板在 **KubeSphere 容器平台** 提供给用户一键部署至 Kubernetes 的能力，进一步增强在微服务应用维度的可观测性。

 ![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311122646.png)

 Apache SkyWalking 在 2019 年 4 月 17 正式成为 **Apache 顶级项目**，提供分布式追踪、服务网格遥测分析、度量聚合和可视化一体化解决方案。Apache SkyWalking 专为微服务、云原生和基于容器的架构而设计。这是 KubeSphere 选择 Apache SkyWalking 的主要原因。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311150734.png)

 并且，Apache SkyWalking 本身还具有很多优势，包括多语言自动探针，比如 Java、.NET Core 和 Node.JS，能够实现无侵入式的探针接入 APM 检测，轻量高效，多种后端存储支持，提供链路拓扑与 Tracing 等优秀的可视化方案，模块化，提供 UI、存储、集群管理多种机制可选，并且支持告警。同时，Apache SkyWalking 还很容易与 SpringCloud 应用进行集成。

Apache SkyWalking 架构图如下，关于详细的架构介绍，大家可以在 Apache SkyWalking  `https://skywalking.apache.org/` 官网找到。

 ![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311123020.png)


## 在 KubeSphere 部署 Apache SkyWalking

接下来我们通过一个完整的示例演示在 KubeSphere 部署 Apache SkyWalking，并接入一个 SpringCloud 示例应用，在 Apache SkyWalking 的 Dashboard 展示 APM 效果。

首先，下载 Apache SkyWalking 的 Helm Chart，然后通过 KubeSphere 将 Chart 上传至应用商店，这部分的步骤可以参考 KubeSphere 官方文档（kubesphere.io/docs），本文不再赘述。

KubeSphere 提供了基于 Helm 完整的应用生命周期管理的能力，应用通过审核后即可上架，并提供给平台所有用户一键部署至 Kubernetes 的选项。

> 提示：我们对 Apache SkyWalking 的 Helm Chart（6.5.0），针对 Helm 2 作了适配，可以在 `https://github.com/kubesphere/helm-charts` 获取 Chart 文件。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311124308.png)

我们可以在应用商店访问 Apache SkyWalking，点击 Deploy 并选择企业空间与项目，取消项目的 CPU 与 Request Limit，即可快速部署 Apache SkyWalking 至 Kubernetes。

下面，我们在 KubeSphere Console 查看 SkyWalking 的应用与 Workload 运行状态。

**Application**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311165504.png)

**Deployment**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311130907.png)

**Statefulset**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311131017.png)

当我们在 Application 与 Workloads 列表下，看到应用状态显示 **active** 并且 SkyWalking 资源都显示 Running，说明 SkyWalking 部署成功。接下来，可以在 Service 列表中，将 SkyWalking UI 服务的外网访问类型设置为 **NodePort**，即可在浏览器通过 `http://IP:NodePort` 访问 SkyWalking Dashboard。

> 提示：若您的 KubeSphere 是部署在云上或物理机，可以借助 LoadBalancer 插件以 LoadBalancer 类型去暴露服务至集群外部。

**Services**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311131246.png)

## 部署 SpringCloud 示例应用

在本文中，我们准备了一个简单的 SpringCloud 示例应用，使用 Apache SkyWalking 官方的镜像（apache/skywalking-base:6.5.0），为 SpringCloud 微服务以 initContainer 的方式注入 Agent 到容器中。这也正是 SkyWalking Agent 巧妙之处，无需侵入代码或对原有的业务镜像改造，就能快速接入 APM。

首先，通过 Git 将 SpringCloud 示例应用的代码拉取到本地。

```bash
git clone https://github.com/kubesphere/tutorial.git
```

然后进入 `tutorial/tutorial 6 → skywalking/6.5.0/apm-springcloud-demo/` 目录，分别将 **apm-eureka.yml** 与 **apm-item.yml** 文件中的 Agent Collector 的后端服务地址，修改为 `skywalking-oap` 服务的 DNS 地址与端口。

```
env:
···
  - name: SW_AGENT_COLLECTOR_BACKEND_SERVICES
    value: skywalk-1h6lqf-skywalking-skywalking-oap.demo:11800 # skywalking oap 后端服务地址
```  

DNS 地址与服务端口，可以通过 KubeSphere Console 地址获取。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311142356.png)

然后，我们可以通过 kubectl 对上述克隆过的仓库 **apm-springcloud-demo** 目录下，通过 kubectl 快速部署应用，指定 namespace 为 KubeSphere 上的 demo 项目。

```
$ kubectl apply -f apm-springcloud-demo -n demo
deployment.apps/apm-eureka created
deployment.apps/apm-item created
service/apm-eureka created
service/apm-item created
```

此时在 KubeSphere 可以看到，示例应用的工作负载 **apm-eureka** 与 **apm-item** 都已经成功运行。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311142759.png)

接下来，只需要对其中一个服务 **apm-item** 发送一些测试请求模拟用户访问流量，就可以访问 SkyWalking 查看数据效果的展示了。

## 访问 SkyWalking 查看 APM

在上述 yaml 文件中，我们已对 SpringCloud 示例应用以 initContainer 的方式注入了 Agent，因此可以直接在 SkyWalking 的 Service Dashboard 查看链路效果与拓扑关系。可以在右下角将时间范围稍作调整，刷新后就可以看到两个示例服务的 Global Heatmap、Global Response Time、Global Top Throughput 以及 Global Top Slow Endpoints。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311143327.png)

切换 Service，可以看到一些服务相关的信息，如平均响应时间、平均吞吐量、平均时延统计、SLA 等监控图表。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311144738.png)

在 Endpoints 与 Instance，还有非常丰富端点与 JVM 相关的应用指标，对 Java 类应用非常友好。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311145321.png)

点击上边栏的 Topology，可以看到当前的示例应用的多个服务依赖拓扑关系。服务拓扑一目了然，代码再复杂也不怕了。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311143728.png)

点击 Trace，可以看到服务间的 Tracing 状况。左边是当前所有的访问请求，任意选择一项，可以在右边看到一个详细的链路追踪过程与 Span 信息：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311144031.png)

选择任意一个 Span，在左侧可以看到 Span 详情，快速查看 Endpoint、http.method、status_code 的信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311144527.png)

Apache SkyWalking 还支持告警与 Metrics 对比，我们不在本文中一一赘述，感兴趣的同学可以参考 SkyWalking 官方文档深入研究。

## 总结

本文在基于 Kubernetes 的微服务场景下，借助 KubeSphere 容器平台与 Apache SkyWalking 这两大开源工具，通过一个完整的 SpringCloud 示例应用，演示了如何开启 APM，为业务的可持续运营保驾护航。

## 活动预告

为了让大家更深入了解开源治理与开源文化，我们专门邀请到了 **Apache SkyWalking Founder** 吴晟老师，为大家带来以 **开源治理** 为主题的线上直播分享活动，有机会与吴晟老师在直播中提问互动，参与分享可扫描二维码获取链接，在 Web 端或移动端拨入。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200311161820.png)

## 关于 KubeSphere

KubeSphere 是在 Kubernetes 之上构建的以应用为中心的开源容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，包括 Kubernetes 资源管理、DevOps (CI/CD)、应用生命周期管理、微服务治理 (Service Mesh)、多租户管理、监控日志、告警通知、存储与网络管理、GPU support 等功能，帮助企业快速构建一个强大和功能丰富的容器云平台。
