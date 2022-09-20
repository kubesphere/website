---
title: '基于 CoreDNS 和 K8s 构建云原生场景下的企业级 DNS'
tag: 'KubeSphere'
keywords: 'KubeSphere,  Kubernetes, CoreDNS, DNS'
description: '结合 KubeSphere 和 CoreDNS，搭建一个云原生的企业 DNS 系统，实现统一配置，监控运维、弹性伸缩。'
createTime: '2022-07-19'
author: ' 马伟'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-coredns-cover.png'
---

容器作为近些年最火热的后端技术，加快了很多企业的数字化转型进程。目前的企业，不是在使用云原生技术，就是在转向云原生技术的过程中。在容器化进程中，如何保持业务的平稳迁移，如何将现有的一些服务设施一并进行容器化迁移，也是众多企业较为关注的点。

以 DNS 为例，如何构建一个云原生的企业 DNS 系统？

## CoreDNS 简介

CoreDNS 是一个 Go 语言编写的灵活可扩展的 DNS 服务器，在 Kubernetes 中，作为一个服务发现的配置中心，在 Kubernetes 中创建的 Service 和 Pod 都会在其中自动生成相应的 DNS 记录。Kubernetes 服务发现的特性，使 CoreDNS 很适合作为企业云原生环境的 DNS 服务器，保障企业容器化和非容器化业务服务的稳定运行。

构建企业 DNS 服务器时，一般会有以下需求：

+ 用户外网域名访问服务；
+ 混合云业务迁移、数据共享、容灾；
+ 开发代码 IP 写死导致架构可用性、弹性无法实现；
+ 统一 DNS 管理需求，含上下级平台对接；
+ DNS 劫持等网络安全风险；
+ 存量代码固定域名访问；
+ 集群外域名访问；

相比于 Bind 开源方案或 Windows Server DNS 商业 DNS 服务器，CoreDNS 有以下优势：

+ 无商业许可要求，降低投资成本；
+ 轻量化，通过插件实现功能添加；
+ 支持 DNS，DNS over TLS，DNS over HTTP/2，DNS over gRPC 协议；
+ 提供 kubernetes 服务发现；
+ 支持对接 Route53/Google Cloud DNS/AzureDNS；
+ 支持集成 Prometheus， OpenTracing，OPA，带来更全面的运维体验；
+ 支持整合容器管理平台，提供统一 DNS 系统运维。

构建企业云原生 DNS 前，对 CoreDNS 做一个更深入的了解。

## CoreDNS 运行原理与插件介绍

CoreDNS 基于 Caddy 框架实现模块化设计，每个插件承载相应的具体功能，对于 DNS 系统而言，CoreDNS 使用 File，ETCD 插件等加载 DNS 记录，使用 Kubernetes 插件实现集群服务发现，外部 DNS 请求到达 CoreDNS 后，根据插件调用链依次处理 DNS 请求。

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191456612.png)

CoreDNS 社区官方提供了 50 多种插件，开发者亦可根据需求开发个性化的外部插件。CoreDNS 常用插件如下图，根据使用场景，可分为运维、DNS 处理、后端数据存储等三个类别。

CoreDNS 定义 Corefile 配置文件，服务器在加载 Corefile 后处理 DNS 请求，对于以下插件，只需在 Corefile 中引用即可，之后 CoreDNS 会使用插件链进行调用，插件链可参考以下链接： https://github.com/coredns/coredns/blob/master/plugin.cfg

![](https://pek3b.qingstor.com/kubesphere-community/images/coredns-1.png)

## 设计一个基于 CoreDNS 的分层 DNS 架构

在熟悉 CoreDNS 特性后，可设计企业的 DNS 架构：

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191457667.png)

DNS 架构以外网 DNS、内网 DNS、分区 DNS 组成：

外网 DNS：

+ 使用 DNSSEC、DOT、DOH 等保障 DNS 安全；
+ 缓存 DNS 记录；
+ 构建 DNS 实例自动伸缩，应对高 QPS 需求；

内网 DNS：

+ Kubernetes 服务发现；
+ 构建上游 DNS 区域；

分区 DNS：

+ 建立开发、测试、UAT、生产等区域 DNS；
+ NodeLocalDNS 提高性能；
+ 设置转发器处理递归 DNS 请求；

## KubeSphere 部署 CoreDNS

由于 CoreDNS 是一个 CNCF 毕业的云原生项目，是目前支持云原生最好的一个 DNS 服务器，用户可直接在 KubeSphere 应用商店一键安装。KubeSphere 提供了基于 Helm 模板的应用商店，支持云原生应用的生命周期管理，提供开发人员应用上传、测试，版本提交，应用管理人员进行审核、发布等流程管理。用户在应用商店选择 CoreDNS 应用后，可按需部署于不同集群的不同项目中，并自定义应用模板配置：

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191458419.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191458571.png)

## 服务发现与 DNS 配置

部署 CoreDNS 后，对于运维人员来说，CoreDNS 的配置大体分为两类：一类为 Kubernetes 配置，一类为 DNS 配置。CoreDNS 提供了 Kubernetes 插件，支持在 kubernetes 集群中读取区域数据，并根据 Pod 和 Service 的域名记载相应的 A 记录和 PTR 记录。

这是一个 Kubernetes 集群中的 CoreDNS corefile 默认配置，CoreDNS 会在 53 端口读取 cluster.local 后缀的 Kubernetes 集群 A 记录和 PTR 记录。并将 CoreDNS 收集到的监控指标通过 9153 端口输出到集群内的 Prometheus。而 Kubernetes 不同类型 Service 的 DNS 记录格式，CoreDNS 也有相应标准进行记录。

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191459986.png)

设置完 Kubernetes 后，可以设置其他业务需求的 DNS 配置，如：

+ 设置不同的存根域；
+ 设置存根域静态 DNS 条目；
+ 面对存量代码，设置域名重写；
+ 面对集群外服务，设置 DNS 转发；
+ 设置日志和监控集成；
+ 设置缓存、健康、就绪检查及链路追踪；

根据以上配置，就构建了一个基础的企业云原生 DNS 系统：

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191459705.png)

## DNS 服务暴露

对于集群外的服务而言，存量业务可能还是一些虚拟化和裸机的应用，若和集群网络无法互联，如何在业务迁移时访问新的 DNS 服务？

KubeSphere 提供了一个开源项目——OpenELB 来解决云原生环境下的服务暴露问题，这是一个 CNCF 的沙箱项目。OpenELB 通过物理环境的交换机使用 BGP 协议将 LoadBalancer 类型服务的 ExternalIP 宣告出去，在 IP 可达的环境下集群外部业务即可通过 EIP 访问 Kubernetes 服务资源。

![](https://pek3b.qingstor.com/kubesphere-community/images/nTGWjda.png)

对于集群外需要设置 DNS 服务器的服务资源，可通过 OpenELB 使用 EIP 暴露 CoreDNS ，即可访问 DNS 服务 。

在 KubeSphere 3.3 版本，用户可在开启集群网关 / 项目网关时，在网关访问 LoadBalancer 模式下，选择“OpenELB”负载均衡提供商，之后创建的 LoadBalancer 服务都会从 OpenELB 建立的 EIP Pool 中分配 EIP，供集群外部访问。

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191459554.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191500006.png)

## DNS 监控运维

为保障 CoreDNS 稳定运行，运维人员还需在基础设施侧完善 DNS 系统的日志、监控、告警、通知功能，KubeSphere 提供了简单易用的监控面板、日志管理与落盘，多维度的告警策略和消息，以及对接多个企业应用（邮件，钉钉， 企业微信）的通知系统，时刻关注业务运行状态。

此处以一个系统管理员视角，展示了在 KubeSphere 日志系统搜寻 NXDOMAIN 类型 DNS 回复的结果。

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191501258.png)

通过 KubeSphere 自定义监控面板，设置一个基于 CoreDNS 指标的监控面板，KubeSphere 内置了众多监控面板，用户可直接使用模板构建亦可使用 PromQL 创建面板：

![](https://pek3b.qingstor.com/kubesphere-community/images/Vqdy0FI.png)
![](https://pek3b.qingstor.com/kubesphere-community/images/DGMyVa6.png)
![](https://pek3b.qingstor.com/kubesphere-community/images/202207191501390.png)

通过 KubeSphere 告警和通知组件，用户可基于预置规则模板（CPU、内存、磁盘、网络、异常率）或使用 PromQL 语句自定义告警规则，此处定义当 CoreDNS CPU 用量大于等于 0.1Core 系统触发告警：

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191502572.png)

KubeSphere 针对租户设计了通知模板，包含多种通知系统集成，此处使用邮件将“重要告警”，“危险告警”条件的告警消息发送给邮件接收人。

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191502348.png)

当告警触发后，即可在告警消息和通知历史处查看到相应的条目，此时用户也会收到一封告警邮件了：

![](https://pek3b.qingstor.com/kubesphere-community/images/uAQHJ96.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/bUlfrp1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/b1ZUqQR.png)

在高并发 DNS 请求场景中，还需对 CoreDNS 进行自动伸缩设计，通常考虑到服务高可用性和性能考量，可参考以下计算规格和调度策略设计：

+ 副本打散，跨可用区 / 节点。
+ 避免所在节点 CPU、内存过高。
+ 通常设计副本数为 2。QPS 与 CPU 消耗正相关，单 CPU——1w+QPS
+ Kubernetes 集群下，CoreDNS 副本数与集群节点配置 1:8。
+ 业务峰值 CPU 占用 >1Core，水平扩容。

通过 KubeSphere 自动伸缩机制，可设置基于 CPU 用量的自动伸缩策略，保障 CoreDNS 在瞬时高并发场景稳定运行。

![](https://pek3b.qingstor.com/kubesphere-community/images/202207191503730.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/coredns-2.png)

## 总结

以上就是建设一个云原生的 DNS 系统的全部内容了，可以看出，在云原生时代，新的技术层出不穷，IT 系统的部门和人员也越发趋于协同作战，以往构建一个 DNS 系统可能只需要安装一套稳定能进行 DNS 解析的系统，并实现主备切换即可。在应用驱动基础架构转型的云原生时代，基础服务应用还更需要考虑异构系统的连接，灵活简便的安装升级管理，更强大的可靠性和自愈能力，日志监控通知系统的完善，还有更适合实际业务需求的弹性设计，来加速应用现代化，推动业务应用持续转型。
