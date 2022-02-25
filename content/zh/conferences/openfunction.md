---
title: '用云原生无服务器技术构建现代 FaaS（函数即服务）平台'
author: '霍秉杰，雷万钧'
createTime: '20 21-12-10'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubecon2021-ben.png'
---

## 议题简介

作为无服务器的核心，FaaS（函数即服务）越来越受到人们的关注。新兴的云原生无服务器技术可以通过用更强大的云原生替代方案替换 FaaS平台的关键组件，从而构建一个强大的现代 FaaS 平台。在本次分享中，OpenFunction 的维护人员分享讨论：

- 构成 FaaS 平台的关键组成部分，包括函数框架、函数构建、函数服务以及函数事件管理。
- 新兴云原生无服务器技术在 FaaS 各个关键领域中的优势，包括 Knative 服务、Cloud Native Buildpacks、Shipwright、Tekton、KEDA 和 Dapr。
- 如何以 OpenFunction 为例，利用这些云原生技术构建强大的现代 FaaS 平台。
- 事件管理对 FaaS 很重要的原因。既然已经有了 Knative eventing 和 Argo Events，为什么 OpenFunction 还要创建自己的事件管理系统“OpenFunction Events”?

## 分享者简介

霍秉杰，云原生 FaaS 项目 OpenFunction Founder；FluentBit Operator 的发起人；他还是几个可观测性开源项目的发起人，如 Kube-Events、Notification Manager 等；热爱云原生和开源技术，是 Prometheus Operator, Thanos, Loki, Falco 的贡献者。

雷万钧，OpenFunction Maintainer，负责开发 OpenFunction；FluentBit Operator 的维护者；KubeSphere 可观测性团队的成员，负责 Notification Manager 的开发；云原生和开源技术的爱好者，fluent bit 和 nats 的贡献者。

## 视频回放

<video id="videoPlayer" controls="" preload="true">
  <source src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeCon2021-China-Ben.mp4" type="video/mp4">
</video>

## 对应文章——用云原生无服务器技术构建现代 FaaS（函数即服务）平台

作为无服务器的核心，FaaS（功能即服务）越来越受到人们的关注。新兴的云原生无服务器技术可以通过用更强大的云原生替代方案替换 FaaS（功能即服务）平台的关键组件，从而构建一个强大的现代 FaaS（功能即服务）平台。本文将介绍如何通过云原生无服务器技术构建 FaaS 平台。

### 什么是 Serverless Computing

引用加州大学 Berkeley 分校对于 Serverless Computing 的定义：

Serverless computing = FaaS + BaaS

从这张图我们可以看出，Serverless 介于云平台和应用之间，包括 BaaS（中间件）和 FaaS（函数）。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-1.png)

### Serverless 现状

Serverless 领域相关的开源项目，大多启动的比较早，技术栈老旧，有着各种各样的缺点。

Knative 是一个 Serverless 平台，用于构建、管理和部署工作负载。knative 包括 3 个部分，build 通过灵活的插件化的构建系统将用户源代码构建成容器，支持多个构建系统；serving 基于负载自动伸缩，允许你为多个修订版本（revision）应用创建流量策略，从而能够通过 URL 轻松路由到目标应用程序；event 使得生产和消费事件变得容易。抽象出事件源，并允许操作人员使用自己选择的消息传递层。Knative 只能运行应用，不能运行函数，还不能称之为 FaaS 平台。Knative Eventing 的设计过于复杂，使用门槛较高。
OpenFaaS 是一款高人气的开源的 FaaS 框架，可以直接在 Kubernetes 上运行，也可以基于 Swarm 或容器运行。OpenFaaS 的技术栈比较老旧， 其依赖于 Prometheus 和 Alertmanager 进⾏ Autoscaling，不是专业和敏捷的做法。

近年来 Serverless 领域涌现了很多优秀的开源项目：

- KEDA。KEDA 是一个基于 Kubernetes 的事件驱动自动缩放器，可以根据需要处理的事件数量来驱动 Kubernetes 中任何容器的动态伸缩。KEDA 是一个单一用途的轻量级组件，可以添加到任何 Kubernetes 集群中。 KEDA 与 Horizontal Pod Autoscaler 等 Kubernetes 标准组件一起工作，可以在不覆盖或复制的情况下扩展功能。 
- Dapr。Dapr 是一个可移植的、事件驱动的运行时，它使任何开发人员能够轻松构建出弹性的、无状态和有状态的应用程序，并可运行在云平台或边缘计算中，它同时也支持多种编程语言和开发框架。
Cloud Native Buildpacks（CNB）。云原生的打包工具，可以将 Function 编译成 OCI 镜像。
- Tekton。Tekton 是一个强大且灵活的开源框架，用于创建 CI/CD 系统，允许开发人员跨云提供商和本地系统构建、测试和部署。
- Shipwright。Shipwright 是一个可扩展的框架，用于在 Kubernetes 上构建容器镜像。Shipwright 支持任何可以在 Kubernetes 集群中构建容器镜像的工具，例如 Kaniko、Cloud Native Buildpacks、Buildkit、Buildah。

### 使用云原生无服务器技术构建 FaaS

FaaS 函数框架（Functions framework）、函数构建 (Build）、函数服务 （Serving）和事件驱动框架 （Events Framework）组成。下面我们将详细介绍如何使用云原生无服务器技术实现这些模块。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-2.png)

#### Function Framework

Function Framework 用于将一段函数代码转换为可运行的应用。我们知道函数计算之所以降低了开发成本，Function framework 代替开发者完成了很多与业务无关的工作，使得开发者可以专注于业务代码，同时 Function framework 还为开发者提供了应用运行环境中的上下文和语义明确的函数开发扩展库。Function framework 需要做到语义明确和功能强大，同时需要尽可能的降低学习门槛，最大限度的减少学习成本。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-3.png)
![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-4.png)

#### Build
Build 用于构建镜像，包括代码拉取、编译环境准备、代码预处理、镜像编译和镜像上传等，同时会涉及到凭证管理等功能，需要有一个 CI/CD 工具管理构建过程。Kubernetes 在1.22 后弃用了 Docker，因此在 Kubernetes 1.22+上，我们无法使用 docker in docker 直接编译镜像，幸运的是我们仍然可以使用 Kaniko、Buildah、BuildKit 以及 Cloud Native Buildpacks（CNB）编译镜像。一个好的 Build 框架应该支持切换镜像编译工具。综合这些需求，我们选择 Shipwright 来管理整个构建过程。

Shipwright 是一个可扩展的框架，用于在 Kubernetes 上构建容器镜像。Shipwright 支持任何可以在 Kubernetes 集群中构建容器镜像的工具，例如 Kaniko、Cloud Native Buildpacks、Buildkit、Buildah等。用户可以通过 CRD 控制构建过程。

- Build。 Build CRD 用于定义构建镜像所需的信息，包括代码路径、strategy、输出镜像的地址、凭证信息、参数和环境变量等。
- BuildRun。BuildRun CRD 用于启动构建。
- BuildStrategy & ClusterBuildStrategy。用于定义构建镜像的步骤，Shipwright 会据此生成构建流水线。

#### Serving

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-5.png)

Serving（函数服务）指的是如何运行函数 / 应用，以及赋予函数 / 应用基于事件驱动或流量驱动的自动伸缩的能力（Autoscaling）。函数可以分为同步函数和异步函数。同步函数是指客户端发出请求后，必须等到函数执行完成并获取函数运行结果后才返回；异步函数是指客户端触发函数后，无需等待函数运行结束即可返回。

Knative Serving 具备了非常出色的自动伸缩机制，可以直接使用 Knative Serving 作为同步运行时。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-6.png)

对于异步函数，可以使用 Dapr + KEDA 作为运行时，使用 Dapr 可以解耦函数对各种中间件的访问；KEDA 可以根据实际事件源的监控指标自动进行工作负载副本数量的伸缩。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-7.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-8.png)

### OpenFunction
为了解决上面提到的问题，结合最新的 Serverless 技术，KubeSphere 社区发起了 OpenFunction 项目，其目标是构建新一代开源函数计算平台。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-9.png)

OpenFunction Event 

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-10.png)

#### Roadmap

- Functions framework refactoring.
- Add plug-in mechanism to functions framework.
- Refactoring OpenFunctionAsync runtime definition.
- Add binding to knative sync functions (Integrate Dapr with Knative).
- Add the ability to control min/max replicas.
- Add the ability to control concurrent access to functions.
- Add function invoking ability to ofn cli.
- Use emissary-ingress as Knative network layer and K8s Ingress & Gateway.
- Support more EventSources.
- Add OpenFunction sync function.
- Nodejs functions frameworks & builder.
- Python functions frameworks & builder.
- OpenFunction API & Console.
- Serverless workflow support.
- Use ShipWright to build functions with Dockerfile.
- Function tracing: support using Skywalking for tracing.
- Function tracing: support using OpenTelemtry for tracing.
- Support Rust functions & WebAssembly runtime.

#### Demo： 以 Serverless 的方式实现日志告警

![](https://pek3b.qingstor.com/kubesphere-community/images/image-faas-11.png)