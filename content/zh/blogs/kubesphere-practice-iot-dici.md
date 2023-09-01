---
title: '某物联网数智化园区行业基于 KubeSphere 的云原生实践'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, DevOps'
description: '本文描写了某物联网数智化园区行业使用 KubeSphere 做的云原生实践经验。'
createTime: '2023-08-31'
author: '小布'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-practice-iot-dici-cover.png'
---

## 公司简介

![](https://pek3b.qingstor.com/kubesphere-community/images/0-20230831.png)

作为物联网 + 数智化园区一体化解决方案提供商，我们致力于为大中型园区、停车场提供软硬件平台，帮助园区运营者实现数字化、智能化运营。

在使用 K8s 之前我们使用传统的方式部署上线，使用 spug（一款轻量级无 Agent 的自动化运维平台） 自动化在单节点完成代码部署上线，也没有进行容器化，随着产品上线提上日程，对稳定性要求提高，以及私有化部署环境管理问题，我们开始使用 Docker 以及 K8s。

## 背景介绍

降本增效是每个企业的目标，而 DevOps、容器化、云原生就是研发团队降本增效的方法论。在这个趋势下，使用 Docker、K8s 几乎是每个开发团队的必经之路。

物联网平台对稳定性要求非常高，一旦停机，所有设备都将掉线重连，因此保证服务的稳定性，减少停机时间就非常重要。

在使用 K8s 之前，我们很多时间都要人工处理各种繁琐重复的服务维护问题，这种枯燥且毫无技术含量琐碎极大的消磨开发团队的激情。为了将人力从大量重复的环境配置、服务维护中解放出来从而提高开发迭代效率，我们就决定全面容器化，拥抱云原生。

总结来说就是：

- 服务稳定性，自动化运维，减少停机时间；
- 分布式部署，弹性伸缩；
- DevOps 规范的部署上线流程。

这些问题迫使我们开始调研容器化、Docker、K8s 的应用。

## 选型说明

由于没有相关经验，因此一开始我们就希望找到一款能够帮助快速上手 K8s 的工具，在调研 KubeSphere、Zadig、Rancher、KubeVela、Kubeadm 等多款工具后，我们最终选择了 KubeSphere。

选择 KubeSphere 最主要的原因首先是它的社区活跃，有问题能够找到解决方案。同时它集成了很多开箱即用的插件如 DevOps，这正是我们所需要的。当然第一眼就选中 KubeSphere 还是因为它的颜值，能看得出来 KubeSphere 的 UI 是经过精心设计过的，这在开发工具领域中是极为难得的，从这点上就能够看出背后的开发团队对于打造一款基于 K8s 的云原生操作系统的理念与决心。

使用 KubeSphere 让我们立马就拥有了成熟 DevOps 工作流了，而无需额外的搭建成本，这对于我们毫无 K8s 经验的团队来说太重要了，极大的降低了上手门槛。

目前我们将所有无状态应用全部容器化，使用 K8s 负载，提交代码 Webhook 触发 KubeSphere 流水线自动发布，对于不习惯命令行操作的用户，KubeSphere 后台能满足所有需求。

## 实践过程

### 容器化及迁移到 K8s、KubeSphere

![](https://pek3b.qingstor.com/kubesphere-community/images/1-20230831.png)

第一步就是将应用全部 Docker 容器化，然后使用 K8s 的 deployment 进行部署。实现分布式高可用的服务部署。

K8s 让我们轻易的就拥有了一个分布式高可靠的架构了，分布式部署从未如此简单。

#### 创建 DevOps 项目流水线

KubeSphere 的 DevOps 项目不同于常规项目，这是 KubeSphere 中独有的概念，和 K8s 的命名空间没关系，流水线可以直接用 Jenkinsfile，也可以用可视化的方式创建，非常方便。

配置好发布流水线后，对于开发来说只用提交代码就行了，KubeSphere 会自动帮我们按照预期把应用部署到集群中，上线前的最后一公里问题被彻底解决了。

![](http://pek3b.qingstor.com/kubesphere-community/images/2-20230831.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/3-20230831.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/4-20230831.png)

#### 管理 Pod

![](https://pek3b.qingstor.com/kubesphere-community/images/5-20230831.png)

在 KubeSphere 后台可以直接管理 Pod ，容器信息一目了然，还可以直接进入容器，查看容器实时日志。负载也能一键伸缩，轻点鼠标就能够快速部署和回滚。

![](https://pek3b.qingstor.com/kubesphere-community/images/6-20230831.png)

### 日志和监控方案

![](https://pek3b.qingstor.com/kubesphere-community/images/7-20230831.png)

由于我们之前就有了 ELK 和 Prometheus、Grafana 了，因此日志我们只需要将容器内的应用日志采集到集中的 ELK 上去就可以了。监控也是如此，只需要采集 node_exporter 和业务指标就行了。

如果之前没有相关方案，也可以直接使用 KubeSphere 开箱即用的日志监控方案，同样也是基于 Elasticsearch 和 Prometheus 的。

### 多租户资源可视化

企业空间完美契合了多租户管理，这样对于私有化部署、资源利用统计都非常方便，同时企业空间下的项目 刚好就对应 K8s 中的命名空间，这让人非常惊喜，KubeSphere 是紧贴 K8s 标准的，不会增加任何学习使用成本。

集群状态和资源用量排行可以直观看到各节点资源使用情况，方便为未来资源预算做好规划。还可以对企业空间进行配额限制，满足了不同租户资源控制需求。

![](https://pek3b.qingstor.com/kubesphere-community/images/8-20230831.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/9-20230831.png)

### 存储

![](https://pek3b.qingstor.com/kubesphere-community/images/10-20230831.png)

由于我们目前主要是无状态应用，对储存要求不高，所以用的是最简单的方案集中式 NFS，由于是单节点存储，所以存在单点问题，这个后面可以使用云厂商的 NAS 存储或者其它分布式存储。

### 使用过程中遇到的困难及其解决方案

1. CI 构建节点配置问题

节点配置至少在 4C·16G ，否则 DevOps Jenkins 可能无法正常运行，这个还是有些占资源的，建议 使用特定节点充当 CI 节点：为依赖项缓存设置 CI 节点

2. 流水线不响应问题

有时会出现流水线一直等待运行，或者卡住的问题，这通常是构建节点资源问题，我们遇到过前端 node 打包 cpu 占满问题，出现这种情况时应该首先检查打包节点的资源情况，kill 掉占用高的打包进程就行了。或尝试重新创建 DevOps-jenkins 负载通常能够解决问题。有时还需要进入 Jenkins 后台查看问题（密码与 KubeSphere 后台密码相同）。

3. 构建缓存问题

由于 git 缓存问题，所以我们将 `jenkins-casc-config.yaml` 中定义的 Agent 配置 `idleMinutes` 改为一个较大的值，以实现打包 Pod 在构建后不会被删除。

之所以只能这样，是因为 `base-n8qkj` 的卷 `workspace-volume`，卷类型是 EmptyDir 临时的，如果是 HostPath 类型的就好了，这点不知道官方是怎么考虑的。

4. configmap 更新问题

在 K8s 中 configmap 的更新会自动生效，并同步到各个挂载了 volumes configMap 的 Pod 上去，这样就可以实现配置更新后自动生效而不用重新发布应用。

但是在使用中我们发现存在一个问题，这种生效机制是通过软连接实现的（改变软连接指向，删除旧的文件），而某些应用可能会出现在更新配置时，短暂的找不到文件报错的问题（phpfpm），所以针对这个情况我们额外做了处理，原理是应用不直接挂载 configMap 了，而是通过另一个容器去挂载 configMap 并处理好稳定的文件后再供目标应用使用。

![](https://pek3b.qingstor.com/kubesphere-community/images/11-20230831.png)

## 使用效果

使用 KubeSphere 后我们几乎就没再关注过服务是否在线等运维的琐碎事情了，因为 K8s 会保证一切按照预期进行，这使得我们的迭代发布速度大大提高，开发要做的只是提交代码，其它的一切都不用操心，极大的提高了开发编码的幸福度和对保障服务稳定的信心。

- 无状态应用分布式部署，弹性伸缩；
- 自动发布，自动化运维，故障自愈；
- 一次构建到处运行，无惧环境搭建。

## 未来规划

由于还在逐步学习应用中，目前对 K8s 的应用场景还比较简单，未来还有很多探索的点，如：

- 存储上，目前为了解决 web 无状态应用 可能也会有临时文件上传等需求，使用了 NFS 存储，这样多节点 Pod 可以共享存储，后面可以尝试使用其它更为可靠的分布式存储。
- 应用上，目前主要是将无状态应用部署了上来，随着学习的深入，后面可以将更多的有状态应用也部署上来。

最后希望 KubeSphere 能够越来越普及，紧跟 K8s 官方标准，在降低上手门槛、社区、文档建设等方面不断取得突破，让更多的人能够更快速的享受到 K8s 的好处。