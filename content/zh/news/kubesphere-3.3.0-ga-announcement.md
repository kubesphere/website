---
title: 'KubeSphere 3.3.0 发布：全面拥抱 GitOps'
tag: '产品动态'
keyword: '社区, 开源, 贡献, KubeSphere, release, AI, GPU'
description: 'KubeSphere 3.3.0 带来了更多令人期待的功能，新增了基于 GitOps 的持续部署方案，进一步优化了 DevOps 的使用体验。同时还增强了 “多集群管理、多租户管理、可观测性、应用商店、微服务治理、边缘计算、存储” 等特性，更进一步完善交互设计，并全面提升了用户体验。'
createTime: '2022-06-27'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/202206271135109.jpeg'
---

**2022 年 6 月 27 日，KubeSphere 开源社区激动地向大家宣布，KubeSphere 3.3.0 正式发布！**

CNCF 发布的 2021 年度调查报告指出，容器和 K8s 的事实地位已经趋于稳固，并慢慢退居“幕后”，类似于无处不在的 Linux，人们甚至都感觉不到它的存在。这要得益于众多致力于降低用户使用门槛的 K8s 管理平台，KubeSphere 便是这其中的佼佼者，它帮助用户屏蔽了底层 K8s 集群的复杂性和差异性，提供了可插拔的开放式架构，无缝对接第三方应用，极大地降低了企业用户的使用门槛。

2021 年 KubeSphere 先后推出了 [v3.1](https://kubesphere.com.cn/news/kubesphere-3.1.0-ga-announcement/) 和 [v3.2](https://kubesphere.com.cn/news/kubesphere-3.2.0-ga-announcement/) 两个大版本，带来了 **“边缘计算”**、**“计量计费”**、**“GPU 资源调度管理”** 等众多令人期待的功能，将 K8s 从云端扩展至边缘，并进一步增强了在云原生 AI 场景的使用体验。

今天，KubeSphere 3.3.0 带来了更多令人期待的功能，新增了基于 **GitOps** 的持续部署方案，进一步优化了 DevOps 的使用体验。同时还增强了 “**多集群管理、多租户管理、可观测性、应用商店、微服务治理、边缘计算、存储**” 等特性，更进一步完善交互设计，并全面提升了用户体验。

并且，v3.3.0 得到了来自青云科技之外的更多企业与用户的贡献和参与，无论是功能开发、功能测试、缺陷报告、需求建议、企业最佳实践，还是提供  Bug 修复、国际化翻译、文档贡献，这些来自开源社区的贡献都为 v3.3.0 的发布和推广提供了极大的帮助，我们将在文末予以特别致谢！

## 解读 KubeSphere 3.3.0 重大更新

### 更易用的 DevOps

KubeSphere DevOps 从 3.3.0 开始，后端已支持独立部署，并提供了**基于 GitOps** 的持续部署（Continuous Delivery, CD）方案，**引入 Argo CD** 作为 CD 的后端，可以实时统计持续部署的状态。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=597808663&bvid=BV18B4y1q7kh&cid=756454741&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

以云原生 FaaS 项目 [OpenFunction](https://github.com/OpenFunction/openfunction) 为例，假设您的 KubeSphere 集群中已经部署了 nginx-ingress 和 knative-serving，可以通过 GitOps 持续部署 OpenFunction 的其他组件。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206222328838.jpg)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206222328198.jpg)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206222328876.png)

Jenkins 作为一款用户基数极大、生态丰富的 CI 引擎，我们会让 Jenkins 真正地“扮演”引擎的角色——退入幕后持续为大家提供稳定的流水线功能。之前 KubeSphere DevOps 通过轮询的方式来实现 Jenkins 流水线的数据同步，浪费了很多计算资源，本次新增了一个 Jenkins 插件，只要 Jenkins 端有相应的事件发生，就可以通过 Webhook 的形式立即将事件发送到 [ks-devops](https://github.com/kubesphere/ks-devops)。

KubeSphere DevOps 从 3.1.0 开始便内置了两个常用的流水线模板，帮助 DevOps 工程师提升 CI/CD 流水线的创建与运维效率。但内置的模板内嵌到了前端代码中，很难被改变。3.3.0 对流水线模板进行了重构，新增多款**基于 CRD 的内置流水线模板**，支持参数设置，用户也可以通过 CR 创建多个自定义的模板。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206221356105.jpg)

### 多集群与多租户

云原生技术的爆发倒逼应用的可移植性越来越高，最终会有越来越多的组织选择跨不同的云厂商或者在不同的基础设施上运行和管理多个 K8s 集群，可以说**云原生的未来就是面向多集群的应用交付**。

KubeSphere 为用户提供了统一的控制平面，可以将应用程序及其副本分发到位于公有云和本地环境的多个集群。KubeSphere 还拥有跨多个集群的丰富可观测性，包括集中监控、日志系统、事件和审计日志等。

之前 KubeSphere 的管理权限是针对所有集群分配的，无法针对单独的集群设置权限。从 v3.3.0 开始，KubeSphere 支持分别为每个集群设置**集群成员**和**集群角色**，提供了更细粒度的权限管控机制，进一步完善了 KubeSphere 的多租户系统。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206231233713.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206231233634.png)

KubeSphere 通过 CustomResourceDefinition（CRD）来定义集群，并将每个集群的信息保存在 CR 中。但 CR 只会保存在 host 集群中，member 集群中的应用无法获取自身所在集群的信息（比如集群名称），部分功能实现起来比较麻烦。比如告警管理系统发送通知时需要在通知中添加集群的标签，以标识该通知来自哪个集群，但无法自动获取，只能手动设置。

v3.3.0 解决了这个痛点，将集群名称添加到了 ConfigMap `kubesphere-config` 中，因为每个集群都会有这个 ConfigMap，所以集群中的应用可以通过这个 ConfigMap 获取到自身所在的集群名称。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206231251258.jpg)

除了以上这些改进之外，还优化了多集群的管理体验，比如可以直接在 Console 界面更新每个集群的 kubeconfig 内容。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206231305130.jpg)

而且当 member 集群 kubeconfig 中的证书即将过期时会即时提醒用户，用户收到提示后可以尽快通过上述方法更新集群的 kubeconfig 内容。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206231430506.jpg)

### 边缘节点纳管

KubeSphere 通过与 KubeEdge 集成，解决了边缘节点纳管、边缘工作负载调度和边缘可观测性等难题，结合 KubeEdge 的边缘自治功能和 KubeSphere 的多云与多集群管理功能，可以实现云-边-端一体化管控。

v3.3.0 优化了边缘节点的管控能力，可以**直接在 Console 界面登录边缘节点的终端**，以便直接在边缘端进行操作，比如：

+ 下载镜像，更新边缘端应用；
+ 在边缘端更新 EdgeCore 和 Docker；
+ 修改边缘节点的机器配置；
+ ...

当然，Console 界面不仅可以登录边缘节点，也可以登录普通的节点。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206231953681.jpg)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206231953570.png)

我们还将 KubeEdge 从 v1.7.2 升级到了 v1.9.2，同时移除了 EdgeWatcher 组件，因为 KubeEdge 已经提供了类似的功能。

### 增强可观测性

KubeSphere 提供了丰富的可视化功能，支持从基础设施到应用的多维度指标监控。此外，KubeSphere 还集成了许多常用的工具，包括多租户日志查询和收集、告警和通知等功能。

v3.3.0 新增了很多监控新特性，支持在租户级自定义监控中导入 Grafana 模板，添加了容器进程/线程指标，同时还优化了磁盘使用率指标，支持显示每个磁盘的使用情况。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206221931873.png)

现在用户也可以分别设置审计、事件、日志及 Istio 日志信息的保留时间。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206261839042.jpg)

除此之外，还对已有的监控、日志、告警等组件进行了升级：

+ Alertmanager: v0.21.0 --> v0.23.0
+ Grafana: 7.4.3 --> 8.3.3
+ kube-state-metrics: v1.9.7 --> v2.3.0
+ node-exporter: v0.18.1 --> v1.3.1
+ Prometheus: v2.26.0 --> v2.34.0
+ prometheus-operator: v0.43.2 --> v0.55.1
+ kube-rbac-proxy: v0.8.0 --> v0.11.0
+ configmap-reload: v0.3.0 --> v0.5.0
+ thanos: v0.18.0 --> v0.25.2
+ kube-events: v0.3.0 --> v0.4.0
+ fluentbit-operator: v0.11.0 --> v0.13.0
+ fluent-bit: v1.8.3 --> v1.8.11

### 运维友好的存储管理

持久化存储是 K8s 系统中提供数据持久化的基础组件，是实现有状态服务的重要保证。KubeSphere 从 v3.2.0 开始便在 Console 界面新增了**存储管理**功能，支持很多管理员级别的运维操作。v3.3.0 进一步优化了存储管理功能，管理员可以根据需要为**存储类型**（StorageClass）设置 PVC 自动扩展策略，当用户的 PVC 剩余容量不足时，就会按照预设的策略进行扩展。

为了进一步控制存储的操作权限，v3.3.0 支持了租户级别的存储权限管理，可以为**存储类型**（StorageClass）设置授权规则，限制用户只能在特定项目和企业空间使用存储类。

此前 KubeSphere Console 界面不支持对卷快照内容（VolumeSnapshotContent）和卷快照类型（VolumeSnapshotClass）进行管理，这个功能在 KubeSphere 3.3.0 得以实现，现在用户可以在 Console 界面查看上述两类资源，并对其进行编辑和删除操作。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=215301709&bvid=BV17a411W7Xb&cid=756456073&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 服务暴露优化

目前社区有大量用户选择在物理机安装部署 K8s，并且还有大量客户是在离线的数据中心或边缘设备安装和使用 K8s 或 K3s，导致用户在私有环境对外暴露 LoadBalancer 服务比较困难。为了解决这个问题，KubeSphere 社区开源了 [OpenELB](https://github.com/openelb/openelb)，为私有化环境的用户提供了易用的 EIP 与 IP Pool 管理能力。

v3.3.0 默认集成了 OpenELB，即使是在非公有云环境的 K8s 集群下，也可以对外暴露 LoadBalancer 服务。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206241130074.png)

### 其他更新

+ 支持通过 ClusterConfiguration 对 Istio 进行更丰富的配置；
+ 新增 K8s 审计日志开启提示；
+ 支持应用整个配置字典；
+ 支持容器生命周期 hook 设置；
+ 支持流量监控统计时间配置；
+ 优化部分页面文案描述；
+ 优化了服务拓扑图详情展示窗口优化；
+ 修复了删除项目后项目网关遗留的问题；
+ 优化了 ClusterConfiguration 更新机制，无需重启 ks-apiserver、ks-controller-manager；
+ 由于政策要求暂时屏蔽了自动生成的 nip.io 路由，下一个版本中将会提供后台开关。

## 持续开源开放

借助于开源社区的力量，KubeSphere 迅速走向全球，目前 KubeSphere 的用户遍布全球，覆盖超过了 **100** 个国家和地区，下载量近**百万**，拥有贡献者近 **300 人**，主仓库在 GitHub 上 Star 数超过 **10000**，Fork 数超 **1500**。v3.3.0 Console 除了支持中、英、繁中和西班牙语之外，还支持了更多的语种，进一步拓展了海外市场。

未来 KubeSphere 团队将继续保持开源、开放的理念，v3.3.0 带来的众多优化也早已在 GitHub 开源，例如 [Console](https://github.com/kubesphere/console/)、[OpenELB](https://github.com/kubesphere/openelb/)、[Fluent Operator](https://github.com/fluent/fluent-operator)、 [KubeKey](https://github.com/kubesphere/kubekey/)、[KubeEye](https://github.com/kubesphere/kubeeye/)、[Notification Manager](https://github.com/kubesphere/notification-manager/)、[Kube-Events](https://github.com/kubesphere/kube-events/)、[ks-devops](https://github.com/kubesphere/ks-devops/)，相关的代码与设计文档在 GitHub 相关仓库都可以找到，欢迎大家在 GitHub 给我们 Star + Fork + PR 三连。

## 安装升级

KubeSphere 已将 v3.3.0 所有镜像在国内镜像仓库进行了同步与备份，国内用户下载镜像的安装体验会更加友好。关于最新的 v3.3.0 安装与升级指南，可参考 [KubeSphere 官方文档](https://kubesphere.io/zh/docs/v3.3/)。

## 致谢

以下是参与 KubeSphere 3.3.0 代码、文档等贡献的贡献者 GitHub ID，若此名单有遗漏请您与我们联系，排名不分先后。

![](https://pek3b.qingstor.com/kubesphere-community/images/202206261749070.png)

相较于上个版本，v3.3.0 的贡献者数量增长了 50%，这也说明参与 KubeSphere 开源贡献的人越来越多了。新的贡献者，都将获得社区的专属证书，后续我们会在社区统一发放。

社区十分感谢各位贡献者的参与，也欢迎有越来越多的小伙伴加入此行列，不管是代码开发、文档优化，还是网站优化、社区宣传和技术布道，KubeSphere 社区的大门永远向您敞开！