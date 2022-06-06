---
title: 'KubeSphere 2.1.0 发布！多项功能与用户体验优化！'
tag: '产品动态'
keywords: 'KubeSphere, Kubernetes'
description: 'KubeSphere 2.1.0 对安装部署、DevOps、应用商店、存储、可观测性、认证与权限等模块提供了诸多新功能和深度优化，更好地帮助企业用户在测试生产环境快速落地云原生技术和运维 Kubernetes。'
createTime: '2019-11-11'
author: 'Feynman Zhou'
image: 'https://pek3b.qingstor.com/kubesphere-docs/png/20191112093503.png'
---


![](https://pek3b.qingstor.com/kubesphere-docs/png/20191112093503.png)

## 2.1.0 正式发布

2019 年 11 月 11 日，KubeSphere 开源社区激动地向大家宣布，KubeSphere 2.1.0 正式发布！2.1.0 版本不仅在安装上提供了`最快速方便的安装方式，解耦了核心的功能组件并提供了可插拔的安装方式`，还提供了非常多的让开源社区用户期待已久的新功能，**并修复了已知的 Bug**。

同时，社区对 KubeSphere 组件的高可用进行了深度优化与测试，因此，该版本也是被定义为 `Prodcution-ready` 的，`支持用户在生产环境部署和使用`。我们在此对社区用户提交的 issue、PR、Bug 反馈、需求建议、文档改进等一系列贡献表示由衷的感谢，并对 2.1.0 版本做出巨大贡献的开发者们深表谢意。

在新版本中，KubeSphere 对 `安装部署、DevOps、应用商店、存储、可观测性、认证与权限` 等模块提供了诸多新功能和深度优化，**更好地帮助企业用户在测试生产环境快速落地云原生技术和运维 Kubernetes，使开发者能够更专注在业务本身，赋能运维和测试人员高效地管理集群资源，实现业务快速发布与持续迭代的需求**。同时，功能组件的可插拔安装能够满足不同用户的个性化需求，下面先通过一张图来快速介绍 2.1.0 版本各功能模块的新功能与优化项。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191112191613.png)

## 应用商店

KubeSphere 是一个 **以应用为中心** 的容器平台，基于自研的开源项目 OpenPitrix (openpitrix.io) 构建了应用商店、内置应用仓库与应用生命周期管理，KubeSphere 应用商店 **对内可作为团队间共享企业内部的中间件、大数据、业务应用等**，以应用模板的形式方便用户快速地一键上传和部署应用到 Kubernetes 中；**对外可作为根据行业特性构建行业交付标准、交付流程和交付路径的基础，作为行业通用的应用商店**，可根据不同需求应对不同的业务场景。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025011318.png)


在 2.1.0 版本中，KubeSphere 从业务视角实现了应用的生命周期管理，支持 Helm 应用的 **上传提交、应用审核、测试部署、应用上架、应用分类、应用升级、应用下架**，帮助开发者或 ISV 将应用共享和交付给普通用户。同时，应用商店内置了多个常用的 Helm 应用方便开发测试。未来将提供基于应⽤的监控指标、应⽤⽇志关键字段告警能⼒，以及计量计费等运营功能。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111154118.png)

## DevOps

DevOps 是云原生时代在开发测试与持续交付场景下最核心的一环，KubeSphere 2.1.0 对 DevOps 系统进行了深度优化，流水线、S2I、B2I 提供了代码依赖缓存支持，**使构建速度大幅提升**。在 CI/CD 流水线集成了更多 Jenkins 插件和版本，优化了流水线 Agent 节点选择，新增了对 PV、PVC、Network Policy 的支持，**并将这一系列优化成果贡献给了 Jenkins 社区**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111162132.png)

结合 S2I & B2I，能够实现用户只需要提交一个仓库地址，或上传 JAR/WAR/Binary 等二进制文件，即可快速**将制品打包成 Docker 镜像并发布到镜像仓库，最终将服务自动部署至 Kubernetes 中，无需编写一行 Dockerfile**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111174017.png)

针对企业中不同角色的用户，KubeSphere 希望打造的是一个 **以容器为载体的端到端的应用交付平台**，实现从 **项目管理、应用开发、持续集成、测试，到应用的生产交付** 的流程是一个完整的闭环，用户借助一个**统一的平台和相关插件**，就可以实现业务的快速交付。后续版本可能会将流水线与应用商店打通

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111155401.png)

## 可观测性

日志通常含有非常有价值的信息，日志管理是云原生可观测性的重要组成部分。不同于物理机或虚拟机，在容器与 Kubernetes 环境中，日志有标准的输出方式(stdout)，这使得进行平台级统一的日志收集、分析与管理水到渠成，并体现出日志数据独特的价值。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111164845.png)

KubeSphere 提供了**多租户与多维度的日志查询系统**，开发了 **FluentBit Operator** (github.com/kubesphere/fluentbit-operator) ，并将其应用到 KubeSphere 中作为日志收集器，提供灵活的日志收集功能。在 2.1.0 版本中，对于将日志以文件形式保存在 Pod 挂盘上的应用，**新增了在 UI 上开启落盘日志收集功能，支持中文日志的检索，以及日志导出功能**。同时，新版本**优化了日志检索速度，增加了 Prometheus Pod 反亲和性，避免 Prometheus 的单点故障**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111164821.png)

## 用户体验

Kubernetes 无疑已经是容器编排的事实标准，但 Kubernetes 本身的学习门槛和易用性一直是开发者和运维用户的痛点。**KubeSphere 不仅仅只是一个简单的 Dashboard，它是经 CNCF 认证的 Kubernetes 主流开源发行版之一，在 Kubernetes 之上提供多种以容器为资源载体的业务功能模块**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111170310.png)

2.1.0 版本极大简化了 Kubernetes 资源的创建与管理，**提供了友好的向导式的交互，以及更丰富的资源状态监控展示**，**让底层资源使用情况和集群排障不再是黑盒**。KubeSphere 根据用户平时的开发习惯来设计用户的操作路径，尽可能减少额外的学习成本，2.0.x 版本原本需要多个步骤完成一个微服务的创建，在 2.1.0 仅需要在一个页面中完成。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111171133.png)


## 未来计划

**社区计划（Community Roadmap）**

以下计划、项目与活动欢迎广大社区用户参与进来，我们也十分期待有更多的开发者与用户参与到新版本的开发、测试与贡献，**共同打造业界最领先的容器平台。**

> - 前端开源（预计两周）
> - 开发者文档（贡献指南）
> - 成立社区项目委员会，设立 SIG（欢迎 KubeSphere 用户与云原生爱好者加入）
> - KubeSphere 云原生工程师图谱
> - 12月中旬在北京举办线下 Meetup
> - 持续完善中文文档，提供更多应用场景的示例教程
> - 文档国际化


**产品计划（Product Roadmap）**

> - 2.1.1 Bugfix
> - 支持更多云平台的存储、网络、LB 插件
> - 多集群管理（3.0）
> - 应用商店流程优化（3.0）
> - 通知系统优化（3.0）
> - 自定义监控（3.0）
> - AI 平台
> - 物联网
> - SDN
> - 更多新版本的计划欢迎参与社区探讨与设计开发

## 如何安装升级

可参考官网 kubesphere.io，在文档的安装指南找到安装教程，**支持一键安装与升级，快速安装至 Linux 和 Kubernetes 仅需一行命令**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191111175033.png)

