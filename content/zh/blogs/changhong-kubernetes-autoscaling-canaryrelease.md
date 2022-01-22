---
title: '长虹电器基于 Kubernetes 的弹性伸缩与金丝雀发布实践'
tag: 'Kubernetes,KubeSphere,弹性伸缩,金丝雀发布'
keywords: 'Kubernetes, KubeSphere, 弹性伸缩, 金丝雀发布'
description: '本文是 2021 KubeSphere Meetup 成都站讲师娄举分享内容整理而成，分享了长虹智能电视增值平台项目基础架构如何借助 KubeSphere 从旧有的传统模式迁移到 Kubernetes，以及使用 KubeSphere 如何进行弹性伸缩和金丝雀发布。'
createTime: '2021-07-09'
author: '娄举'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/HPA-Canary.png'
---

## 背景

2013 年四川长虹电器发布了公司面向互联网时代的全新战略规划和产业布局，首次提出将智能化、网络化和协同化做为新的三坐标体系的发力方向。为了推进智能化战略落地，加快黑电转型升级的计划，长虹电器于 2015 年组建了互联网事业部。

2019 年初，我们运维的各类系统产生的数据日均接近三亿条，服务器、虚拟机多种多样，零散分布在 AWS、腾讯云、阿里云、华为云及本地机房中，运行的应用数以千计，而且各个应用依赖的运行环境差异极大。

同一年集团提出了新的运营计划，要求智能电视增值运营平台要按照用户规模翻倍的目标进行业务规划，若要实现这个目标，当时的基础平台支撑起来难度颇大，甚至可以断言无法支撑，所以我们亟需对整个基础架构进行改造。

## 为什么使用 KubeSphere？

### 面临问题

在当时，我们面临的问题大致有这六点：

1. 系统初始化和运行环境部署复杂：开通资源的方式非常落后，审批通过后由运维手动建立虚拟机，之后在虚拟机上配置检验项，之后再按照这台虚拟机需要运行的应用去安装运行环境和依赖包。
2. 迭代时要求服务短中断甚至零中断：由于我们的服务全是面向最终用户的，集团提出的新要求是短中断甚至零中断，避免引起用户投诉，坦率而言，依照当时我们基础平台的能力，是无法满足这个要求的。
3. 应用需要多版本共存并且可以基于这些版本提供A/B测试：在当时还是以虚机的方式来响应资源，已经跟不上需求了。
4. 项目间物理隔离，资源使用率低：因为我们部门同时运维自己开发的项目和其他部门、公司开发的智能电视应用，基于公司的权责规定，项目需要进行隔离，就出现了部分项目资源使用率非常低的问题，导致了成本浪费。
5. 不具备自动扩缩容能力：由于电视业务的特性，其实在大多数时候我们的资源都是空置的，而基于当时的状况，我们也无法提供自动扩缩容的能力。
6. 项目团队规模不大，无法投入过多时间成本：事实上哪怕到了今天，我们部门研发、测试、运维加起来都不到 40 人，所以人力成本和时间成本控制对于我们部门来讲，是重中之重。

### 方案选择

基于对上述问题的思考，我们开始寻找图形化的管理工具作为突破口，在寻找图形化工具的时候我接触到了 KubeSphere，然后进行了试用。我们发现 KubeSphere 的设计思路和使用体验等方面都非常棒，有很多功能如**企业空间隔离**、**弹性伸缩**、**应用治理**、**日志落盘**等极大的降低了改造后的使用难度。

KubeSphere 在我们需求中的优势：
- **图形化操作**，极大的降低了开发、测试、运维同事的学习成本。
- **多租户隔离**，满足了我们项目资源隔离的需求。
- **不绑定云厂商**，方便我们后续整体迁移和资源集中。
- 常用功能的集成减少了诸如 API Gateway 等模块的开发工作量。
- **多集群集中管理**的特性，使得我们通过一个平台集中管理当时散落在各处的服务器资源具备了可能性。

经过一个多月的试用，我们最终决定，使用 KubeSphere 作为我们云端服务基础设施平台的建设方案。

![KubeSphere 在我们需求中的优势](https://pek3b.qingstor.com/kubesphere-community/images/advantages-KubeSphere.png)

## KubeSphere 的落地实践

### 业务流程总结

在确定方案选型后，我们梳理了当时开发和维护的项目，总结了共性部分，提取了一个流程图。

![业务流程图](https://pek3b.qingstor.com/kubesphere-community/images/workflow-changhong.png)

流程图并不涉及具体的业务逻辑，可以分解如下：
- 电视终端发起 http 请求到负载均衡器
- 负载均衡器分发请求到接口应用上
- 接口应用将写请求通过 MQ 消峰填谷后转移至后端应用
- 后端应用写入 MySQL 或者 NoSQL，同时将数据同步到缓存
- 读请求则由接口应用读取缓存数据后直接返回电视终端
- 运营活动则是由运营同事操作管理后台将数据写入数据库

对于运维而言，这样的结构简单清晰。那么我们落地的思路也变得清晰起来：

以容器管理平台 KubeSphere 为基础来运行无状态服务（接口应用、后端应用），以及可视化管理 Kubernetes 和基础设施资源。而 PaaS 提供有状态的服务，比如消息中间件、数据库等。

### 落地方案设计

我们使用 KubeShere 管理多个公有云集群，利用 KubeSphere 的多租户管理的便捷性，将我们部门自行开发的业务和其他部门开发的业务分成了两个企业空间，同时使用了 KubeSphere 多个可插拔组件来解决一些我们业务的痛点。

![落地方案设计图](https://pek3b.qingstor.com/kubesphere-community/images/project-changhong.png)

同时由于我们并非完全重构所有项目，很多项目其实是从旧项目直接改造适配  Kubernetes 的，所以这些项目的日志还是打印到文件的，KubeSphere 提供的日志落盘功能并不能收集这些日志，我们又想使用 KubeSphere 的日志功能，又困惑于如何收集文件日志。**在社区的帮助下，我们找到了 KubeSphere 日志功能的设计方案，增加了采集器的数据采集点，最终实现了 console、文件日志收集，存储到 es，使用 kibana 展示的功能，在此再次感谢社区的热心帮助。**

### CI/CD 实现

解决了生产环境落地的问题之后，我们希望测试环境和开发环境能实现 CI/CD，因为我们在使用 Kubernetes 之前已经基于 Gitlab、Jenkins、SonarQube 搭建了 CI/CD 系统，为了尽可能不影响原有开发流程，在使用 Kubernetes 之后，我们基于 Python 的 kubernetes-client 开发了一套简易的发布平台。

![简易发布平台和 CI/CD 流程](https://pek3b.qingstor.com/kubesphere-community/images/CICD-changhong.png)

## 基于 KubeSphere 的弹性伸缩实践

### 需求背景

这张图是我们部门某个核心业务的负载均衡器连续 7 天的活跃链接数平均值，从这张图可以看出来，我们部门运维的业务具备明显的潮汐效应特征，请求峰值均出现在 6：00-7：15，17：00-22：00 两个时间段内，其余时间段请求值表现平稳。

![某核心业务负载均衡器连续 7 天的活跃链接数平均值](https://pek3b.qingstor.com/kubesphere-community/images/lb-changhong.png)

从系统资源使用率来看，也可以佐证上述业务特征，在峰值时段，大部分虚拟机 CPU load 每核接近 0.95，内存使用率超 85%，但在非峰值时段，CPU load 低于 0.1，内存使用率也在 30% 左右徘徊。

万物上云的时代，企业都在讲向运维要效率、向运维要效益，毕竟节约下来的都是企业的利润，那么结合我们的业务实际，**如何在控制成本的同时，解决高并发应对、保障业务稳健性的问题？**

### 解决方法

通过阅读 Kubernetes 的文档，我们发现 Kubernetes 具备弹性伸缩的功能，它的弹性伸缩有三种：

- CA（Node 级别自动扩/缩容）
- HPA（Pod 数量自动扩/缩容）
- VPA（Pod 配置自动扩/缩容）

CA 依赖于云平台的能力，而通过设置 HPA 可以触发 CA。在 KubeSphere 中，开发人员将 HPA 实现为弹性伸缩功能，通过简单的图形化操作，可以很好的解决前述问题。

### 弹性伸缩设置方法

在使用 KubeSphere 的弹性伸缩前，需要先启用可插拔组件 Metrics Server，它是 Kubernetes 集群资源使用情况的聚合器，收集所有 Node 节点的 Metrics 信息。

由于我们是先部署好 Kubernetes，在其上再安装 KubeSphere的，那么我们需要在安装后的 KubeSphere 启用该功能。

启用方法：
1. 在 KubeSphere 的集群管理界面，找到 CRD
2. 打开后输入 `clusterconfiguration` 进行搜索
3. 点击搜索结果，在打开的页面中点击 ks-installer 右侧的按钮，选择编辑配置文件
4. 在打开的 YAML 文件里找到 Metrics Server，在 enabled 一行将 false 更改为 true
5. 之后点击右下角的更新即可

![ CRD](https://pek3b.qingstor.com/kubesphere-community/images/CRD-changhong.png)

![修改 YAML 文件](https://pek3b.qingstor.com/kubesphere-community/images/yaml-changhong.png)

待 Metrics Server 启用完毕后，进入项目应用负载下的工作负载页面，点击工作负载的名称进入工作负载页面，右侧边栏处，点击更多操作，弹性伸缩。在弹出的页面中根据实际情况填充数值，确定后即可生效。

![工作负载页面](https://pek3b.qingstor.com/kubesphere-community/images/workload-changhong.png)

![设置弹性伸缩页面](https://pek3b.qingstor.com/kubesphere-community/images/HPA-changhong.png)

这里需要注意的一点是：如果使用基于 CPU 使用率的 HPA，就必须在创建容器时设置预留最低 CPU 资源，否则此处就会无法设置基于 CPU 使用率的 HPA。

![设置完成后页面](https://pek3b.qingstor.com/kubesphere-community/images/over-changhong.png)

弹性伸缩完美的解决了控制成本、应对高并发、保障业务稳健性等问题，而 KubeSphere 简单明了的图形化操作，大幅降低了使用者的学习成本，现在我们很多核心业务如用户积分、实时推荐等均使用上了 HPA ，都是通过 KubeSphere 的界面设置的，现在基本上已经不需要运维干预了。

## 基于 KubeSphere 的金丝雀发布实践

### 需求背景

因我司的智能电视终端存在机型多、机芯多的特性，在发布新内容时，都需要进行 A/B 测试。以前我司实现的方法是由运营同事通过后台功能，为指定的机芯机型重新配属终端对接的后端接口地址，这种方法需要运营同事重建整个页面板块和模块，不仅工作量大，而且需要在夜间完成，极容易出现人为失误。

![A/B 测试](https://pek3b.qingstor.com/kubesphere-community/images/AB-changhong.png)

### 解决方法

在我们引入 KubeSphere 后，发现它已经提供了基于 Istio 的应用治理可插拔组件，将灰度发布和金丝雀发布合并为了金丝雀发布功能，这个功能可以满足我们的需要。

从实际使用来看，其操作简单、易学易懂，在和开发约定好参数之后，**经过简单的培训，运营同事可以轻松的配置金丝雀发布功能。**

使用金丝雀发布，运营同事在应用下发布两个版本，通过终端请求云端时携带的关键字分流解决了预览版本小批量用户测试的需求。

### 金丝雀发布设置方法

使用金丝雀发布，需要先启用 KubeSphere 的服务网格和日志组件，启用方法与前述启用 Metrics Server 类似，就不再赘述了。

启用后，在项目下左侧导航栏可以找到灰度发布链接，进入灰度发布页面后，点击金丝雀发布左下方的发布任务。

![金丝雀发布功能位置](https://pek3b.qingstor.com/kubesphere-community/images/GatedLaunch-changhong.png)

设置任务名称后，进入应用和服务选择页面，需要注意的是，金丝雀发布只支持应用下的服务，所以在使用金丝雀发布前，需要先在项目下创建应用。

![灰度版本设置](https://pek3b.qingstor.com/kubesphere-community/images/Gatedlaunch-release-changhong.png)

在灰度版本这里，添加需要做测试的预览版本的镜像。

![灰度策略设置](https://pek3b.qingstor.com/kubesphere-community/images/Gatedlaunch-strategy-changhong.png)

策略设置这里，选择按请求内容下发，我们发布的预览版本使用的 url 正则匹配，由安卓客户端完成请求 url 的拼装，云端这里根据 url 请求匹配分流。之后在灰度任务页面中的任务状态里找到金丝雀发布任务，点击进入后即可查看流量控制的策略和流量情况了。

![流量控制的策略和流量情况查看页面](https://pek3b.qingstor.com/kubesphere-community/images/flow-changhong.png)

**KubeSphere 提供的金丝雀测试功能配置过程清晰明了，且能随时随意调整，大大减轻了运营工作量，同时也杜绝了人为失误的风险，自将手动配置的 A/B 测试切换至金丝雀发布后我们的 A/B 测试再也没出现过问题，也不再需要在夜间拉上运营、开发、运维同事搞 A/B 测试配属和迭代了。**

## 未来展望

### CI/CD 迁移至 DevOps 

通过与社区的交流，我们认为  KubeSphere 自带的 DevOps 组件很适合 Kubernetes 环境使用，计划后期将我们现有的 CI/CD 系统逐步切换至 KubeSphere 的 DevOps，目前已经开始了试点项目的摸索。

![DevOps 流程](https://pek3b.qingstor.com/kubesphere-community/images/DevOps-changhong.png)

### 更直观集中的可视化大屏

在当前的 KubeSphere 版本中，各个模块的数据展示和监控图表分散在各个模块中，希望 KubeSphere 社区后续能提供一个无需登录的对外展示大屏，以便可以让所有相关人员一目了然的了解集群的状态、异常、流量请求等情况。