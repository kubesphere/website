---
title: '云原生时代，如何通过 KubeSphere x 极狐GitLab 构建安全应用？'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, GitLab '
description: '结合 KubeSphere 和极狐 GitLab 来构建一个云原生应用安全体系。'
createTime: '2023-06-28'
author: '小马哥'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-cover.png'
---

> 本文整理自云原生 Meetup 杭州站上，极狐(GitLab) DevOps 技术布道师马景贺的演讲。

当听到云原生的时候，你会想起什么？

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-1.jpg)

可能很多人很自然地就会想到 Kubernetes、容器、微服务、开源等等，这些关键词是我们接触云原生绕不开的话题。但是以上还少了一个关键词：安全。

云原生从 2013 年出现，2015 年发展起来以后，安全也逐渐被关注和重视。

以云原生中常用的镜像安全为例，下图是通过拉取常用镜像，用 Trivy 进行扫描的结果，不同颜色对应不同等级的漏洞。例如 node.js 这个开源项目，高危漏洞有 544 个，中危级漏洞有 921 个；还有 Jenkins，漏洞数量也不少。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-2.jpg)

可以看到，容器镜像安全问题比较严重，关于容器镜像安全的更多分析报告，感兴趣的朋友可以参阅 Anchore 发布的 2021 年、2022 年软件供应链安全报告。

一个完整的软件开发生命周期包括源代码开发、构建、测试、部署等环节，每一个步骤都可能存在潜在安全风险。我们应该把安全嵌入到每一个环节中去，也就是将 DevSecOps 应用到云原生应用程序开发的每一个环节中去，再加上 K8s 容器镜像安全扫描，才能打造一个完整的云原生安全生态。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-3.jpg)

## DevSecOps 是什么？如何帮助我们打造云原生安全生态？

**DevSecOps 是一个兼具深度和广度的纵深安全防御系统**，从 Source code、 Build 、Test 到 Deploy，任何一个阶段，都有对应的安全手段。其次，DevSecOps 是流程、工具、文化的深度结合，传统的研发团队里，开发人员只负责代码的开发，不会关注后续的运维等流程，但在 DevSecOps 标准要求下，安全是团队中每个人的责任，需要贯穿从开发到运维全生命周期的每一个环节。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-4.jpg)

DevSecOps 强调的**安全测试左移**，其实就是更早地让研发加入进来。我们软件研发过程中的大部分安全问题，都是在开发阶段引入的，因此，如果从 Source code 阶段就尽早将安全考虑在内，从源头处提升安全能力，就能更有效、更低成本地发现和解决安全问题。

**安全持续自动化**也是很重要的一个部分，因为一个完整的安全流程，涉及到很多安全工具，如果每个工具都手动配置，手动触发安全测试，那么工作量就会大大提升。所以 DevSecOps 期望的是安全持续自动化，开发写完代码提交变更以后（MR 或者 PR），就可以进行自动扫描，产出报告并建议你如何修复。

> 当然了现在也进入 ChatGPT 时代，我前段时间做了一个 Demo，ChatGPT 在 Code Review 阶段就告诉你哪些是有安全风险的，甚至还会给出推荐的修复代码，感兴趣的朋友也可以去尝试一下

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-5.jpg)

Gartner 每年会针对新技术会发布一个技术成熟度曲线，上图是 2022 年的数据，DevSecOps 就在最右侧，代表着它已经很成熟了，这也是为什么从 2019 年开始，很多企业都在开始讨论 DevSecOps。

下图是我根据行业数据绘制的示意图，可以看出 DevSecOps 一词是在 2012 年由 Gartner 提出，引起强烈关注，到达高峰期；2016 年慢慢往下走，2018 年前后到达泡沫破灭期；终于在 2022 年到达成熟期。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-6.jpg)

从 2012 年提出概念，到今年已经有 11 年了，DevSecOps 经历了一个完整的技术成熟度曲线，现在已经到了落地生根的阶段，这也是为什么，现在我们可以分享 DevSecOps 的落地实践，而非停留在概念。

## 如何寻找云原生 DevSecOps 落地切入点？

安全是一个比较大的概念，当我们提到安全，可能包括主机安全、网络安全、应用安全……本文侧重于应用程序安全领域。

下图虽然只是一个 Yaml 文件，但是已经包含了我们应该如何实践 DevSecOps 的重要信息。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-7.jpg)

镜像是重点，因为云原生时代都是镜像交付。虽然它是一个简单的二进制文件，但包含了很多东西，比如 OS、代码等，大部分的安全问题由此而生，此外 Yaml 文件本身也可能存在安全问题，比如上图下方红框展示的内容，即把敏感信息写到了 Yaml 文件中。

我们来进行一个拆分：

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-8.jpg)

应用程序部署整体可以拆分成 3 层：

1. 底座是 K8s 集群

2. 中间是容器镜像

3. 顶层是应用程序

我们落地 DevSecOps 时，也是按照这 3 层来打造安全防护体系。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-9.jpg)

### 第一层：K8s 安全

首先第一层，基于 K8s 的安全防护手段，可能很多人都知道，比如 RBAC（权限管理）、Network Policy（网络策略）、Audit（审计日志）等。

### 第二层：容器镜像安全

第二层容器镜像，当我们编写 Dockerfile 时，有一些最佳实践可以遵循，例如如何选择基础镜像。

不同的基础镜像，安全漏洞数量不一样，攻击面大小也不一样。正如前文展示的几个容器镜像的漏洞数量，都是不一样。如果我们选择合适的基础镜像，那么就能减少攻击面。具体的就不展开了，大家可以去搜一下 Dockerfile best practice，网上有很多介绍。

另外就是镜像扫描，这也是非常重要的一环。

现在做镜像扫描的开源工具有不少，比如 Trivy、Clair、Anchore 等。使用这些工具可以帮助扫描我们采用的基础镜像是否安全，发现漏洞，然后进行修复，最后把这个镜像作为单一可信源的镜像，团队内部后续使用此镜像来制作其他镜像，那么安全性就能提高很多。

另外这两年在讲软件供应链安全，有一条就是通过数字签名来提高制品的可信性，比如 OpenSSF 基金会（开源安全基金会）下的 cosign 项目就可以对镜像进行签名，但为什么需要签名呢？

当构建镜像时，使用 1.0.0 tag 来构建，但是我们可以在再次修改代码之后，重新用 1.0.0 这个 tag 来构建镜像，并 push 到制品仓库。如果部署时仍旧拿 1.0.0 进行部署，那么内容其实已经被篡改，这也就是镜像的不可信，是镜像安全的另外一个维度。

如果对镜像进行签名，就能很好的避免这个问题。当镜像构建之后就对其进行签名，在部署时再进行验证，如果验证不通过，那么说明这个镜像被篡改了，就不应该再进行后续的部署。

以上就是关于容器镜像安全的几个方法。接下来我们看下最上层的应用程序安全。

### 第三层：应用程序安全

大部分公司，都有专门的运维人员或者安全人员帮我们加强 K8s 和容器镜像安全防护，而最上层最靠近业务，也是开发人员关注更多的一层。

这一层有非常多的安全防护手段，例如 Secret Detection、Dependency scanning、SAST、DAST 等，上图只列举了一部分。

以 Secret Detection 为例，根据我的经验，70% 以上的安全问题都来自于敏感信息泄漏。当我们在本地 Debug 时，很容易把 Password 写死，但测试提交代码时，可能忘了删除，直接把 Password Push 到代码仓库，就造成了泄漏，所以 Secret Detection 在应用程序安全这部分的作用非常重要。

云原生 DevSecOps 是一个深度 + 广度的纵深防御体系，从 K8s、Docker 到应用程序安全，每一层展开都有非常多的安全手段。总结来说，有以下落地原则：

- 分层实施，循序渐进

- 由简入繁，化繁为简

- 重视数据，简化工具

- 安全左移，研发闭环

- 持续优化，持续安全

针对以上云原生开发安全防护体系，极狐 GitLab 提供开箱即用的 DevSecOps 功能，包括七大功能：**容器镜像扫描、静态应用安全测试 (SAST)、动态应用安全扫描（DAST）、密钥检测、License 合规、依赖项扫描以及模糊测试**。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-10.jpg)

### 这么多安全功能，如何去实现落地？

一言以蔽之，就是**将这些安全功能集成到 CI/CD（持续集成/持续部署）中去，达到持续测试和持续安全的效果**。极狐 GitLab 把所有安全功能和 CI/CD 集成到 Workflow 中，这个 Workflow 和研发工作流融合到一块，非常完整。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-11.jpg)

而且，**只需要几行代码，就可以完成对应手段的安全扫描，简单易用**。

下图就是每个安全功能对应的 CI/CD Pipeline 代码。在这个过程中，开发不需要知道每个安全功能应用的工具是什么，不需要学习工具如何配置，只需要输入这几行代码，就能进行扫描，非常容易上手。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-12.jpg)

> 图中不同安全手段标注不同颜色，是一个简单建议，也就是蓝色的几种安全手段是非常容易实践而且收效不错的，如果要全部落地实践，可以采取这种循序渐进的方式，先落地蓝色部分，再落地绿色部分。

## 极狐 GitLab x KubeSphere 云原生安全体系如何构建？

接下来，我们来聊聊如何把 KubeSphere 和极狐 GitLab 进行结合，利用 CI/CD，把安全防护手段集成到软件开发生命周期中。

### 极狐 GitLab 介绍

极狐 GitLab 是一个一体化的 DevOps 平台，其提供的一体化 DevOps 能力覆盖软件开发全生命周期（从计划到运维），同时内置安全功能，能够利用开箱即用的安全能力构建 DevSecOps 体系。

### KubeSphere 介绍

Kubernetes 是一个非常复杂的容器编排平台，学习成本非常高，KubeSphere 所做的事情就是高度产品化和抽象了底层 Kubernetes，是一个面向云原生的操作系统，解决了 K8s 使用门槛高和云原生生态工具庞杂的痛点。

### 在 KubeSphere 上使用极狐 GitLab 搭建 DevOps 有什么优势？

最典型的优点就是可以实现极狐 GitLab & Runner 的云原生运行并实现灵活调度。

可以看下图这个实例，当研发人员提交代码变更之后，就会触发 CI/CD Pipeline，而极狐 GitLab CI 如果检测到有 Job 需要运行，就会给 Runner 一个信号，触发背后的调度机制，Executors 帮助完成所有的 Step，例如对 Go 源码进行 Check out、Build、Test。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-13.jpg)

如何在 KubeSphere 上安装极狐 GitLab ？

### 极狐 GitLab 和 KubeSphere 的集成主要有两个方式：

**➤ 方式一**

直接把极狐 GitLab Runner 作为单组件，安装在 KubeSphere 上，当我们的应用程序代码提交之后，开始跑 CI 时，就会自动在 KubeSphere 上完成所有构建操作，并直接反馈数据。

安装步骤如下：

1. 在 KubeSphere 的 App Management 下，通过 App Repositories 添加一个 App Repo；点击 Add 按钮，在出现的界面中输入 Repo name 和 URL（极狐 GitLab Runner 的 Helm Chart 地址为 https://charts.gitlab.io）。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-14.jpg)

2. 在 Create App 中选择“From App Template”：

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-15.jpg)

3. 选择 gitlab runner：

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-16.jpg)

4. 修改 Yaml 文件内容，输入极狐 GitLab 实例地址 Runner Token 等，点击 Install 即可。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-17.jpg)

5. 安装成功以后，就可以在 KubeSphere 上看到 jh-runner namespace 下面有 Pod 在正常运行。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-18.jpg)

**➤ 方式二**

把整个极狐 GitLab 源代码托管平台安装到 KubeSphere 上面去，目前在 KubeSphere 上部署极狐 GitLab 非常便利，只需要利用 KubeSphere 应用商店搜索极狐 GitLab 即可一键部署。安装好以后，团队就可以直接在 KubeSphere 上面使用极狐 GitLab 进行协作了。

详细安装教程：

https://gitlab.cn/blog/2022/04/01/jihu-kubesphere/?jh=gu0%20%E4%BD%9C%E8%80%85%EF%BC%9ABender%E5%BC%80%E6%BA%90%E4%B8%8D%20https://www.bilibili.com/read/cv16647014/%20%E5%87%BA%E5%A4%84%EF%BC%9Abilibili

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-19.jpg)

以上介绍了如何在 KubeSphere 上安装极狐 GitLab/Runner，接下来我们通过一个 Demo 介绍如何在 KubeSphere 上进行 DevSecOps 检测。

### 极狐 GitLab x KubeSphere 安全扫描 Demo

安装完以后，通过 Project → Settings → CI/CD 这个路径找到 Runner 页面，左边是项目专用 Runner，也就是只有这个项目可以用，其他项目用不了；右边共享 Runner 则是可以被此实例下的其他项目所使用的 Runner。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitlab-20230628-20.jpg)

接下来详细演示一下扫描过程：

- 先创建一个 Issue，这是 Workflow 的第一步，然后将这个需求 Issue 指派给自己；接着开始进行本地的代码编写，这里模拟一个场景，把 Token 这个敏感信息写进去，看看安全扫描过程是否能发现。

- 接下来我们创建一个 MR，把这段有问题的代码提交上去，提交时可以选定指派人或审核人，让其他人来帮忙审核代码。

- 创建 MR 以后，就会进行自动扫描，这时候就扫描出来了我们故意放进去的 Token，从而发现这个潜在安全问题。

- 最后，修复后重新提交，再次扫描没有问题就可以合入了。

以上就是一个简单的 Demo，来使用极狐 GitLab 的安全扫描功能。

## 总结

本文给大家介绍了极狐 GitLab 和 KubeSphere 各自的优势，并探讨了如何结合 KubeSphere 和极狐 GitLab 来构建一个云原生应用安全体系，最后通过一个示例来展示极狐 GiLab DevSecOps 功能的工作原理，希望对大家有帮助～
