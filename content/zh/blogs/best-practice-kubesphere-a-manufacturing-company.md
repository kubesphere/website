---
title: '某制造企业基于 KubeSphere 的云原生实践'
tag: 'KubeSphere'
keyword: 'Kubernetes, KubeSphere, 云原生'
description: '本文分享了某制造企业基于 KubeSphere 的云原生实践过程。'
createTime: '2023-07-26'
author: 'Mike'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/best-practice-kubesphere-manufacture-cover.png'
---

## 背景介绍

随着业务升级改造与软件产品专案的增多，常规的物理机和虚拟机方式逐渐暴露出一些问题：
- 大量服务部署在虚拟机上，资源预估和硬件浪费较大；
- 大量服务部署在虚拟机上，部署时间和难度较大，自动化程度较低；
- 开发人员和运维人员，由于开发和部署服务环境不同，服务不稳定经常报错，产生的隔阂问题较多，效率较低；
- 排查问题原因不便利，开发没权限上生产环境，服务日志和服务监控状态无法定位。

在竞争日益激烈和不断变化的市场环境下，公司需要在产品上不停的迭代开发，来满足业务的需求，快速进行响应变化，所以解决上述问题变得愈发迫切。

## 选型说明

我们调研了两款开源产品。经过综合评估和比较，我们最终选择了 KubeSphere。KubeSphere 的定位是以应用为中心的容器平台，提供了简单易用的操作界面，一定程度上降低了学习成本，同时集成了原生 Istio 等功能，更加符合开发的使用习惯。

## 实践过程

加快开发对应用需求的响应，快速交付价值，快速响应变化。敏捷开发是用短的迭代周期来适应更快的变化，而且保持增量的持续改进的过程，Kubernetes + Docker 是 Dev 和 Ops 融合的一个桥梁，反过来说，敏捷开发与自动化运维，推动企业 DevOps 落地，提供端对端的从需求分析到部署监控的全流程开发运维一体化。

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKlWpQIRdbNEoYpHDK9Dr4bp.png)

### 基础设施与部署架构 

KubeSphere 的搭建也非常简单，通过 KubeAdmin 安装 Kubernetes，然后用 KubeSphere 官网推荐的方式安装 KubeSphere。私有内部云平台环境来搭建 Kubernetes 与 KubeSphere。基础服务器采用的是 Linux Centos 7，内核版本是 5.6。

在搭建 Kubernetes 集群时，我们选择使用 Keepalived 和 HAproxy 创建高可用 Kubernetes 集群 master，其中包括负载均衡入口。

部署参考图:

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKkQv1hzIOxEPJ7FOB9fj91b.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKkkFUTK7TNBbalxyOIq_qVZ.png)

### 存储与网络

目前我们主要对接的是 Ceph 的分布式存储，服务于各种持久化服务，比如我们会做一些 Harbor 的镜像，主要是 Rabbitmq、Redis、MySQL 等，生产环境主要是一些无状态的开发的服务，比如 Springboot、SpringCloud 开发的微服务，还有 Python 服务。Python 服务主要是用来做 AI 模型的简单分析。

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKk1wPMGdrlHO7hWd0lT30Ka.png)

同时也用 NFS 存储做一些有状态的数据备份和日志备份文件的存储。

网络选择了 Calico 这种纯三层的 BGP 的网络。

### 平台和应用的日志、监控、APM

我们采用了 ELK 采集各种基础服务和业务服务的 log，并进行日志报警监控。

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKkMogQZG5FLp7LtWWqOOevR.png)

我们使用 Prometheus+grafana，进行 OS、K8s 系统组件和 Pod 服务的采集和监控。

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKnleFUczBlD34mnzA0y9PZS.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKlku-mqjfpHgL_m9EwpUuml.png)

同时，我们使用 SkyWalking 来监控服务的 API 全链路性能。

### CI/CD

我们使用的 KubeSphere 的 DevOps模块，里面集成了 Jenkins，流水线的构建，实现了项目从拉取代码，质量检查到项目部署一键化的流程，在 DevOps 模块中用的是自定义 GitLab 仓库。

参考图形如下:

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKk0tk_W4PFFGJtu0a2qxCnt.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/AgAABXCIwKn6B--HcB1Fdo9uEKtzAXlt.png)

### 有状态服务管理

我们目前管理了 Redis、RabbitMQ 和 Elasticsearch 等集群。
- 唯一性——对于包含 N 个副本的 StatefulSet，每个 pod 会被分配一个 `[0，N)` 范围内的唯一序号。
- 顺序性——StatefulSet 中 pod 的启动、更新、销毁默认都是按顺序进行的。
- 稳定的网络身份标识——pod 的主机名、DNS 地址不会随着 pod 被重新调度而发生变化。
- 稳定的持久化存储——当 pod 被重新调度后，仍然能挂载原有的 PersistentVolume，保证了数据的完整性和一致性。

## 使用效果
KubeSphere 是一个非常流行的容器编排工具，它可以帮助用户管理和部署容器化应用程序。使用 KubeSphere 可以提高应用程序的可靠性、可扩展性和安全性。
- 开发人员几乎不用耗费时间在软件的部署和监控上，不需要关心过多的底层部署细节，节省约 30% 时间，产品迭代速度更快。
- 按角色管理权限，开发人员排查服务的错误更加方便，直接在平台上查看 log、指标数据、监控报表都很快捷，节省约 20% 的时间。
- 优化了资源利用率，降低了成本，在以前我们都是在 VM 上进行部署，服务器资源浪费比较大，经常也会进行资源利用率的检讨，上 KubeSphere 之后，资源利用率提高了 30% 以上。

## 未来规划
在未来，我们计划进一步发展和改进我们的基础设施环境和 DevOps 全流程效率,覆盖自动化测试流程。我们将继续关注新的技术趋势（服务网格，服务治理等）和最佳实践，并根据业务需求进行相应的升级和优化。我们也将继续加强团队的培训和技术能力，以更好地支持公司的业务发展。