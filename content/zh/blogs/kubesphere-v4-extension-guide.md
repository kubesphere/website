---
title: 'KubeSphere v4 扩展组件使用指南'
tag: 'KubeSphere, Kubernetes, KubeSphere v4, KubeSphere LuBan'
createTime: '2024-11-07'
author: 'KubeSphere'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-extension-guide-cover.png'
---

日前，KubeSphere v4 发布，相较于之前的版本，新版本在架构上有了较大的变化。其中，有一个新的概念——扩展组件。

本文我们将针对扩展组件做一个详细的说明，让大家对扩展组件能够了解、理解和丝滑使用。

关于 KubeSphere v4 的介绍，请阅读本文：[KubeSphere v4 开源并发布全新可插拔架构 LuBan](https://www.kubesphere.io/zh/news/kubesphere-v4-ga-announcement/)。

如何安装 KubeSphere v4，请参考本文：[KubeSphere v4 安装指南](https://www.kubesphere.io/zh/blogs/kubesphere-v4-install-guide/)。

## 扩展市场介绍

KubeSphere 扩展组件用于扩展 KubeSphere 的平台能力，用户可在系统运行时动态地安装、卸载、启用、禁用扩展组件。

监控、告警、通知、项目网关和集群网关、卷快照、网络隔离等功能，将由扩展组件来提供。

**扩展组件的方式，解决了 KubeSphere 之前版本诸如“发版周期长”、“代码耦合”、“系统资源占用过多”等问题。用户可以根据自己的需求来安装和启用扩展组件，真正做到按需使用，实现轻量化。另外，用户还可以根据自己的需求进行定制和扩展，以满足不同的设计和功能要求。**

目前，我们已经开源了 21 个扩展组件，您可以根据对应 v3.4 中的功能决定是否安装，分别是：


| 扩展组件名称                      | 对应 v3.4 功能点 | 新增功能点       | 挂载位置             |
| --------------------------------- | ---------------- | ---------------- | -------------------- |
| KubeSphere 网络                   | IP池、网络隔离      | 无   | 项目、企业空间、集群管理页面左侧导航栏                      |
| KubeSphere 应用商店管理           | 应用上架审核，chart 包上传     | 全局应用实例管理 | 九宫格，企业空间导航 |
| KubeSphere 存储                   | 存储类授权规则，PVC 自动扩容，快照             | 无             |                      集群和项目的左侧导航栏|
| KubeSphere 服务网格               | 灰度发布<br>自制应用             | 无             | 项目管理页面左侧导航栏 |
| KubeSphere 多集群代理连接         | 使用代理连接模式纳管集群 | 无             | 添加集群模式选择下拉框 |
| KubeSphere 网关                   | 项目、企业空间、集群网关             | 创建 Ingress 时支持配置 Ingress class  | 项目、企业空间、集群管理页面左侧导航栏 |
| DevOps                            | 流水线、持续部署、代码仓库、S2I/B2I  | 无             |   企业空间左侧导航栏                  |
| KubeEdge                          |边缘计算            | 无           |   集群左侧导航栏                   |
| 联邦集群应用管理                  | 联邦项目以及联邦应用 | 无             | 企业空间左侧导航栏 |
| OpenSearch 分布式检索与分析引擎   | OpenSearch             | 无             |      无挂载点，直接暴露服务进行访问                |
| Grafana for WhizardTelemetry      | -             | 新增扩展，增强 WhizardTelemetry 可观测平台的可视化能力 | 无挂载点，直接暴露服务进行访问  |
| Grafana Loki for WhizardTelemetry | -             | 部署 Grafana Loki             |     无               |
| WhizardTelemetry 数据流水线       | 提供日志、事件、审计等数据收集能力，用以替代 FluentBit             | 无            |       无               |
| WhizardTelemetry 平台服务         | 提供监控、日志、审计、事件、通知查询接口             | 无             |       无             |
| WhizardTelemetry 告警             | KubeSphere 告警             | 无             | 集群和项目的左侧导航栏                     |
| WhizardTelemetry 事件             | KubeSphere 事件             | 支持使用 Loki 作为后端存储             |            ⼯具箱          |
| WhizardTelemetry 日志             | KubeSphere 日志             | 支持使用 Loki 作为后端存储             |      ⼯具箱、集群设置                |
| WhizardTelemetry 监控             | KubeSphere 监控            |  增强集群概览与项目概览页面监控            |         集群和项目的左侧导航栏将显示监控告警，可查看集群状态等，集群、企业空间、项目下等诸多页面也将显示相关监控数据  |集群和项目的左侧导航栏
| WhizardTelemetry 通知             | KubeSphere 通知             | 支持使用 Loki 作为通知历史的后端存储。通知只需要在 host 集群部署了             |      平台设置左侧导航栏                |
| Metrics Server                    |  可视化创建和管理 HPA         | 无             |工作负载（Deployment/SatetfulSet） 详情页支持可视化创建和管理 HPA                      |
| Gatekeeper                        | 安全准入策略管理             | UI 支持<br>版本更新             | 集群管理页面左侧导航栏 |

扩展组件仓库：https://github.com/kubesphere-extensions/ks-extensions/

您可以在扩展组件仓库中了解每个扩展组件的具体功能以及详细的安装及使用方法。

> 注意：扩展市场不等同于应用商店，两者的对比，可参考[对比文档](https://dev-guide.kubesphere.io/extension-dev-guide/zh/faq/01-difference/)。
> 
> 关于应用商店的使用方法，详见文章 [KubeSphere v4 应用商店配置指南](https://www.kubesphere.io/zh/blogs/kubesphere-v4-appstore-configuration-guide/)。

## 扩展组件使用方式

KubeSphere v4 除账户、权限、租户、实时监控和日志功能外，其他功能都以扩展组件提供且不默认安装。

在安装完成后，请从左上角“扩展市场”导航菜单进入扩展市场，按需开启扩展组件。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-1.jpg)

> 💡  如果扩展市场是空的，怎么排查？
> 1. `kubectl -n kubesphere-system get deploy extensions-museum` 检查本地扩展组件仓库是否正常 Running
> 2. `kubectl describe repository.kubesphere.io extensions-museum` 检查扩展组件仓库是否正常同步
> 3. 主动触发同步 `kubectl patch repository extensions-museum --type=merge -p '{"status":null}'`

接下来以 Gatekeeper 扩展组件为例进行演示。

打开需要安装的扩展组件详情页面：

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-2.png)

依次点击“管理”、“安装”，选择合适的扩展组件版本：

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-3.png)

对扩展组件进行配置：

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-4.png)


点击开始安装：

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-5.png)

等待安装完成后点击下一步，选择需要开启扩展组件的目标集群：

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-6.png)


对目标集群中扩展组件进行差异化配置，在差异化配置页签，分别编辑选中集群的 YAML 配置，也可不修改，使用初始默认配置。点击确定，开始配置集群 Agent：

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-8.png)


等待扩展组件集群 Agent 安装完成后**刷新页面**：

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-9.png)

安装完成后，默认启用该组件。您可以在扩展中心对扩展组件进行启用、禁用、配置变更、卸载等操作：

![](https://pek3b.qingstor.com/kubesphere-community/images/20271107-10.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-11.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-12.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-13.png)

不同的扩展组件会有不同的集成方式，有的会将扩展组件的功能入口放在顶部导航栏，有的扩展组件会将功能入口放在企业空间或项目的侧边栏，有的扩展组件会将功能入口放在快捷访问入口。

还是以 Gatekeeper 扩展组件为例，扩展组件安装完成之后，进入到集群管理页面，从左侧导航栏可以进入扩展组件的功能入口。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-14.png)

查看扩展组件的默认配置：

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-15.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/20241107-16.png)

> 目前[官网文档](https://www.kubesphere.io/zh/docs/v4.1/11-use-extensions/)也已更新，详细介绍了如何使用 KubeSphere 的各个扩展组件，您也可以参考。

## 开发自己的扩展组件，创造属于您自己的价值

社区目前正在逐步发布开源的扩展组件，为各位用户提供更多的功能，让各位用户有更多的选择。同时您可以开发自己的扩展组件，并将其上架到 Marketplace，为其定价，如果是确实有价值的扩展组件，相信您可以收获到对应的回报。

目前，已经有一位参与开源之夏的学生贡献者张豈明，开发了一款扩展组件 Pod Status Analysis Tool，地址： https://github.com/kubesphere-extensions/ks-extensions-contrib/tree/main/pod-analyzer。

贡献仓库： https://github.com/kubesphere-extensions/ks-extensions-contrib

开发指南： https://dev-guide.kubesphere.io/extension-dev-guide/zh/

## 总结

以上就是扩展组件使用的方法说明。如果您在使用过程中出现问题，可去论坛搜索是否有解答，如没有，可在论坛提问：https://ask.kubesphere.io/forum/。