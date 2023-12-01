---
title: '使用 OpenFunction 在任何基础设施上运行无服务器工作负载'
author: '霍秉杰，王翼飞'
createTime: '2023-09-27'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-openfunction.png'
---

## 议题信息

### 议题简介

云原生技术的崛起使得我们可以以相同的方式在公有云、私有云或本地数据中心运行应用程序或工作负载。但是，对于需要访问不同云或开源中间件的各种 BaaS 服务的无服务器工作负载来说，这并不容易。在这次演讲中，OpenFunction 维护者将详细介绍如何使用 OpenFunction 解决这个问题，以及 OpenFunction 的最新更新和路线图：

- 使用 Dapr 将 FaaS 与 BaaS 解耦
- 使用 Dapr 代理而不是 Dapr sidecar 来加速函数启动
- 使用 Kubernetes Gateway API 构建 OpenFunction 网关
- 使用 WasmEdge 运行时运行 WebAssembly 函数
- OpenFunction 在自动驾驶行业的应用案例
- 最新更新和路线图

### 分享者简介

霍秉杰：KubeSphere 可观测性、边缘计算和 Serverless 团队负责人，Fluent Operator 和 OpenFunction 项目的创始人，还是多个可观测性开源项目包括 Kube-Events、Notification Manager 等的作者，热爱云原生技术，并贡献过 KEDA、Prometheus Operator、Thanos、Loki 和 Falco 等知名开源项目。

王翼飞：青云科技资深软件工程师，负责开发和维护 OpenFunction 项目。专注于 Serverless 领域的研发，对 Knative、Dapr、Keda 等开源项目有深入的了解和实践经验。

### 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/Run-Serverless-Workloads-on-Any-Infrastructure-with-OpenFunction.mp4" type="video/mp4">
</video>

### PPT 下载

关注公众号【KubeSphere云原生】，后台回复关键词 `KubeCon-2023` 即可获取 PPT 下载链接。

**以下是本分享对应的文章内容。整理人：赵法威。**

## 前言

本文主要包括以下几个部分：

- 构建开源 FaaS 平台的必要性与可⾏性
- OpenFunction 简介
- 冷启动优化：Dapr proxy 模式及 Wasm ⽀持
- OpenFunction 在⾃动驾驶领域的应⽤
- 社区、路线图与 Demo

## 构建开源 FaaS 平台的必要性

什么是 Serverless？加州大学伯克利分校在论文 《A Berkeley View on Serverless Computing》给出了明确定义：Serverless computing = FaaS + BaaS。

对于函数计算平台，函数是不可或缺的，即 FaaS 是主体。同时，FaaS 也需要和后端的 BaaS 服务产生联系，所以丰富的后端服务是函数的重要依托。

云厂商通常提供托管的函数计算（FaaS）和各类后端中间件服务，这样就会把开发者锁定在自己的云平台之上。

现阶段我们也看到，有一些公司因为云上的成本过高，想要下云或者从一个云迁移到另一个云也就是跨云迁移。如果其函数绑定在云的 BaaS 服务上，则不利于跨云的迁移。所以，跨云迁移之后如何去处理各个云厂商 BaaS 服务接口的差异，成了目前较大的挑战。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-1.png)

从另一个角度看，一个 FaaS 平台通常需要支持多种语言，也会利用到众多后端服务。举例来讲，5 种语言需要和 10 种后端服务对接，那么这样做就会有 5×10 即 50 种实现， 还是比较复杂的。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-2.png)

## 构建开源 FaaS 平台的可行性

如何解决上述问题呢？我们可以引入 Dapr 来简化函数与众多后端服务的交互。

Dapr 是一个分布式应用的运行时，能够把分布式应用的能力抽象成一个个 Building Block。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-3.png)

举几个例子来讲，一般的分布式应用程序都有 service 之间的相互调用，所以会有一个 service 的 Building Block；通常也会有 publish、subscribe 这样的模式，所以也会有一个 `publish and subscribe` 的 Building Block；此外还会有一些输入输出，所以有一个 Binding Building Block；当然还有其他的，可参考上图。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-4.png)

这些 Building Block 会由一系列的 components 支撑，比如 PubSub Brokers 可以支持各种云上的 MQ、AWS sqs 或者一些开源的中间件如 Redis、Kafka；Bindings 也会支持一些云上的存储和开源组件如 Kafka、MySQL、Redis。

所以 Dapr 就能解决上文提到的问题。FaaS 平台的每一种语言，只需要和 Dapr 交互，Dapr 的 API 再和构成每一个 Building Block 的 component 交互，通过 Dapr 去处理与众多后端服务的交互，这样就把复杂度从 N × M 降为了 N × 1.

另外 Dapr 解耦了 FaaS 平台与各云厂商的 BaaS，做到了云厂商中立，解决了跨云迁移的问题。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-5.png)

## OpenFunction 简介

### OpenFunction 是什么

OpenFunction 是青云科技在 2022 年初开源的，在 2022 年 4 月成为了 CNCF 的 Sandbox 项目。

- 云厂商中立
  - 与各个云厂商的 BaaS 服务松耦合
  - 通过 Dapr，简化了与各云厂商或开源 BaaS 服务的集成
- 同时支持同步与异步函数
  - 同步函数基于 Kubernetes Gateway API 实现了 OpenFunction Gateway 作为函数⼊⼝
  - 异步函数可直接从事件源消费事件，并可根据事件源特有的指标自动伸缩
- 支持直接从函数代码生成符合 OCI 标准的函数镜像
  - 基于 Cloud Native Buildpacks 实现
- 支持 0 与 N 之间的水平自动伸缩
- 既能运行函数，也能运行 Serverless 应用
- 支持 Wasm Runtime
- 更完善的 CI/CD

![](https://openfunction.dev/images/docs/en/introduction/what-is-openfunction/openfunction-architecture.svg/)

上图是 OpenFunction 的架构图，总体分为：Build，Function，Serving 和 Events 几个部分。

- Function：Function 是一个主控模块，控制函数的构建和 serving，Build、Serving 和 Status 等信息也会在 Function 的 CRD 中显示。
- Build：支持使用 Buildpacks 的方式构建函数的镜像，也支持使用 Dockerfile 的方式构建 Serverless 应用；后端技术是 Shipwright，Shipwright 可以切换构建镜像的引擎，所以可以通过 Shipwright 选择不同的镜像构建工具，最终将应用构建为容器镜像。
- Serving : 通过 Serving CRD 将应用部署到不同的运行时中，可以选择同步运行时或异步运行时。同步运行时可以通过 Knative Serving 或者 Keda-HTTP 来支持，异步运行时通过 Dapr+Keda 来支持。同时现在也支持 WasmEdgeRuntime 来支持 Wasm 函数。
- Events : 对于事件驱动型函数来说，需要提供事件管理的能力。由于 Knative 事件管理过于复杂，所以我们研发了一个新型事件管理驱动叫 OpenFunction Events。

### OpenFunction Events

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-6.png)

EventBus 利用 Dapr 的能力解耦了 EventBus 与底层具体 Message Broker 的绑定，你可以对接各种各样的 MQ。

### OpenFunction Gateway

OpenFunction Gateway 是 OpenFunction 0.7.0 增加的新特性，是基于 Kubernetes Gateway API 来实现的。之所以选择 Kubernetes Gateway API，是因为其 CRD 和其下游实现是解耦的，用户可以选择自己喜欢的 Gateway 实现，比如 APISIX、Istio、Contour 等；另外 Kubernetes Gateway API 也提供了一些新的特性，比如 HTTP 流量的分发、跨 Namespace routing 功能。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-7.png)

在之前 OpenFunction 需要把流量转发到 Knative 的 Gateway，然后再路由到 Knative 的 Revision，链路比较长。有了 OpenFunction Gateway，可以直接把流量转发到 Knative 的 Revision。也就是说可以不再依赖 Knative 网络相关的组件，整个流量转发的链路也会变短。

### 为什么引入 OpenFunction Gateway

通过 Knative Gateway 访问同步函数需指定⼀个由随机串组成的 service url，不可预测且对⽤户不友好。

通过 OpenFunction Gateway 访问同步函数，可通过函数名及 namespace ⽣成函数访问 url。另外还可以通过 Gateway 的 Service 加上 Function 的 namespace 和 name 来进行 path-based 的访问，也可以基于 OpenFunction Gateway 的 IP 加上 Host 相关的 Headers 来进行 host-based 访问。

如果我们想在集群外部访问集群内部的 Function，我们可以在 OpenFunction Gateway 上面配置 domain 相关的字段，配置成 magic DNS，这样我们就可以直接在集群外部通过域名来访问集群内部的 Function。

## 冷启动优化

冷启动优化一直是 FaaS 平台的难点。

之前我们采用的是 Dapr sidecar 模式，但是会影响 Function 启动的时间。函数很小的情况下，Dapr sidecar 的 container 启动时间以及 Dapr client 初始化所需要的时间，比 Function 启动时间更长。

我们设计了 Dapr Proxy 模式，就是让所有 Function 的 pod 共享一个 Dapr sidecar。如果我们将 Function 扩容到很大的值，副本数较多，那么 sidecar 也会造成大量的资源开销，采用这个模式将有效避免这种情况。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-8.png)

接下来我们还有一个基于 Pool 的冷启动优化的计划。上文中提到的 Proxy 模式，对 Function 启动时间的优化是有限的。所以我们考虑采用 Pool 的方式来优化冷启动。

引入一个预创建的 Pod Pool，在有调用请求时，可以根据请求的相关信息判断要调用哪个 Function，然后对这个 Function 的 code 热加载，将其变成针对某个 Function 的 Pod，后续的流量就可以直接进入到这个特定的 Function Pod，这个过程不需要 K8s Pod 调度创建等逻辑的参与，所以这个方式对冷启动的时间优化是非常显著的。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-9.png)

## ⽀持 WasmEdge 作为 Wasm 运⾏时

在 OpenFunction 1.0.0 中，我们支持 WasmEdge 作为 Wasm 运行时。WebAssembly 作为 FaaS 平台运行时，具有很多优势，比如启动时间短、镜像体积小、安全性比较高。另外 WasmEdge 对 HTTP 支持也比较好。

但是目前 Wasm Function 访问后端服务有一个问题，因为 WebAssembly 程序访问 API 是受限的，所以也需要通过 Dapr 提供相对统一的方式来完成对后端服务的访问。

目前 Dapr、Rust、SDK 以及 Dapr WasmEdge 等相关的项目，还不够成熟，所以我们暂时还没有集成。后续相关生态成熟之后，再进行集成。

## OpenFunction 在⾃动驾驶领域的应⽤

下面介绍一个将 OpenFunction 用在自动驾驶领域的案例，来自 OpenFunction 的社区用户——驭势科技。

简单来讲，自动驾驶就是车端会上传很多传感器的数据到云端，云端再对这些数据进行处理。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-10.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-11.png)

上图是云端的架构图。举例来说，车端的 MQTT Broker 将云端的数据传到云端的 MQ 上，运维人员会创建多种异步函数和同步函数来处理这些数据。MQTT topic 的数据会由一个函数处理，其他数据由另外一个函数处理，处理完的数据分别存到了不同的后端服务里，因为业务比较多，所以可能是不同的团队去去实现的，那么就需要用不同的语言去实现。

### 异步：消息队列实时数据 → Prometheus 指标

驭势科技还有一个比较高阶的使用例子。

车端上传 MQTT 的数据，通过异步函数从 MQTT 的数据提取出 Metrics，再将其发送到 Prometheus 的 Pushgateway，这种方式相当于将车端的数据变成了 Metrics 再存储下来。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-12.png)

### 为什么⾃动驾驶需要云⼚商中⽴的 Serverless 平台？

- 对于云商中立的需求
  - 不同的客户要求部署到不同的云厂商
  - 一些客户的车端数据比较敏感，要求放到和公有云隔离的环境
  - 不同的云⼚商有不同的后端服务，如果没有⼀个云⼚商中⽴的云平台，对于同⼀处理逻辑则需要为对接的每⼀个云⼚商都实现相似的服务
- 对于 Serverless 的需求
  - 数据处理逻辑多样同时经常变化，来⾃同⼀数据源的数据在不同场景下的处理逻辑不尽相同
  - ⾃动驾驶涉及的模块较多，不同的模块由不同的团队负责，需要多语⾔⽀持
  - ⼤量⻋端数据需要实时处理；⾃动驾驶⻋辆也有潮汐的特性，数据处理需求有⾼峰和低⾕

## 社区、路线图与 Demo

### OpenFunction 路线图

- 函数框架
  - ⽀持 Dapr State Management 与 Dapr Workflow
  - ⽀持更多语⾔的异步函数框架包括 Python、Rust
  - ⽀持将 Java 函数编译成 Native 程序运⾏在 Quarkus 环境中
- 函数运行时
  - 实现 Serverless ⼯作流（Workflow）
  - 预研基于 Pod Pool 的冷启动优化⽅案
  - ⽀持 OpenTelemetry 作为另⼀个函数追踪⽅案
- 用户工具
  - 增加 OpenFunction 控制台
- 与 AIGC 结合

### 早起贡献及应用者

- 越来越多的社区贡献者
  - 主要 Maintainer 来⾃ KubeSphere 团队
  - SkyWalking PMC 成员 @arugal 实现了 SkyWalking 和 OpenFunction Go Functions Framework 的集成
  - 驭势科技 (UISEE) @webup @kehuili 以及印度的贡献者正在参与 Node.js 和 Python Functions Framework 的开发
  - SAP @lizzze 参与 functions-framework-go 的开发
  - 来⾃阿⾥云 、微众银⾏等社区贡献者也在积极参与
  - 乌克兰的贡献者在帮忙维护 openfunction.dev
- 越来越多的公司开始采用
  - 国内某电信公司采用 OpenFunction 构建云函数计算平台
  - 驭势科技（UISEE）采用 OpenFunction 处理车云数据
  - 微众银行
  - 某证券公司
  - 喜马拉雅
  - 云学堂

## 参与 OpenFunction 社区

欢迎各位小伙伴参与社区！

- OpenFunction: https://github.com/OpenFunction/OpenFunction
- Website: https://openfunction.dev/
- Samples: https://github.com/OpenFunction/samples

## 附录：函数示例

### 同步函数触发异步函数示例

![](https://pek3b.qingstor.com/kubesphere-community/images/kubecon-2023-ofo-13.png)

- 同步函数： https://github.com/OpenFunction/samples/tree/main/functions/knative/with-output-binding

- 异步函数： https://github.com/OpenFunction/samples/tree/main/functions/async/bindings/kafka-input

### 更多函数示例

- Keda HTTP Engine: https://github.com/OpenFunction/OpenFunction/blob/main/config/samples/function-kedahttp-sample-serving.yaml

- Wasm 函数: https://github.com/OpenFunction/samples/tree/main/functions/knative/wasmedge/http-server

- Redis state store:

  - https://github.com/OpenFunction/java-samples/blob/main/src/main/resources/functions/redis-state-store.yaml
  - https://github.com/OpenFunction/java-samples/blob/main/src/main/java/dev/openfunction/samples/StateStore.java

- Serverless Applications:
  - with a Dockerfile: https://github.com/OpenFunction/samples/tree/main/apps/buildah/go
  - without a Dockerfile: https://github.com/OpenFunction/samples/tree/main/apps/buildpacks/java
