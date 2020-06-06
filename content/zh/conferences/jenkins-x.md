---
title: '基于 Kubernetes 的 Serverless Jenkins —  Jenkins X'
author: '夏润泽'
createTime: '2019-06-24'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20190930095450.png'
---

在云原生时代，应用模块不断被拆分，使得模块的数量不断上涨并且关系也越加复杂。企业在落地云原生技术的时候同事也需要有强大的 DevOps 手段，没有 DevOps 的云原生不可能是成功的。Jenkins X 是 CDF（持续交付基金会）与 Jenkins 社区在云原生时代的 DevOps产品，本文我们将介绍 Jenkins X 以及 Jenkins X 背后的技术。

## 背景

Jenkins 在2004年诞生。根据官网的数据统计（截止2019年3月）有 250,000 的 Jenkins 服务器正在运行、15,000,000+  Jenkins 用户、1000+ Jenkins插件。Jenkins 在 DevOps 领域取得了巨大的成功，但随着技术的不断发展与用户数量的不断上升，传统 Jenkins 所暴露出来的问题也越来越多。在这里我们将介绍传统 Jenkins 所遇到的挑战。

### Jenkins 所遇到的挑战 - 单点故障

在传统的 Jenkins 当中，我们首先会遇到的问题就是 Jenkins 的单点故障问题。 
Jenkins 的历史非常悠久，在当时大多数程序都是单机程序，Jenkins也不例外。
对比其他系统，Jenkins 的单点故障问题会更加凸显，熟悉 Jenkins 的用户都知道，它是一个基于插件的系统，而我们会经常安装插件，这时候我们就需要重启 Jenkins 服务器。这将导致共用这个平台的所有用户都无法使用。

### Jenkins 所遇到的挑战 - JVM消耗资源多

Jenkins 是 Java 系的程序，这使得 Jenkins 需要使用 JVM，而 JVM 将会消耗大量的内存。
CI/CD 任务往往都是在代码提交时被触发，在非工作时间，这些资源消耗是可以大大降低的。

### Jenkins 所遇到的挑战 - Job 的调度方式使 CI/CD 变得困难

在 Jenkins 诞生的年代，机器资源并没有像现在一样丰富、可调度，导致 Jenkins 的调度模式使得不适合现代的环境。
Jenkins 的调度模式是一种尽量能够节省资源的方式进行调度的。在一般的调度过程中 Jenkins 需要经历以下几个阶段:
检查有没有可用的 agent -> 如果没有的可用的agent，计算是否有 agent 预计将要运行完任务 -> 等待一段时间-> 启动动态的 agent -> agent 与 master建立连接。
这种方式使 CI/CD 任务被执行的太慢，我们往往都需要等待几十秒甚至更长时间来准备 CI/CD的执行环境。

## Jenkins X 的诞生与理念

Jenkins X 是起源于 Jenkins 的一个项目，在2018 年 2 月从 JEP（Jenkins Enhancement Proposals）中诞生。目前已经成为一个独立的项目，并且有了自己独立的 Logo。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001072222.png)

Jenkins X 的设计目标是使用 Kubernetes 的力量来构建现代化的 CI/CD 平台，为用户提供自动化的 CI/CD。
在现代化方面我认为主要有两个部分，其中一部分为用户体验的现代化，另外一部分则是架构方面的现代化。我们这里将首先介绍有关用户体验的现代化，稍后再介绍架构方面的现代化。

### 重新思考云原生时代的 CI/CD

用户在使用传统的 Jenkins 的 时候往往都在思考一个问题，我们应该怎样创建一个流水线来完成的工作。而用户想要的并不是如何创建一个流水线，而是想要：

* 更快的上市时间
* 更高的部署频率
* 更快的修复时间
* 更低发布故障率
* 更短的恢复时间

其实就是通过自动化「软件交付」和「架构变更」的流程，来使得构建、测试、发布软件能够更加地快捷、频繁和可靠。
Jenkins X 在设计之初目标就在思考如何让用户如何落地云原生的 CI/CD，如何让用户成为“高性能” 的团队，在《加速度》一书当中 Jenkins X 团队总结出了一些高性能团队所有的特点：

* 版本化所有制品
* 自动执行部署过程
* 使用基于主干的开发
* 实施持续集成
* 实施持续交付
* 使用松耦合架构
* 让团队成员获得动力

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001072245.png)

于是 Jenkins X 团队将这些特性都融入到了 Jenkins X 当中，让用户更容易落地高性能的 DevOps。

### 以应用为视角的 CI/CD 产品

Jenkins X 与其他 CI/CD 产品的最大的不同，在于 Jenkins X 切换了用户在使用 CI/CD 产品时候的视角。在前面我们提到过在传统 Jenkins 当中，用户往往思考的是如何去创建一个流水线，而在全新的 Jenkins X 当中，用户是创建一个应用，而 Jenkins X 将自动的为这个应用创建CI/CD 流水线。
为应用创建自动化的 CI/CD 流水线其中就包括 CD 也就是持续交付/部署过程，因此 Jenkins X当中拥有了环境管理的功能。
在 Jenkins X 当中，所有操作将是 GitOps 的，GitOps 就是指将所有对基础设施的操作，全部转换为 Git 操作。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001072307.png)

在上面的图中上面为用户的 Git 仓库，中间为 Jenkins X，最下方为 k8s 当中的 namespace，每一个 namespace都对应一个环境。当用户对我们的 Git 仓库操作时，Jenkins X 会将这些操作转换为对 k8s 集群的操作，以产生预览环境、预发布环境等。
在 Jenkins X 当中创建一个应用，默认将拥有三个环境，也就是有三个 Git 仓库。其中第一个为应用的源代码仓库，它对应用户的预览环境，当用户创建一个PR（Pull Request）时，Jenkins X 将为这个 PR 生成一个预览环境，让用户更容易进行代码 review。同时这里还有 staging 和 production 仓库，在这两个仓库当中并没有应用的源代码，而是应用 helm chart 的索引信息。如果仓库当中拥有某一个版本 chart 的索引，那么 Jenkins X 就会把这些应用自动的部署到这个环境当中。
环境管理与 GitOps 当中还有一个非常有意思的设计，那就是随时发布一个 release 版本。这里具体行为是这样的，当用户合并一个 PR 到应用的仓库的时候，这时候 Jenkins X 将会自动发布一个小版本的 release，并且自动创建并一个 PR 到 staging 环境的仓库当中，保持应用的 master 分支与 staging 环境当中的部署的应用是对应的。让用户习惯基于主干的开发和主干随时可发布的 DevOps 实践。

### Jenkins X 的演进

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001072329.png)

Jenkins X 在不断的迭代演进，在最初版本中 Jenkins X 使用传统 Jenkins 完成大部分工作。
随后 Jenkins X 引入了 Prow 作为 webhook时间的接收者，来避免大量的仓库扫描，并且弥补传统仓库扫描描述信息不足的情况。
之后 Jenkins X 开始使用一次性的 Jenkins Server 运行 CI/CD 任务。一次性的 Jenkins Server 实际上是对传统的 Jenkins 进行了改造，将传统的 Jenkins 打包成为一个可以执行 Jenkinsfile 的执行器。当需要执行 CI/CD 任务的时候去动态的启动 Jenkins Server 完成任务。这种方式虽然解决了长时间运行 Jenkins Server 所带来的资源消耗，但是这种方式还仍然使用 JVM，并且流水线启动的也很慢。
后来 Jenkins X 就将底层的流水线引擎从 Jenkins 切换到了 Tekton。Tekton 谷歌开源的 CI/CD 流水线引擎，这部分我们在后面还会有更详细的介绍。
在 2019 年 Jenkins X 引入了自己的流水线定义语言 Jenkins-x.yaml，让用户可以使用 yaml 的形式来定义自己的流水线。
现在 Jenkins X 社区在努力开发自己的 webhook 响应器 lighthouse 以弥补 prow 只支持 github scm 的问题。

## Jenkins X 背后的技术

在上文当中，我们主要了解了 Jenkins X 的诞生以及全新的用户体验。在这一章当中我们将主要介绍 Jenkins X 背后的技术，这包括为了用户体验所使用的模块，也包括 Jenkins X 的现代化架构。

### 应用打包 Draft 与 Build Packs

在前面我们提到过 Jenkins X 将是以应用为视角的 CI/CD 平台。平台首先要解决的一个问题就是如何进行应用标准化打包的问题。Jenkins X 的应用打包借鉴了很多 Draft 的思想。

Draft 是云原生社区的一个项目，由 Azure 维护，目标是简化用户创建云原生应用的过程。
我们在将应用云原生化的时候需要进行很多工作，包括但不仅限于以下步骤：编写 Dockerfile 将应用容器化->编写 k8s 相关的部署文件->以 Helm 的形式对应用进行打包->……

这个过程对大部分传统用户来说都拥有很高的学习成本，于是 Draft 诞生了。在使用 Draft 时用户不再需要去学习 Docker、Helm ……用户只需要输入 draft create 并且选择语言，那么 draft 就会自动创建好包括 Dockerfile、deploy.yaml、helm chart、项目基本结构 …… 当需要部署时用户只需要输入 draft up 就可以一键进行构建并且打包部署。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001080830.png)

与 Draft 类似 Jenkins X 创建了自己的 buildpacks，其中包括 Dockerfile、Helm Chart、jenkins-x.yaml……用户只需要 jx create quickstart 就可以轻松的创建好这一系列的资源，并且 Jenkins X 还将在 scm 上创建好仓库，并且设置好完整的 CI/CD 流水线。这时用户可以根据项目生成的文件，直接开始编写自己的业务代码。

### 现代化架构初探

在上文当中我们介绍了有关 Jenkins X 产品方面的现代化，现在来介绍一下 Jenkins X 架构上面的现代化。在 Jenkins X 当中是采用的一种 Serverless 的服务架构。Serverless 是一种云计算执行模型，其中云提供商(k8s)运行服务器，并动态管理机器资源的分配(From WIKI)。

在以 CI/CD 为业务的 Serverless架构，我们将主要需要以下三个模块。

* Webhook响应器（类似API Gateway，可以动态其中服务）
* 动态 CI/CD 引擎（类似 Func，支持动态加载执行）
* 数据的持久化存储

### 可靠、高性能的流水线引擎 - Tekton

Tekton 是诞生于 Knative 的一个项目，Knavie 是 Google 开源的一个 Serverless 平台。在 Serverless 平台当中非常重要的一环就是将应用打包，于是 Knavie Build 项目诞生了。在 Knavie Build 诞生之后，大家发现以云原生的方式运行构建有很多优势，例如运行速度很快、可以轻松利用池化的资源。于是大家开始尝试用这种方式来做更多事情，例如执行测试、执行部署等，这个时候 Knavie Pipeline 项目也就诞生了。现在的 Tekton 的前身也就是 Knavie Pipeline，是一个纯正的云原生 CI/CD 引擎。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001080843.png)

对 Jenkins X 来说 Tekton有非常大的优势就是避免了 JVM 的使用，并且可以动态的启动、高效利用资源，同时基于 CRD 开发的 Tekton也有非常易用的声明式 API。

### 高性能、高可用的事件响应器 - Prow

Prow 是诞生于 k8s 测试基础架构的一个组件。目前在 k8s 社区当中每天有上百个仓库的上千个PR/Issue 都通过一个Prow 来处理。
Prow 是经过考验的高性能事件响应器，并且基于 k8s controller方式开发的 Prow 可以直接实现高可用，以保证我们事件入口随时可用。
Prow 同时还提供了一个非常重要的功能就是 ChatOps，使用这种方式我们只需要在 Issue/PR 中进行回复就可以完成我们日常的大部分工作。
插件模型的 Prow 也可以很容易的插入我们想要自定义的功能。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001080859.png)
### CRD + Controller 粘合各个模块
CRD 是 k8s 当中的一等公民，是扩展 k8s 的标准方式。使用这种模式开发，我们可以容易的实现声明式 API 并且模块之间是松耦合的。k8s 的 watch 机制也可以让我们的请求被快速的响应，并且达到请求的最终一致性。这种开发模式同时拥有非常丰富的社区资源，我们可以利用社区资源很容易的实现例如高可用等特性。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001080924.png)

这里简单介绍 Jenkins X 响应一个事件的流程
1. 首先 SCM 会发送一个 WebHook 事件到 Prow，告诉 Prow 有一个事件发生（例如有人提交PR）
2. Prow 在收到消息之后会在 k8s 的 apiserver 创建一个 ProwJob，将 WebHook 消息转换为CRD 资源。
3. 这时 k8s apiserver 会通知正在 watch ProwJob 的 Jenkins X Controller
4. Jenkins X Controller 获取 ProwJob 的详细信息，并且创建 Tekton 相关的 Pipeline 资源

这里我们利用 k8s apiserver 做到了非常好的解耦。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001080941.png)

于是我们就可以得到一个相对完整的图，在上图当中 
1. SCM 会发送消息到 Prow。在 Prow 当中有多个模块，其中 Hook模块用于处理 WebHook 消息。
2. Pipeline Operator（Jx Controller）发现有 ProwJob 被创建之后就会创建 Tekton 的一系列资源包括 Pipeline、Task、Pipeline Run 等。
3. 在 Pipeline Run 当中会执行构建制品、推送制品以及部署制品到环境当中等工作
### 环境清理与数据持久化
在介绍完我们的工作流程之后，我们再来介绍以下 Jenkins X 的环境清理和数据持久化。
在使用 Jenkins X 的过程中会产生一系列的资源，大量的资源被写入到 k8s 的 etcd，当数据量较大时就会影响我们 k8s 的正常使用。Jenkins X 利用 k8s 的核心资源 CronJob 来清理一些无用的数据，包括无用的 Preview环境、过期的Pod、过期的其他数据等等。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001185027.png)

对于我们真正想要持久化的数据，Jenkins X 提供了外部对接的能力。我们可以去对接外部的存储，例如AWS的S3、青云的对象存储……这样我们就可以把想要持久化的数据很容易的保留下来。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191001184955.png)

在上面的图中就体现了这一点，对于 Artifacts、Secrets、Build logs……我们都可以借助云厂商的力量，进行数据的可靠存储，这种方式同样使我们的服务变得无状态、高可用、更稳定。

## 总结

Jenkins X 是一个非常现代化的产品，包括现代化的用户体验与现代化的架构设计。 
对于社区用户来说，现在可以开始尝试使用 Jenkins X （Jenkins X 对 Github的支持相对完善，并且相对传统 Jenkins 来说更节省资源、容易落地）
大型企业落地仍然难度比较高，需要社区、用户以及企业的共同努力，建设下一代的 CI/CD 产品和社区。

大型企业落地 k8s 之上的 CI/CD，使用传统 Jenkins 仍然是首选方案。在使用这种方案时可以结合 kubernetes、kubernetes-cd、casc 等插件使传统 Jenkins 可以与 k8s 互相结合。

目前社区中的开源 k8s 发行版 KubeSphere 已经将这一方案集成到产品当中，使用户可以获得开箱即用的云原生 CI/CD 功能，有兴趣的同学可以快速安装使用。
