---
title: "KubeSphere 中的 Kubernetes 联邦"
keywords: 'Kubernetes, KubeSphere, 联邦, 多集群, 混合云'
description: '概述'

weight: 3007
---

多集群功能与多个集群之间的网络连接有关。 因此，了解集群的拓扑关系很重要，这样可以减少工作量。

在使用多集群功能之前，您需要创建一个主集群（Host Cluster，以下简称 **H** 集群），H 集群实际上是启用了多集群功能的 KubeSphere 集群。所有被 H 集群管理的集群称为成员集群（Member Cluster，以下简称 **M** 集群）。M 集群是未启用多集群功能的普通 KubeSphere 集群。只能有一个 H 集群存在，而多个 M 集群可以同时存在。 在多集群体系结构中，H 集群和 M 集群之间的网络可以直接连接，也可以通过代理连接。 M 集群之间的网络可以设置在完全隔离的环境中。

![KubeSphere 中的 Kubernetes 联邦](https://ap3.qingstor.com/kubesphere-website/docs/20200907232319.png)
