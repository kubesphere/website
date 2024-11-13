---
title: '基于 Argo CD 的 GitOps 实践经验'
tag: 'KubeSphere, GitOps, Argo CD'
keywords: 'Kubernetes, KubeSphere, GitOps, Argo CD'
description: '本主题主要分享了 GitOps 的落地实践经验，同时介绍了 S2I 在 KubeSphere 上的应⽤，带给视源股份的收益；在介绍 GitOps 的过程中，引⼊ Argo CD 组件，最后与 KubeSphere 多集群管理结合，介绍了 Argo CD 在应⽤多集群间迁移的⼀种尝试⽅案。'
createTime: '2021-08-27'
author: '裴振飞'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/gitops-cic-cover.png'
---

> 本文是 2021 年 KubeSphere Meetup 北京站讲师裴振飞分享内容整理而成。点击观看[回放视频](https://kubesphere.com.cn/live/gitops-cic/)

## 行业背景

业务，开发，运维，由于岗位职能的不同，人数配比也不尽相同，但却有一个共通的趋势：运维人员随业务增长的幅度，大大低于开发人员的增长。对于开发团队，越来越多的公司，把发版效率作为团队的考核目标之一，而团队 DevOps 建设，运维至关重要。

随着容器技术的发展，Kubernetes 已经是成熟可用于生产实践的生态工具。社区组件的丰富，带来了新的解决方案，硬件资源的利用率也显著提高。但基于云原生的虚拟化，其繁杂的概念和逻辑，让用户“云里雾里”。Kubernetes 好比艘庞大的航空母舰，想要驾驭它绝非人肉运维能够解决。

选择好的 Kubernetes 控制面板，才可以事半功倍！

## 为什么选择 KubeSphere？

我们的选型思路，有如下几点：

1.开源项目

2.有厂商技术支持

3.界面对开发和运维友好

不是所有的开源项目都有厂商在做技术支持，而 KubeSphere 完全符合前两点。开源意味着开放，用起来没有“卡脖子”风险，而厂商的技术支持，可在关键时刻施以援手，扶持企业渡过难关。界面友好这个需求，看似简单没有作用，但实际上却是影响用户体验最重要的因素，界面友好才能释放后端功能。


## 实践 CI/CD 的两个阶段

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-1.png)

基于 KubeSphere 我们实践过两种方案。前一个阶段是 Source To Image，后一个阶段是基于 Argo CD 的 GitOps。


## S2I 核心概念介绍

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-2.png)

S2I 是个构建 Docker 镜像的工具，它是 OpenShift 上主要的构建镜像的方式之一。S2I 有个核心理念：镜像就是源代码加运行环境。源代码可能千变万化，但同一语言的运行环境，基本差异不大。Docker 镜像又是分层存储，非常适合 S2I 的操作。

基础镜像加运行环境，我们称为 S2I 模板镜像，它是一个生成镜像的镜像。如何用一个镜像生成另一个镜像，这就是 Assemble 脚本，与此对应的，还有另外的 Run 脚本，它定义了生成出来的镜像是如何运行的。

所以，如何自定义 S2I 模板镜像，是玩转 S2I 构建的关键。


## 快速定制开发 S2I 模板

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-3.png)

S2I 模板镜像的定制，更多是运行环境的定制。我们把这个过程分为几层：

1. 操作系统层依赖(包管理工具安装和自定义安装)
2. 语言层包依赖(灵活定制开发语言的版本等)
3. 业务层依赖(自研代码依赖包等等)

当然还有环境变量管理，运行参数等等，都需要管理。

所有的这些定制需求，Python 语言的我已经做好开源了，其他语言各位可以稍加改动就可以使用。

> https://github.com/pyfs/centos-python-django

## S2I on KubeSphere

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-4.png)

S2I 仅仅是个构建镜像的工具，与 CI/CD 无关， KubeSphere 中集成的是 S2I-Operator，它使得 S2I 在 CD 方向上拓展了功能。

比如发布、回滚、环境配置等等，但让我觉得非常赞的是，Kubesphere 团队把 S2I-Operator 的配置操作可视化，不但大大降低了使用门槛，而且跟整个 Service 创建融合得很自然，毫无违和感。

S2I-Operator 虽然向 CD 方向迈了一步，但仍远远不够。比如代码扫描，发布审查，镜像安全扫描等等，想要实现全流程 DevOps，S2I 无法胜任。

## Gitlab 功能简介

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-5.png)

Gitlab 提供的功能几乎涵盖了 DevOps 的全部生命周期。同时，Gitlab 也在其官网做了主流 DevOps 工具的横向测评。诸位可以访问右上角这个地址查看下。

仔细看，会发现大部分的功能日常已经在用了，绿色框标注的选项，是我们主要的研究对象。


## GitOps 设计哲学

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-6.png)

GitOps 设计理念有很多，我们挑选其中四个。

1. 声明式

   以声明的方式描述整个系统。这是云原生时代主流的思考方式。

2. 自动应用

   当配置变更后，自动应用配置。

3. 偏离修正

   当系统状态与声明状态发生偏离时，自动修正。

4. 版本控制

   这正是 Gitlab 的强项。

看到这些，你是否觉得似曾相识。Nice，Kubernetes 正是这么设计的。此时我们研究 GitOps 算是放心了，至少趋于主流，大方向没错。

## Gitlab CI 案例解读

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-7.png)

此案例是官网的 quick-start。Gitlab CI 就是用声明式的思路编排构建流程。执行构建的工具就是 Gitlab Runner。

Gitlab Runner 支持部署在 Kubernetes 中，非常容易实现动态扩缩容。

对比前面 S2I 的过程，我们不难发现，Gitlab CI 就是 S2I 的 Assemble 过程。他们都依赖 Docker In Docker 技术。

Gitlab CI 的官方文档非常详细，这里就不再赘述。但 Gitlab CD 却值得斟酌推敲，接下来我们探究推模式和拉模式。

## Gitlab CD 推模式优缺点

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-8.png)

何为推模式？

现在镜像构建好，也已经推送到 Container Registry 中。Gitlab 官方推荐做法，是定制一个 Gitlab CI 作业，通过脚本登录 Kubernetes 集群，使用命令运行镜像。

整个过程由 Gitlab CI 发起，主动推送配置给 Kubernetes，这种模式就叫推模式。

虽然思路清晰简单，但却又致命缺点，这里给出三个：

1. 安全性问题

   为了让 Gitlab CI 操作 Kubernetes，势必要把 K8s ApiServer 的访问权开放到集群外的应用。

2. 版本回滚

   直接 Apply 的方式，脱离了 Git 控制。

3. 集群重建
 
   假如应用崩溃了，重建应用时，无法知道当前状态。

上面这几种情况，显然违背了 GitOps 的设计哲学，也无法满足生产需要。为了解决这些问题，就产生了拉模式。

实践拉模式的工具也有好款，最出名的当然是 Argo CD。

## Argo CD 的简介

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-9.png)

Argo CD 就是为解决 GitOps CD 而生。官方文档也很详细，此处不再赘述。

## Argo CD 拉模式发布逻辑

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-10.png)

仍是刚才那个场景，我们把 Argo CD 部署在 K8s 集群内部，这样 Argo CD 的 Operator 天然就有操作集群的能力。这样就解决安全的问题。

此时，所有操作都由 Argo CD 主动发起，我们叫做拉模式。

为了解决版本回滚和应用重建的问题，我们需要引入另外一个版本控制的仓库，姑且叫做 Runtime Repo。该仓库代码定义了容器是怎么部署的，天然的我们想到了 Helm。

是的，Argo CD 支持从 Helm 仓库发布。但 Helm Chart 真的是最好的选择吗？

## 为什么选择 Kustomize？

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-11.png)

Kustomize 已经是 Kubectl 的子命令；Helm Chart 是 Golang 的模板语法，相交于此，Kustomize 更贴近原生的配置清单，学习成本比较低。

Kustomize 最佳实践中，采用 base 环境加分支的方式，在同一个镜像，多环境运行时，好比面向对象中类的继承，配置的复用性可以最大化。

最后，它更符合 GitOps 的理念，用代码仓库保存运行状态。


## Argo CD 在多集群间应用迁移的实践

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-12.png)

前面讲 Runtime Repo 保存了应用的运行状态，那 Argo CD 中各应用的配置，是不是也可以用同样的思路保存到 Git 中呢？

这样我们只需要在 B 集群中，让 Argo CD 应用这个 Git 仓库即可，让 Argo CD 管理 Argo CD 的配置。

目前看来，这招是可行的。但仍然有很多待完成，比如网络层流量自动分发等等；如果有新的进展，再跟大家分享。

## 更多交流话题

![](https://pek3b.qingstor.com/kubesphere-community/images/cic-fei-13.png)

基于 GitOps 的探索，我们探索实践中积累了一些经验，鉴于时间有限，只能大略地带大家过一遍。如果大家对这些话题感兴趣，可以扫码一起探讨。

再次感谢 KubeSphere 团队，他们让世界看到了中国开源的力量。