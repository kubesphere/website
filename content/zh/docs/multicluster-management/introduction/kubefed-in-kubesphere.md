---
title: "KubeSphere 联邦"
keywords: 'Kubernetes, KubeSphere, 联邦, 多集群, 混合云'
description: '了解 KubeSphere 中的 Kubernetes 联邦的基本概念，包括 M 集群和 H 集群。'
linkTitle: "KubeSphere 联邦"
weight: 5120
---

多集群功能与多个集群之间的网络连接有关。因此，了解集群的拓扑关系很重要。

## 多集群架构如何运作

在使用 KubeSphere 的中央控制平面管理多个集群之前，您需要创建一个 Host 集群（以下称为 **H** 集群）。H 集群实际上是一个启用了多集群功能的 KubeSphere 集群，您可以使用它提供的控制平面统一管理 Member 集群（以下称为 **M** 集群）。M 集群是没有中央控制平面的普通 KubeSphere 集群。也就是说，拥有必要权限的租户（通常是集群管理员）能够通过 H 集群访问控制平面，管理所有 M 集群，例如查看和编辑 M 集群上面的资源。反过来，如果您单独访问任意 M 集群的 Web 控制台，您将无法查看其他集群的任何资源。

![中央控制平面](/images/docs/zh-cn/multicluster-management/introduction/kubesphere-federation/central-control-plane.png)

只能有一个 H 集群存在，而多个 M 集群可以同时存在。在多集群架构中，H 集群和 M 集群之间的网络可以[直接连接](../../enable-multicluster/direct-connection/)，或者通过[代理连接](../../enable-multicluster/agent-connection/)。M 集群之间的网络可以设置在完全隔离的环境中。

如果您是使用通过 kubeadm 搭建的自建 Kubernetes 集群，请参阅[离线安装](../../../installing-on-kubernetes/on-prem-kubernetes/install-ks-on-linux-airgapped/)在您的 Kubernetes 集群上安装 KubeSphere，然后通过直接连接或者代理连接来启用 KubeSphere 多集群管理功能。

![Kubernetes 联邦](/images/docs/zh-cn/multicluster-management/introduction/kubesphere-federation/kubesphere-federation.png)

## 厂商无锁定

KubeSphere 拥有功能强大的中央控制平面，您可以统一纳管部署在任意环境或云厂商上的 KubeSphere 集群。

## 资源要求

启用多集群管理前，请确保您的环境中有足够的资源。

| 命名空间 | kube-federation-system | kubesphere-system |
| -------- | ---------------------- | ----------------- |
| 子组件   | 2 x controller-manager  | Tower             |
| CPU 请求 | 100 m                  | 100 m             |
| CPU 限制 | 500 m                  | 500 m             |
| 内存请求 | 64 MiB                 | 128 MiB           |
| 内存限制 | 512 MiB                | 256 MiB           |
| 安装     | 可选                   | 可选              |

{{< notice note >}}

- CPU 和内存的资源请求和限制均指单个副本的要求。
- 多集群功能启用后，H 集群上会安装 Tower 和 controller-manager。如果您使用[代理连接](../../../multicluster-management/enable-multicluster/agent-connection/)，M 集群仅需要 Tower。如果您使用[直接连接](../../../multicluster-management/enable-multicluster/direct-connection/)，M 集群无需额外组件。

{{</ notice >}}

## 在多集群架构中使用应用商店

与 KubeSphere 中的其他组件不同，[KubeSphere 应用商店](../../../pluggable-components/app-store/)是所有集群（包括 H 集群和 M 集群）的全局应用程序池。您只需要在 H 集群上启用应用商店，便可以直接在 M 集群上使用应用商店的相关功能（无论 M 集群是否启用应用商店），例如[应用模板](../../../project-user-guide/application/app-template/)和[应用仓库](../../../workspace-administration/app-repository/import-helm-repository/)。

但是，如果只在 M 集群上启用应用商店而没有在 H 集群上启用，您将无法在多集群架构中的任何集群上使用应用商店。