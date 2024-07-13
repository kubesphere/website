---
title: "概述"
keywords: 'Kubernetes, KubeSphere, 多集群, 混合云'
description: '对多集群管理有个基本的了解，例如多集群管理的常见用例，以及 KubeSphere 可以通过多集群功能带来的好处。'
linkTitle: "概述"
weight: 5110
version: "v3.4"
---

如今，各种组织跨不同的云厂商或者在不同的基础设施上运行和管理多个 Kubernetes 集群的做法非常普遍。由于每个 Kubernetes 集群都是一个相对独立的单元，上游社区正在艰难地研究和开发多集群管理解决方案。即便如此，Kubernetes 集群联邦（Kubernetes Cluster Federation，简称 [KubeFed](https://github.com/kubernetes-sigs/kubefed)）可能是其中一种可行的方法。

多集群管理最常见的使用场景包括服务流量负载均衡、隔离开发和生产环境、解耦数据处理和数据存储、跨云备份和灾难恢复、灵活分配计算资源、跨区域服务的低延迟访问以及避免厂商锁定等。

开发 KubeSphere 旨在解决多集群和多云管理（包括上述使用场景）的难题，为用户提供统一的控制平面，将应用程序及其副本分发到位于公有云和本地环境的多个集群。KubeSphere 还拥有跨多个集群的丰富可观测性，包括集中监控、日志系统、事件和审计日志等。

![多集群概览](/images/docs/v3.x/zh-cn/multicluster-management/introduction/overview/multi-cluster-overview.png)
