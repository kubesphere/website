---
title: '云原生可观测性之日志管理'
author: '霍秉杰，马丹'
createTime: '2019-06-25'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20190930095954.png'
---

日志通常含有非常有价值的信息，日志管理是云原生可观测性的重要组成部分。不同于物理机或虚拟机，在容器与 Kubernetes 环境中，日志有标准的输出方式(stdout)，这使得进行平台级统一的日志收集、分析与管理水到渠成，并体现出日志数据独特的价值。本文将介绍云原生领域比较主流的日志管理方案 EFK 、 KubeSphere 团队开发的 FluentBit Operator 以及 KubeSphere 在多租户日志管理方面的实践。此外还将介绍受 Prometheus 启发专为 Kubernetes 日志管理开发，具有低成本可扩展等特性的开源软件 Loki。

## 什么是可观测性

近年来随着以 Kubernetes 为代表的云原生技术的崛起，可观测性 ( Observability ) 作为一种新的理念逐渐走入人们的视野。云原生基金会 ( CNCF ) 在其 Landscape 里已经将可观测性单独列为一个分类，狭义上主要包含监控、日志和追踪等，广义上还包括告警、事件、审计等。在此领域陆续涌现出了众多新兴开源软件如 Prometheus, Grafana, Fluentd, Loki, Jaeger 等。  

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001085607.png)


日志作为可观测性的重要组成部分在开发、运维、测试、审计等过程中起着非常重要的作用。著名的应用开发十二要素中提到：“日志使得应用程序运行的动作变得透明，应用本身从不考虑存储自己的输出流。 不应该试图去写或者管理日志文件。每一个运行的进程都会直接输出到标准输出（stdout）。每个进程的输出流由运行环境截获，并将其他输出流整理在一起，然后一并发送给一个或多个最终的处理程序，用于查看或是长期存档。” 

在物理机或者虚拟机的环境中，日志通常是输出到文件，并由用户自己管理，这使得日志的集中管理和分析变得困难和不便。而 Kubernetes 、docker 等容器技术直接将日志输出到 stdout，这使得日志的集中管理和分析变得更为便捷和水到渠成。

Kubernetes 官网文档给出的通用日志架构如下图所示，包含日志 Agent，后端服务和前端控制台等三个部分。无论是成熟的日志解决方案如 ELK/EFK , 还是云原生领域 2018 年开源的 Loki 都具有相似的架构，下面将分别介绍 ELK/EFK , [Loki](https://github.com/grafana/loki) 以及 [KubeSphere](https://github.com/kubesphere/kubesphere)) 在这方面的贡献。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001090839.png)

## 新旧势力的联姻：从 ELK 到 EFK，从 Fluentd 到 Fluent Bit

ELK 是 Elasticsearch, Logstash, Kibana 的简称，是目前比较主流的开源日志解决方案。  而 2019 年 4 月从 CNCF 毕业用 C 和 Ruby 编写的 Fluentd 作为通用日志采集器，以其高效、灵活、易用的特性逐渐取代了用 Java 编写的 Logstash 成为新的日志解决方案 EFK 中的重要一员，并在云原生领域得到广泛认可与应用。Google 的云端日志服务 Stackdriver 也用修改后的 Fluentd 作为 Agent 。然而 Fluentd 开发团队并没有停滞不前，推出了更为轻量级的完全用 C 编写的产品 Fluent Bit，两者的对比如下图所示：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001090917.png)

可以看到 Fluent Bit 比 Fluentd 占用资源更少，更适合作为日志收集器；而 Fluentd 插件非常多，更适合作为日志的聚合器。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001090933.png)

## FluentBit Operator 及其在 KubeSphere 中的应用 

Fluent Bit 虽然更加轻量和高效，但也有它的问题：配置文件变更后无法优雅的自动重新加载新的配置。详见官方 Github issue： [#PR 842](https://github.com/fluent/fluent-bit/pull/842) 和 [#issue 365](https://github.com/fluent/fluent-bit/issues/365)

为了解决上述问题，KubeSphere 团队开发了 [FluentBit Operator](https://github.com/kubesphere/fluentbit-operator) 并将其应用到 KubeSphere 中作为日志收集器。FluentBit Operator 架构及原理如下图所示：

1. 在 FluentBit Pod 的主 Container 里加入 FluentBit Controller 进程控制 FluentBit 主进程的启停；

2. 加入 ConfigMap Reload Sidecar Container 用于监控 FluentBit 配置文件所在 ConfigMap 的变化，并在监测到变化的时候调用 FluentBit Controller 的 reload 接口:  [http://localhost:24444/api/config.reload](http://localhost:24444/api/config.reload) 

3. 接下来 FluentBit Controller 将重启 FluentBit 主进程以达到加载新的配置文件的目的。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091114.png)

### FluentBit Operator 架构图
        
在 KubeSphere 中，选择 Elasticsearch 作为日志后端服务，使用 Fluent Bit 作为日志采集器，KubeSphere 日志控制台通过 FluentBit Operator 控制 FluentBit CRD 中的 Fluent Bit 配置 。(用户也可以通过 kubectl edit fluentbit fluent-bit 以 kubernetes 原生的方式来更改 FluentBit 的配置)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091135.png)

**KubeSphere 日志系统架构图**
        
通过 FluentBit Operator，KubeSphere 实现了通过控制台灵活的添加/删除/暂停/配置日志接收者

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091157.png)

**KubeSphere 日志配置界面**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091216.png)

**KubeSphere 日志搜索界面**

## 多租户日志管理

多租户的特性目前在 Kubernetes 社区备受关注，实现方案多种多样，比如有软多租、硬多租等。具体到日志管理方面也是各有不同，Loki 支持的多租户是通过租户 ID ( Tenant ID) 实现了对多租户的支持；KubeSphere 通过 workspace 实现了租户间的隔离，下面我们简单了解一下 KubeSphere 日志管理在多租户方面的实践 (KubeSphere 即将发布的 v2.1 版对日志功能有显著增强，比如对中文日志检索更好的支持，自动注入收集落盘日志的 Sidecar 等)。

可以看到 KubeSphere 是基于 RBAC 的 3 层多租户架构，Cluster/Workspace/Project 三个层级均有不同级别的 Roles 与之对应。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091227.png)

在能访问到日志数据(或其他服务)之前，需要经过 API Gateway 的认证与授权。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091241.png)


KubeSphere 完整的日志解决方案如下：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091731.png)

## 云原生的亲儿子 Loki : Like Prometheus, but for logs
ELK/EFK 作为日志方案虽然流行，但是也有个众所周知的弱点：占用资源过多，无论是内存还是磁盘存储。究其原因是因为 Elasticsearch 对其中数据做了全文索引，以便于实现快速的全文搜索。对于日志数据来说，很多时候全文索引并不是必要的。除此之外，Elasticsearch 是由 Java 语言开发，相比云原生领域的开发语言 Go，无论是运行效率还是资源占用都处于下风。
云原生领域一直期待有一款由 Go 开发的日志管理软件，Loki 应运而生。Loki 自 2018 年 12 月发布短短 10 个月的时间，Github 上的 Star 数已经达到了 7000+。Loki 由开发 Grafana 的 Grafana Labs 开发，Grafana Labs 中有著名云原生监控软件 Prometheus 的开发者并且提供了云端的 Prometheus 监控服务 Cortex , 而 Loki 正是受到 Prometheus 的启发而开发出来的。因此具有许多和 Prometheus 类似的特性比如：与 Kubernetes 紧密集成、与 Prometheus 共享 Label，与 Prometheus 有相似查询语法的查询语言 LogQL，与 Prometheus 类似的查询函数等，甚至同样可以在 Grafana 里直接查看检索 Loki 的日志数据。除此之外 Loki 的还与 Cortex 共享了很多组件，非常容易水平扩展。

Loki 最重要的特性是存储成本低，资源占用少。Loki 做到这点是在设计之初就有意解决 Elasticsearch 占用资源多的缺点，通过只对 Label 等元数据进行索引，对日志流数据进行压缩存储，并在用户搜索日志文本时通过索引的 Label 缩小查询范围后，实时解压并用类似 grep 一样的机制对日志流数据进行过滤。如下图所示，Loki 的组件包括收集数据的 Agent Promtail , 接收数据的 Distributor, 缓存数据以便批量写入的 Ingester，用于查询数据的 Querier ，这些组件均可以根据负载水平扩展并实现高可用。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091749.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091801.png)
Loki 架构(来源于 Grafana Labs 官方博客)

如下图所示，Loki 的实现了索引和日志数据块分别用不同的存储介质存储，索引可以存到 Cassandra, BoltDB 等；日志数据块可以存到本地磁盘或者云端对象存储或者兼容 S3 协议的 Minio。 如此在实现海量日志数据的低成本存储的同时，还能够满足用户快速查询日志的需求。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001091838.png)

Loki 存储(来源于 Grafana Labs 官方博客)

作为云原生时代出现的日志解决方案, Loki 以其低成本、可扩展和高可用以及与 Kubernetes， Prometheus 紧密集成等特性迅速获得了巨大关注，有望获得 Kubernetes 上如同 Prometheus 一样的地位，成为云原生领域日志管理的首选方案。

## 展望

Kubernetes 的架构为日志的集中管理提供了可能。而陆续涌现的优秀的日志管理方案使得用户可以更好的挖掘日志数据的价值，获得更好的可观测性。KubeSphere 作为开源的 Kubernetes 发行版，将在完善现有 Kubernetes 日志解决方案的基础上（比如多集群日志管理、日志告警等），持续关注受 Prometheus 启发而开发出来的 Loki 并将积极参与到其开发中，争取将业界最领先的日志管理技术集成到 KubeSphere 提供给用户使用。

## 相关资料

KubeSphere 多租户日志管理在 2019 年 6 月份上海的 KubeCon 上以 “[Effective Logging In Multi Tenant Kubernetes Environment](https://static.sched.com/hosted_files/kccncosschn19eng/39/Effective%20Logging%20in%20Multi-Tenant%20Kubernetes%20Environment.pdf)” 的主题进行过分享，相关的 PPT 资料大家可以在 [CNCF 官网](https://kccncosschn19eng.sched.com/event/NroE/effective-logging-in-multi-tenant-kubernetes-environment-benjamin-huo-dan-ma-beijing-yunify-technology-co-ltd) 找到。


