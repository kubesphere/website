---
title: 'KubeSphere 3.4.0 发布：支持 K8s v1.26'
tag: '产品动态'
keyword: '社区, 开源, 贡献, KubeSphere, release, AI, GPU'
description: 'KubeSphere 3.4.0 已正式上线，该版本带来了值得大家关注的新功能以及增强：扩大对 Kubernetes 的支持范围，最新稳定性支持 1.26；重构告警策略架构，解耦为告警规则与规则组；提升集群别名展示权重，减少原集群名称不可修改导致的管理问题；升级 KubeEdge 组件到 v1.13 等。'
createTime: '2023-07-28'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere-3.4.0-GA.png'
---

2023 年 07 月 26 日，KubeSphere 开源社区激动地向大家宣布，KubeSphere 3.4.0 正式发布！

让我们先简单回顾下之前三个大版本的主要变化：
- KubeSphere 3.1.0 新增了“边缘计算”、“计量计费” 等功能，将 Kubernetes 从云端扩展至边缘；
- KubeSphere 3.2.0 新增了对 “GPU 资源调度管理” 与 GPU 使用监控的支持，进一步增强了在云原生 AI 场景的使用体验；
- KubeSphere 3.3.0 新增了基于 GitOps 的持续部署方案，进一步优化了 DevOps 的使用体验。

KubeSphere 3.4.0 已正式上线，该版本带来了值得大家关注的新功能以及增强：扩大对 Kubernetes 的支持范围，最新稳定性支持 1.26；重构告警策略架构，解耦为告警规则与规则组；提升集群别名展示权重，减少原集群名称不可修改导致的管理问题；升级 KubeEdge 组件到 v1.13 等。同时，还进行了多项修复、优化和增强，更进一步完善交互设计，并全面提升了用户体验。

在此，十分感谢该版本的所有参与者和贡献者，文末我们将列出各位贡献者的 ID，以表谢意！

## 主要更新

### 优化告警配置

KubeSphere 3.4.0 优化告警配置，添加了不同范围的告警规则组：

- 原单个告警策略拆分为多个规则组，通过规则组配置告警最小执行单元
- 支持内置告警规则编辑、禁用与重置


![](https://pek3b.qingstor.com/kubesphere-community/images/rulegroup-1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/rulegroup-2.png)

### 提升集群别名展示权重

运维人员往往需要通过定义集群名称，来对不同定位、不同地理位置的集群进行管理。在之前的版本中，集群仅支持被纳管时进行名称定义，这无疑给运维人员带来了比较大的操作困扰。

针对这个问题，KubeSphere 3.4.0 做出了相应的改动，提升了集群别名展示的权重，实现集群别名与名称同级别管理，帮助用户通过别名即可完成所有原来对名称的操作，也可通过对别名修改实现集群的灵活管理。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4-cluster-alias.png)

### 支持设置默认镜像仓库

在私有环境下需要将默认 dockerhub 统一替换成私有仓库，在之前的版本中，不支持指定默认仓库，只能进行手动选择。如果存在多个私有仓库，用户在操作时容易忽略导致操作错误。

在 KubeSphere 3.4.0 中，我们支持了设置默认的镜像仓库，让用户操作更加简单方便。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4-image-repo-1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4-image-repo-2.png)

### 其他优化和增强

除上述几个主要功能外，KubeSphere 3.4.0 还有很多优化和增强：

- 支持 Kubernetes v1.26
- 升级 KubeEdge 组件到 v1.13
- 默认使用 OpenSearch v2.6.0 作为内部日志存储，不再默认将 Elasticsearch 作为内部日志存储
- 支持 pod grace period 配置
- 将 Notification Manager 版本升级到 v2.3.0
- 将 go 版本升级到 v1.19
- 优化多分支流水线的用户体验
- 修复 helm repo 分页查询错误
- 修复网关升级验证错误
- 修复集群网关日志和资源状态显示异常

更多更新详情请查看 [release note](https://github.com/kubesphere/kubesphere/releases/tag/v3.4.0)。

## 安装和升级

KubeSphere 已将 v3.4.0 所有镜像在国内镜像仓库进行了同步与备份，国内用户下载镜像的安装体验会更加友好。

各位社区小伙伴在安装使用后，如果发现有任何 bug，欢迎提交 [Issue](https://github.com/kubesphere/kubesphere/issues)。

## 致谢

以下是该版本中做出贡献的贡献者，感谢大家！

* leoendless
* yazhouio
* Bettygogo2021
* weili520
* harrisonliu5
* junotx
* smartcat999
* wansir
* imjoey
* sekfung
* renyunkang
* Fritzmomoto
* snowgo
* hongzhouzi
* chuan-you
* zhou1203
* iawia002
* sologgfun
* testwill
* LQBing
* littlejiancc
* wenchajun

社区在[社区双周报](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg4NTU0MzEyMg==&action=getalbum&album_id=2726621770862329858#wechat_redirect)中会为新的贡献者发放证书，也会在论坛[证书墙](https://ask.kubesphere.io/forum/d/9280-kubesphere)中及时更新。如有遗漏，请联系我们补发。