---
title: 'KubeSphere 3.1.0 GA：混合多云走向边缘，让应用无处不在'
tag: '产品动态'
keyword: '社区, 开源, 贡献, KubeSphere, release'
description: 'KubeSphere v3.1.0 主打“延伸至边缘侧的容器混合云”，新增了对“边缘计算”场景的支持。同时在 v3.0.0 的基础上新增了计量计费，让基础设施的运营成本更清晰，并进一步优化了在“多云、多集群、多团队、多租户”等应用场景下的使用体验，增强了“多集群管理、多租户管理、可观测性、DevOps、应用商店、微服务治理”等特性，更进一步完善交互设计提升了用户体验。'
createTime: '2021-04-29'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/ks3.1.png'
---

![](https://pek3b.qingstor.com/kubesphere-community/images/3.1.0GA.png)

2021 年 4 月 29 日，KubeSphere 开源社区激动地向大家宣布，KubeSphere 3.1.0 正式发布！为了帮助企业最大化资源利用效率，KubeSphere 打造了一个以 Kubernetes 为内核的云原生分布式操作系统，提供可插拔的开放式架构，无缝对接第三方应用，极大地降低了企业用户的使用门槛。

KubeSphere v3.1.0 主打 **“延伸至边缘侧的容器混合云”**，新增了对 **“边缘计算”** 场景的支持。同时在 v3.0.0 的基础上新增了 **计量计费**，让基础设施的运营成本更清晰，并进一步优化了在 **“多云、多集群、多团队、多租户”** 等应用场景下的使用体验，增强了 **“多集群管理、多租户管理、可观测性、DevOps、应用商店、微服务治理”** 等特性，更进一步完善交互设计提升了用户体验。

云原生产业联盟撰写的《云原生发展白皮书》提到，万物互联时代加速了云-边协同的需求演进，传统云计算中心集中存储、计算的模式已经无法满足终端设备对于时效、容量、算力的需求，向边缘下沉并通过中心进行统一交付、运维、管控，已经成为云计算的重要发展趋势。

面对这一发展趋势，KubeSphere 与 KubeEdge 社区紧密合作，将 Kubernetes 从云端扩展至边缘，以统一的标准实现了对边缘基础设施的纳管。通过与 KubeEdge 集成，解决了边缘节点纳管、边缘工作负载调度和边缘可观测性等难题，结合 KubeSphere 已有的多集群管理将混合多云管理延伸至边缘侧。

并且，v3.1.0 得到了来自青云 QingCloud 之外的更多企业与用户的贡献和参与，无论是功能开发、功能测试、缺陷报告、需求建议、企业最佳实践，还是提供 Bug 修复、国际化翻译、文档贡献，这些来自开源社区的贡献都为 v3.1.0 的发布和推广提供了极大的帮助，我们将在文末予以特别致谢！

## 解读 v3.1.0 重大更新

KubeSphere 3.1.0 增加了计量计费功能，支持集群、企业空间的多层级与多租户在应用资源消耗的计量与统计。通过集成 KubeEdge，实现应用快速分发至边缘节点。同时还提供了更强大的可观测性能力，如兼容 PromQL、内置主流告警规则、可视化对接钉钉、企业微信、Slack 和 Webhook 等通知渠道。DevOps 的易用性在 3.1.0 也上了一个台阶，例如内置多套常用流水线模板，支持多分支流水线和流水线复制等，关于重大更新详情请查看文末海报。

## 多维度计量计费，让 K8s 运营成本更透明

在企业运营和管理 Kubernetes 容器平台时，通常需要分析资源消耗，查看集群及其中租户的消费账单，洞察资源使用情况，分析基础设施运营成本。

在 KubeSphere 3.1.0 中，可从多个维度来分析平台资源消耗：

- 从集群维度，可查看每个集群资源消耗，深入到节点中分析运行的工作负载，精准规划每个节点中工作负载的资源使用状况。
- 从企业空间维度，可查看每个企业空间资源消耗，获取企业空间中项目、应用、工作负载的消费账单，分析多租户环境中各个租户的资源使用是否合理。

另外，除了可以通过界面查看和导出数据，KubeSphere 计量计费平台也提供了所有操作的 API。接下来在后续的版本里，会持续加强并构筑端到端完整的计量计费可运营系统。

![计量计费](https://pek3b.qingstor.com/kubesphere-community/images/metering.png)

![计量计费](https://pek3b.qingstor.com/kubesphere-community/images/metering1.png)

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=802751933&bvid=BV17y4y1s7Nj&cid=330926724&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 边缘节点管理

[KubeEdge](https://github.com/kubeedge/kubeedge) 是一个开源的边缘计算平台，它在 Kubernetes 原生的容器编排和调度能力之上，实现了 **云边协同**、**计算下沉**、**海量边缘设备管理**、**边缘自治** 等能力。但 KubeEdge 缺少云端控制层面的支持，如果将 KubeSphere 与 KubeEdge 相结合，可以很好解决这一问题，实现应用与工作负载在云端与边缘节点进行统一分发与管理。

这一设想在 v3.1.0 中得以实现，KubeSphere 现已支持 KubeEdge 边缘节点纳管、KubeEdge 云端组件的安装部署、以及边缘节点的日志和监控数据采集与展示。结合 KubeEdge 的边缘自治功能和 KubeSphere 的多云与多集群管理功能，可以实现云-边-端一体化管控，解决在海量边、端设备上统一完成应用交付、运维、管控的需求。

![边缘节点](https://pek3b.qingstor.com/kubesphere-community/images/edge.png)

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=587836535&bvid=BV1zB4y1c7oK&cid=330894124&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>


## 强化微服务治理能力

KubeSphere 基于 [Istio](https://github.com/istio/istio) 提供了金丝雀发布、蓝绿部署、熔断等流量治理功能，同时还支持可视化呈现微服务之间的拓扑关系，并提供细粒度的监控数据。在分布式链路追踪方面，KubeSphere 基于 Jaeger 让用户快速追踪微服务之间的通讯情况，从而更易于了解微服务的请求延迟、性能瓶颈、序列化和并行调用等。

KubeSphere 3.1.0 对微服务治理功能进行了强化，将 Istio 升级到了 1.6.10，支持图形化流量方向检测，图像化方式显示应用流量的流入/流出。同时还支持对 Nginx Ingress Gateway 进行监控，新增 Nginx Ingress Controller 的监控指标。

![流量治理](https://pek3b.qingstor.com/kubesphere-community/images/Nginx.png)

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=205276967&bvid=BV19h411278Q&cid=330927392&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 多云与多集群管理

虽然 KubeSphere 3.0.0 带来的多云与多集群管理提供了面向多个 Kubernetes 集群的中央控制面板，实现了应用跨云和跨集群的部署与运维，但 member 集群管理服务依赖 Redis、OpenLDAP、Prometheus 等组件，不适合轻量化部署。KubeSphere 3.1.0 移除了这些依赖组件，使 member 集群管理服务更加轻量化，并重构了集群控制器，支持以高可用方式运行 Tower 代理服务。

![多集群管理](https://pek3b.qingstor.com/kubesphere-community/images/cluster.png)

## 更强大的可观测性

可观测性是容器云平台非常关键的一环，狭义上主要包含监控、日志和追踪等，广义上还包括告警、事件、审计等。3.1.0 除了对已有的监控、日志、告警等功能进行优化升级，还新增了更多新特性。

+ 监控：支持图形化方式配置 `ServiceMonitor`，添加集群层级的自定义监控，同时还实现了类似于 Grafana 的 PromQL 语法高亮。
+ 告警：在 v3.1.0 进行了架构调整，不再使用 MySQL、Redis 和 etcd 等组件以及旧版告警规则格式，改为使用 Thanos Ruler 配合 Prometheus 内置告警规则进行告警管理，兼容 Prometheus 告警规则。
+ 通知管理：完成架构调整，与自研 Notification Manager v1.0.0 的全面集成，实现了以图形化界面的方式对接邮件、钉钉、企业微信、Slack、Webhook 等通知渠道。
+ 日志：新增了对 Loki 的支持，可以将日志输出到 [Loki](https://github.com/kubesphere/fluentbit-operator/blob/master/docs/plugins/output/loki.md)。还新增了对 kubelet/docker/containerd 的日志收集。

![集群状态监控](https://pek3b.qingstor.com/kubesphere-community/images/clustermonitor.png)

![告警策略](https://pek3b.qingstor.com/kubesphere-community/images/alerting.png)

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=802847503&bvid=BV1iy4y1s7Vz&cid=330928839&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 更易用的 DevOps

KubeSphere 3.1.0 新增了 GitLab 多分支流水线和流水线克隆等功能，并内置了常用的流水线模板，帮助 DevOps 工程师提升 CI/CD 流水线的创建与运维效率。大部分场景下可基于流水线模板进行修改，不再需要从头开始创建，实现了真正的开箱即用。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=845263571&bvid=BV1J54y1j7ev&cid=330928243&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=545285342&bvid=BV12q4y1E7qx&cid=330927777&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 灵活可插拔的集群安装工具
KubeKey 不仅支持 Kubernetes 1.17 ~ 1.20 在 AMD 64 与 ARM 64 的安装，还支持了 K3s。并且，Kubekey 还新增支持 Cilium、Kube-OVN 等网络插件。鉴于 Dockershim 在 K8s 1.20 中被废弃，Kubekey 可用于部署 containerd、CRI-O、iSula 等容器运行时，让用户按需快速创建集群。

## 运维友好的网络管理

KubeSphere 将 IaaS 云平台强大的网络能力继承到容器云平台，让用户在 Kubernetes 之上获得与 IaaS 一样稳定、安全和易用的网络使用体验。v3.1.0 新增了网络可视化拓扑图，你可以通过拓扑图洞悉各个服务之间的网络调用关系。

鉴于 Calico 是目前最常用的 Kubernetes CNI 插件之一，v3.1.0 现已支持 Calico IP 池管理，也可以为 Deployment 指定静态 IP。此外，v3.1.0 还新增了对 [Kube-OVN](https://github.com/kubeovn/kube-ovn) 插件的支持。

## 认证鉴权与多租户

统一的身份管理和完备的鉴权体系，是多租户系统中实现逻辑隔离不可或缺的能力。KubeSphere 基于 Kubernetes 的角色访问控制（RBAC），提供了细粒度的权限控制能力，在支持 Namespace 层级资源隔离的同时通过 Workspace 进一步对租户进行了定义，多层级的权限管控更加契合企业用户的使用场景。

v3.1.0 中新增了组织架构管理功能，可以通过用户组简化批量授权操作。除此之外还支持了企业空间的资源配额管理，实现对资源用量的管控，进一步满足企业用户的实际需求。

统一认证方面，v3.1.0 中简化了身份提供商（IdentityProvider, IdP）的配置方式，除 LDAP 之外新增了对 CAS（Central Authentication Service）、OIDC（OpenID Connect）、OAuth2 等通用认证协议的支持，并提供了插件化的拓展方式，以便不同账户系统之间的集成。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=802754514&bvid=BV1jy4y1s7i3&cid=331412102&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=972796031&bvid=BV1qp4y1b7Jz&cid=331391855&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 完全开源：社区化与国际化

借助于开源社区的力量，KubeSphere 迅速走向全球，目前 KubeSphere 在全球的 90 多个国家和地区有超过 10w 下载量。v3.1.0 Console 支持中、英、繁中和西班牙语，KubeSphere 未来将进一步拓展海外市场。

KubeSphere 3.1.0 将继续秉承 100% 开源的承诺，3.0.0 版本带来的诸多新功能也早已在 GitHub 开源，例如 [Porter](https://github.com/kubesphere/porterlb)、[OpenPitrix](https://github.com/openpitrix/openpitrix)、[Fluentbit Operator](https://github.com/kubesphere/fluentbit-operator)、 [KubeKey](https://github.com/kubesphere/kubekey)、[KubeEye](https://github.com/kubesphere/kubeeye)、[Notification Manager](https://github.com/kubesphere/notification-manager)、[Kube-Events](https://github.com/kubesphere/kube-events)，还开源了一套前端组件库 [Kube Design](https://github.com/kubesphere/kube-design)，这些新特性的代码与设计文档在 [GitHub](https://github.com/kubesphere) 相关仓库都可以找到，欢迎大家在 GitHub 给我们 Star + Fork + PR 三连。

## 3.1.0 重要更新一览
![](https://pek3b.qingstor.com/kubesphere-community/images/NotableChangesinkubesphere3.1.png)

## 安装升级

KubeSphere 已将 v3.1.0 所有镜像在国内镜像仓库进行了同步与备份，国内用户下载镜像的安装体验会更加友好。关于最新的 v3.1.0 安装与升级指南，可参考 [KubeSphere 官方文档](https://kubesphere.io/docs)。 

## 致谢

以下为 KubeSphere 3.1.0 主要仓库贡献者的 GitHub ID，排名不分先后：

![致谢](https://pek3b.qingstor.com/kubesphere-community/images/acknowledgement.png)





