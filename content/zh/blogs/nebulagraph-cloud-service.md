---
title: 'NebulaGraph 的云产品交付实践'
tag: 'KubeSphere, 图数据库'
keywords: 'KubeSphere, Nebula Graph, Kubernetes, cloudnative'
description: '本文是整理自 2021 年 KubeSphere 社区组织的杭州站 Meetup 上讲师乔雷的分享，主要介绍了数据库产品云上交付的多种形式；基于公有云厂商开发产品如何降本增效；IaC 产品深度融合到 SaaS 平台基础设施层。'
createTime: '2022-09-14'
author: '乔雷'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/nebulagraph-cloudservice-cover.png'
---

## NebulaGraph 介绍

NebulaGraph 是由杭州悦数科技有限公司自主研发的一款开源分布式图数据库产品，擅长处理千亿节点万亿条边的超大数据集，同时保持毫秒级查询延时。得益于其 shared-nothing 以及存储与计算分离的架构设计，NebulaGraph 具备在线水平扩缩容能力；原生分布式架构，使用 Raft 协议保证数据一致性，确保集群高可用；同时兼容 openCypher，能够无缝对接 Neo4j 用户，降低学习及迁移成本。

NebulaGraph 经过几年的发展，目前已经形成由云服务、可视化工具、图计算、大数据生态支持、工程相关的 Chaos 以及性能压测等产品构成的生态，接下来会围绕云服务展开，分享落地过程中的实践经验。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141554143.png)

## 交付模式

NebulaGraph 在云上的交付模式分为自管模式、半托管模式与全托管模式三种。

### 自管模式

自管模式基于各家云厂商的的资源堆栈编排产品交付，例如 AWS Cloudformation、Azure ResourceManager、Aliyun Resource Orchestration Service、GCP DeploymentManager 等等。自管模式的特点是所有资源部署在客户的租户内，用户自己运维管理，软件服务商负责将产品上架到 Marketplace，按照最佳实践给客户提供服务配置组装和一键部署的能力，相比于传统模式下以天计的交付周期，现在几分钟内就可以在云上部署一个图数据库。

### 半托管模式

半托管模式是在自管模式的基础上为客户提供了代运维的能力，阿里云计算巢通过将应用发布为服务的方式，为服务商提供了一个智能简捷的服务发布和管理平台，覆盖了服务的整个生命周期，包括服务的交付、部署、运维等。当客户的集群出现问题时，服务商运维人员的所有操作均被记录，资源操作通过 ActionTrail 记录日志，实例操作保留录屏，还原运维过程，做到运维安全合规可追溯，避免服务纠纷。

NebulaGraph 采用存储与计算分离的架构。存储计算分离有诸多优势，最直接的优势就是，计算层和存储层可以根据各自的情况弹性扩容、缩容。存储计算分离还带来了另一个优势：使水平扩展成为可能，通过计算巢提供的弹性伸缩能力，保障自身扩缩容需要。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141554802.png)

### 全托管模式

全托管模式交付由服务商托管的图数据库产品，客户按需订阅付费，只需选择产品规格与节点，NebulaGraph 全栈产品便可在几分钟内交付。客户无需关注底层资源的监控运维，数据库集群的稳定性保障工作，这些都将由服务商解决。

NebulaGraph DBaaS 依托于 Kubernetes 构建，Kubernetes 的架构设计带来以下优势：通过声明式 API 将整体运维复杂性下沉，交给 IaaS 层实现和持续优化；抽象出 Loadbalance Service、Ingress、NodePool、PVC 等对象，帮助应用层可以更好通过业务语义使用基础设施，无需关注底层实现差异；通过 CRD（Custom Resource Definition）/ Operator 等方法提供领域相关的扩展实现，最大化 Kubernetes 的应用价值。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141554811.png)

## 落地实践

落地实践主要讲述全托管模式产品的架构演进，云原生技术与业务平台的融合。

### IaC

下图是 Azure 业务侧基础设施的架构，初始配置时对接到管理平台需要耗时几个小时，这在有大量用户申请订阅实例的情况下是完全不能接受的。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141554654.png)

因此，我们想到了将基础设施模板化，先定义出 dev、test、prod 三种运行环境，再将资源划分为 VPC & Peering、Private DNS Zone、Kubernetes、Database、Container Registry、Bastion 等几个类别，使用 terraform 完成自动化配置。但是，仅完成这一步是远远不够的，为了满足客户侧 Kubernetes 集群及时弹性要求，我们定义了 Cluster CRD，将 Cluster 的所有操作放入 Operator 里执行，terraform 的可执行文件与模板代码打包到容器镜像后由 Job 驱动运行，Operator 向 Job 注入云厂商、地域、子网等环境变量，业务集群的状态保存到 Cluster Status 里。到此，配置基础设施实现了手动向自动化的演进。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141555835.png)

### Operators

有一本关于 Kubernetes 设计模式的书籍 《 Kubernetes Patterns 》，关注这个领域的同学想必不会陌生，这本书的出现是针对目前云原生时代的设计模式，之前的设计模式更多的是对单个模块或是简单系统的，但是云原生时代的开发方式和理念与之前的主机开发模式还是存在很大差异的。

在 DBaaS 平台上线初期，创建一个订阅实例大致由以下流程构成：

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141555055.png)

我们在数据库里定义了 Task 表，包含 succeed、failed、running、pending 四种状态，每个订阅实例流程的任务节点状态会存储到 Task 表。服务启动后会拉起一个监控线程，它主要负责定时检查订阅实例状态，当订阅实例状态异常后会发送告警通知，然后根据预期的状态执行恢复任务。订阅实例的生命周期管理是一个长耗时的异步任务，这里涉及基础设施资源管理，业务数据的更新等步骤，针对异常情况下不同流程的恢复处理导致业务逻辑复杂，后期再维护的成本逐渐增加，因此，我们对服务做了拆分重构。

我们先行调研了工作流编排系统，比如 Uber 的 Cadence，基础设施编排领域的成熟案例有 Banzai Cloud，Hashicorp，但是也因引入三方系统带来额外的运维成本。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141559140.png)

另一套方案基于 Operator 的设计模式实现，核心原理是循环控制协调，直到运行成功，将每个订阅实例的管理流程放入协调器里，实例状态保存到到 Status ，平台业务层模块驱动 Operator 并同步各种 Event。最终我们选择了基于 Operator 的实现方案，将各种长耗时的任务剥离出来抽象为 CRD，统一交由 workflow-operator 来管理。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141559503.png)

经过重构后，订阅实例的生命周期管理非常简洁，复杂度大幅降低。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141559326.png)

### 成本控制

随着企业将更多核心业务从数据中心迁移到云上，越来越多的企业迫切需要对云上环境进行预算制定、成本核算和成本优化。同样地，客户也对云上的费用支出异常敏感。

首先，我们在存储层服务做了优化，通过 NVMe cache 降低存储资费。NVMe 是专门为 NAND、闪存等非易失性存储设计的，NVMe 协议建立在高速 PCIe 通道上。使用NVMe Cache，可以取得相比于同等大小的高性能磁盘不差的性能，而成本至少可以减少 50%。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141559230.png)

上次分享有介绍过我们的日志存储基于 ES 系统，大家都知道，ES 系统存储是非常耗费资源的，因此我们对业务平台的应用日志存储做了优化。主要是对 filebeat 做了定制开发，支持多家云厂商的对象存储服务，改造 Rotater 支持文件顺序索引，可以按照行数切割文件；基于 fsnotify 库监听文件事件，将切割出来的小文件上传到对象存储；当获取日志时，可以根据 offset 计算出对应的日志文件索引从而快速获取日志。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141608109.png)

从用户控制台到数据库的请求链路也做了相应优化。每个云厂商都会为类型为 LoadBalancer 的 Service 或者 Ingress 提供配套的服务组件，这些组件可以解决负载均衡设备配置流程繁琐的问题，通过在 Ingress 资源的 Annotation 里添加几个配置项，就可以轻松拉起一个负载均衡设备。但凡事总有利弊，作为服务商简化了管理，对应的在用户端就会增加资费成本。另外，在实践的过程中发现每家云厂商对基础设施支持的完成度不尽相同，综合以上因素考虑，我们基于 nginx-ingress-controller 做了链路优化，在管理平台与业务集群打通网络的条件下，通过 External Service 将流量转发到对应的订阅实例。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141611430.png)

在开发测试流程上我们基于 KubeSphere 做了以下尝试。

将基础设施层抽象出 Cloud 接口，里面包含节点池、 负载均衡、DNS 域名等各个子接口，我们针对本地环境提供 Local Provider 的实现，除非像 Privatelink 比较特殊的服务，但是不会影响整体功能测试。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141612067.png)


我们将 Kubernetes 集群分为两种，一类是由云厂商托管的 cloud 集群，另外一类就是自己搭建的本地集群，将他们导入到 KubeSphere 统一管理。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141612550.png)

控制成本的核心是资源回收。我们通过 CronJob 定时创建、销毁 cloud 类型的开发、测试集群，同时设置 K8s 集群的系统节点池规格满足最小化运行需求，内测期间无访问流量的实例自动回收，通过这些策略将成本控制在一个比较理想的状态。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141612349.png)

为了给不熟悉 Kubernetes 的同学测试业务流程，我们为必要的服务组件提供了 helm charts 包，将他们上传到 KubeSphere 应用仓库然后提供应用模板来测试流程。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141612646.png)

## 总结与展望

### 总结

经过 1 年多的实践，我们总结出以下几点心得：

为了满足安全合规、成本优化、提升地域覆盖性和避免厂商锁等需求，以及客户出于数据主权和安全隐私的考虑，混合云/多云架构已经成为通用解决方案。云原生软件架构的目标是构建松耦合、具备弹性、韧性的分布式应用软件架构，可以更好地应对业务需求的变化和发展，保障系统稳定性。IaC 可以进一步延伸到 Evething as Code，覆盖整个云原生软件的交付、运维流程，释放生产力。成本优化至关重要，不论是对客户还是对服务商而言。

### 展望

在应用研发的过程中，越来越多的开发者接受了无服务器的理念。Serverless 数据库可按需求自动缩放配置，根据应用程序的需求自动扩展容量，并内置高可用和容错能力，采用 Serverless 数据库开发者将无需考虑选型问题，只需要关注如何设计 schema ，怎样查询数据，及如何进行相应的优化即可。对于 NebulaGraph，我们期望未来可以帮助用户实现端到端的 Serverless 架构，进一步提升用户体验。

![](https://pek3b.qingstor.com/kubesphere-community/images/202209141612178.png)