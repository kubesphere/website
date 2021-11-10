---
title: 'KubeSphere 3.2.0 发布：带来面向 AI 场景的 GPU 调度与更灵活的网关'
tag: 'KubeSphere,release'
keyword: '社区, 开源, 贡献, KubeSphere, release, AI, GPU'
description: 'KubeSphere 3.2.0 新增了对“GPU 资源调度管理”与 GPU 使用监控的支持，进一步增强了在云原生 AI 场景的使用体验。同时还增强了“多集群管理、多租户管理、可观测性、DevOps、应用商店、微服务治理”等特性，更进一步完善交互设计，并全面提升了用户体验。'
createTime: '2021-11-03'
author: 'KubeSphere'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/v3.2.0-GA-cover.png'
---

![](https://pek3b.qingstor.com/kubesphere-community/images/3.2.0GA.png)

现如今最热门的服务器端技术是什么？答案大概就是**云原生**！KubeSphere 作为一个以 Kubernetes 为内核的云原生分布式操作系统，也是这如火如荼的云原生热潮中的一份子。KubeSphere 持续秉承 100% 开源的承诺，借助于开源社区的力量，迅速走向全球。

2021 年 11 月 3 日，KubeSphere 开源社区激动地向大家宣布，KubeSphere 3.2.0 正式发布！

6 个月前，KubeSphere 3.1.0 带着 **“边缘计算”**、**“计量计费”** 等功能，将 Kubernetes 从云端扩展至边缘，更进一步完善交互设计提升了用户体验。3 个月前，KubeSphere 又发布了 v3.1.1，在部署 KubeSphere 时可以指定 Kubernetes 集群中已有的 Prometheus。

今天，KubeSphere 3.2.0 带来了更多令人期待的功能，新增了对 **“GPU 资源调度管理”** 与 GPU 使用监控的支持，进一步增强了在云原生 AI 场景的使用体验。同时还增强了 **“多集群管理、多租户管理、可观测性、DevOps、应用商店、微服务治理”** 等特性，更进一步完善交互设计，并全面提升了用户体验。

并且，v3.2.0 得到了来自青云科技之外的更多企业与用户的贡献和参与，无论是功能开发、功能测试、缺陷报告、需求建议、企业最佳实践，还是提供 Bug 修复、国际化翻译、文档贡献，这些来自开源社区的贡献都为 v3.2.0 的发布和推广提供了极大的帮助，我们将在文末予以特别致谢！

## 解读 KubeSphere 3.2.0 重大更新

### GPU 调度与配额管理

当前随着人工智能机器学习等领域技术的快速发展，市场上涌现了越来越多 AI 公司对服务器集群中 GPU 资源调度管理的需求，其中监控 GPU 使用情况以及 GPU 资源配额管理等需求在社区的呼声很高，在 KubeSphere 中文论坛收到了[很多 GPU 相关的需求](https://kubesphere.com.cn/forum/?q=gpu "很多 GPU 相关的需求")，KubeSphere 本身是一直支持 GPU 的，现在在 v3.2.0 中会将 GPU 的管理变得更易用。

KubeSphere 3.2.0 支持可视化创建 GPU 工作负载，支持调度 GPU 资源的任务，同时还支持对 GPU 资源进行租户级配额管理，可对接 Nvidia GPU 或 vGPU 等方案。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111011325039.png)

### 增强可观测性

随着容器和微服务技术的日益流行，系统之间的调用关系将会越来越复杂，系统中运行的进程数量也会暴增。成千上万个进程跑在分布式系统中，使用传统的监控技术很难追踪这些进程之间的依赖关系和调用路径，这时系统内部的可观测性就显得尤为重要。

**可观测性是指通过检测一个系统的输出来测量其内部状态的能力**。如果一个系统的当前状态只能通过输出的信息，即**遥测数据**来估计，那么这个系统就被认为是 "可观测的"。可观测性的三板斧包括 Logging、Tracing 和 Metrics，通过这三板斧收集的数据统称为遥测数据。

1. 更强大的自定义监控面板

KubeSphere 自 v3.1.0 开始便添加了集群层级的自定义监控，可以选择默认模板、上传模板或自定义模板来生成自定义监控面板。KubeSphere 3.2.0 的默认模板加入了对 `Grafana` 的支持，可以通过指定监控面板 URL 或上传 Grafana 监控面板 JSON 文件来导入 Grafana 监控面板，KubeSphere 会自动将 Grafana 监控面板转换为 KubeSphere 的监控面板。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111031339897.png)

针对 GPU 资源也提供了默认的监控模板，并提供了默认指标，减少了用户自定义创建模板编写 YAML 的配置成本。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111031336533.png)

2. 告警通知与日志

- 支持通过 HTTPS 与 Elasticsearch 组件通信。

- 继 KubeSphere 3.1 支持邮件、钉钉、企业微信、Webhook 和 Slack 等多通知渠道后，3.2.0 新增支持了对告警通知渠道的配置进行测试验证。

  ![](https://pek3b.qingstor.com/kubesphere-community/images/202111011347330.png)

3. ETCD 监控面板支持自动为 ETCD Leader 打上 `Leader` 标签。

### 多云与多集群管理

随着 Kubernetes 在企业中的应用越来越广泛，CNCF 在 2020 年的用户调研中显示有将近 80% 的用户在生产环境运行 2 个以上 Kubernetes 集群。KubeSphere 旨在解决多集群和多云管理的难题，为用户提供统一的控制平面，将应用程序及其副本跨公有云和本地环境分发到多个集群。KubeSphere 还拥有跨集群的可观测性，包括多集群维度的监控、日志、事件和审计日志等。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111031148924.png)

KubeSphere 3.2.0 在跨集群调度层面更进一步，创建跨集群的联邦部署（federatedDeployment） 时，KubeSphere 不仅支持将业务按不同副本数量调度到多个集群，还支持在其详情页指定在多个集群分发的副本总数，以及指定该业务的副本分发到多个集群的任意权重。当用户想要灵活扩展部署并且要将其多副本按不同比例灵活分发到多个集群时，这个功能会非常有用。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111031144251.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202111031147569.png)

### 运维友好的存储管理

持久化存储是企业在生产环境中运行 Kubernetes 最需要关注的能力，稳定可靠的存储为企业的核心数据保驾护航。KubeSphere 3.2.0 的 Console 界面新增了**存储卷管理**功能，管理员可以在**存储类型**（StorageClass）下配置是否允许用户对存储卷进行**克隆**、**快照**和**扩展**等功能，为有状态应用提供更方便的持久化存储运维。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111021538169.png)

默认情况下，立即绑定 (Immediate) 模式不利于受拓扑结构限制的存储后端，可能会导致 Pod 无法调度。v3.2.0 新增了**延迟绑定** (WaitForFirstConsumer) 模式，该模式可以保证直到 Pod 被调度时才绑定 PVC 和 PV，这样就可以根据 Pod 资源等请求来合理调度。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111021542049.png)

此前 KubeSphere Console 只支持管理存储卷（PVC），不支持对**存储实例**（PV）资源进行管理。这个功能在 KubeSphere 3.2.0 得以实现，现在用户可以在 Console 界面查看 PV 信息，并对其进行编辑和删除。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111021555864.png)

用户创建存储卷快照时也可以指定快照类型，即指定 `VolumeSnapshotClass`，这样就可以指定存储后端来创建快照。

### 支持集群级别的网关

在 KubeSphere 3.1 中只支持项目级别的网关，如果用户的项目过多，势必会造成资源的浪费。而且不同的企业空间中的网关都是相互独立的。

KubeSphere 3.2.0 开始支持集群级别的全局网关，所有项目可共用同一个网关，之前已创建的项目网关也不会受到集群网关的影响。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111021611634.png)

也可以统一纳管所有项目的网关，对其进行集中管理和配置，管理员用户再也不需要切换到不同的企业空间中去配置网关了。由于 K8s 生态中有非常多的 Ingress Controller 可作为网关方案，KubeSphere 3.2.0 将网关后端进行重构后，现在社区任意支持 `v1\ingress` 的 Ingress Controller 都可作为网关方案灵活对接 KubeSphere。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111021612464.png)

### 认证与授权

统一的身份管理和完备的鉴权体系，是多租户系统中实现逻辑隔离不可或缺的能力。除了可对接 AD/LDAP、OAuth2 等身份认证系统，KubeSphere 3.2.0 还内置了基于 `OpenID Connect` 的认证服务，可以为其他组件提供身份认证能力。`OpenID Connect` 是一个基于 OAuth 2.0 规范的用户身份认证协议，它足够简单，但同时也提供了大量的功能和安全选项以满足企业级业务需求。

### 面向合作伙伴开放的应用商店

应用商店与应用全生命周期管理是 KubeSphere 独有的特色，KubeSphere 基于自研并开源的 [OpenPitrix](https://github.com/openpitrix/openpitrix "OpenPitrix") 实现了这两大特性。

KubeSphere 3.2.0 新增了 **“动态加载应用商店”** 的功能，合作伙伴可申请将应用的 Helm Chart 集成到 KubeSphere 应用商店，相关的 Pull Request 被合并后，KubeSphere 应用商店即可动态加载应用，不再受到 KubeSphere 版本的限制。KubeSphere 应用商店内置的 Chart 地址为：[https://github.com/kubesphere/helm-charts](https://github.com/kubesphere/helm-charts "https://github.com/kubesphere/helm-charts")，欢迎社区合作伙伴来提交 Helm 应用，比如 Nocalhost 和 Chaos Mesh 已经通过这种方式将 Helm Chart 集成到了 KubeSphere 3.2.0，方便用户一键部署应用至 Kubernetes。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111031129842.png)

### KubeSphere DevOps 更加独立

KubeSphere DevOps 从 v3.2.0 开始，已经逐步发展为独立的项目 [ks-devops](https://github.com/kubesphere/ks-devops "ks-devops")，最终用户可以自由选择任意的 Kubernertes 作为运行环境。目前，ks-devops 的后端部分已经可以通过 Helm Chart 来安装。

Jenkins 作为一款用户基数极大、生态丰富的 CI 引擎，我们会让 Jenkins 真正地“扮演”引擎的角色——退入幕后持续为大家提供稳定的流水线功能。本次新增 CRD PipelineRun 来封装流水线的执行记录，减少了大量和 Jenkins 直接交互的 API，提升 CI 流水线的性能。

从 v3.2.0 开始，KubeSphere DevOps 新增支持在基于 containerd 的流水线中构建镜像。未来 KubeSphere DevOps 将作为独立项目，支持前后端独立部署并引入 Tekton 与 ArgoCD 等 GitOps 工具，还将集成项目管理与测试管理平台。

### 集群部署更灵活

对于自建 K8s 集群和已有 K8s 集群的用户，KubeSphere 为用户分别提供 KubeKey 和 ks-installer 两种部署方式。

[KubeKey](https://github.com/kubesphere/kubekey "KubeKey") 是 KubeSphere 社区开源的一款高效集群部署工具，运行时默认使用 Docker , 也可对接 `Containerd` `CRI-O` `iSula` 等 CRI 运行时，且 ETCD 集群独立运行，支持与 K8s 分离部署，提高环境部署灵活性。

如果您使用 KubeKey 部署 Kubernetes 与 KubeSphere，以下特性也值得关注：

- 支持到 Kubernetes 最新版本 v1.22.1，并向下兼容 4 个版本，同时 KubeKey 也新增支持部署 K3s 的实验性功能。
- 支持 Kubernetes 集群证书自动更新
- 支持 Internal LoadBalancer 高可用部署模式，降低集群部署复杂度
- 大部分集成的组件如 Istio、Jaeger、Prometheus Operator、Fluent Bit、KubeEdge、Nginx ingress controller 都已更新至上游较新版本，详见 Release Notes 3.2.0

## 用户体验

SIG Docs 成员也对 Console 界面的中英文文案进行了全面的重构与优化，使界面文案和术语介绍更加专业准确。并删除了前端的硬编码和串联的 UI 字符串，以更好地支持 Console 界面的本地化和国际化。

此外，KubeSphere 社区有多位深度用户参与了对前端的部分功能进行了增强，例如新增支持了对 Harbor 镜像仓库的镜像搜索、添加了对挂载存储卷到 init container 的支持、去除存储卷扩展时工作负载自动重启等特性。

参考 [Release Notes 3.2.0](https://github.com/kubesphere/kubesphere/releases/tag/v3.2.0) 了解更多的用户体验优化、功能增强以及 Bug 修复。可通过官方文档两条命令在线安装下载 KubeSphere 3.2.0，离线安装也将在一周左右在社区提供下载。

## 致谢

以下是参与 KubeSphere 3.2.0 代码与文档贡献的贡献者 GitHub ID，若此名单有遗漏请您与我们联系，排名不分先后。

![](https://pek3b.qingstor.com/kubesphere-community/images/v3.2.0-contributors.png)
