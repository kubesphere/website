---
title: "概要"
keywords: 'Kubernetes, KubeSphere, 多集群, 混合云'
description: '概要'

weight: 3006
---

如今，在不同的云服务提供商或者基础设施上运行和管理多个 Kubernetes 集群已经非常普遍。 由于每个 Kubernetes 集群都是一个相对独立的单元，上游社区正努力研发多集群管理解决方案。 也就是说，Kubernetes 集群联邦（Kubernetes Cluster Federation，简称 [KubeFed](https://github.com/kubernetes-sigs/kubefed)）可能是其中一种可行的方法。

多集群管理最常见的用例包括服务流量负载均衡、开发和生产的隔离、数据处理和数据存储的分离、跨云备份和灾难恢复、计算资源的灵活分配、跨区域服务的低延迟访问以及厂商捆绑的防范。

KubeSphere 的开发旨在解决多集群和多云管理的难题，并实现后续的用户场景，为用户提供统一的控制平面，以将应用程序及其副本分发到从公有云到本地环境的多个集群。 KubeSphere 还提供跨多个群集的丰富的可观察性，包括集中式监视、日志记录、事件和审核日志。

![KubeSphere 多集群管理](/images/docs/multi-cluster-overview.jpg)
