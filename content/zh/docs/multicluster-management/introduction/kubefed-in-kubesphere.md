---
title: "KubeSphere 联邦"
keywords: 'Kubernetes, KubeSphere, 联邦, 多集群, 混合云'
description: '概述'
linkTitle: "KubeSphere 联邦"
weight: 5120
---

多集群功能与多个集群之间的网络连接有关。因此，了解集群的拓扑关系很重要。

## 多集群架构如何运作

在使用 KubeSphere 的中央控制平面管理多个集群之前，您需要创建一个 Host 集群（以下称为 **H** 集群）。H 集群实际上是一个启用了多集群功能的 KubeSphere 集群，您可以使用它提供的控制平面统一管理 Member 集群（以下称为 **M** 集群）。M 集群是没有中央控制平面的普通 KubeSphere 集群。也就是说，拥有必要权限的租户（通常是集群管理员）能够通过 H 集群访问控制平面，管理所有 M 集群，例如查看和编辑 M 集群上面的资源。反过来，如果您单独访问任意 M 集群的 Web 控制台，您将无法查看其他集群的任何资源。

![中央控制平面](/images/docs/zh-cn/multicluster-management/introduction/kubesphere-federation/central-control-plane.png)

只能有一个 H 集群存在，而多个 M 集群可以同时存在。在多集群架构中，H 集群和 M 集群之间的网络可以直接连接，或者通过代理连接。M 集群之间的网络可以设置在完全隔离的环境中。

![Kubernetes 联邦](/images/docs/zh-cn/multicluster-management/introduction/kubesphere-federation/kubesphere-federation.png)

## 厂商无锁定

KubeSphere 拥有功能强大的中央控制平面，您可以统一管纳部署在任意环境或云厂商上的 KubeSphere 集群。