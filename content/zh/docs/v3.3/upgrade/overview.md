---
title: "概述"
keywords: "Kubernetes, 升级, KubeSphere, 3.3, 升级"
description: "了解升级之前需要注意的事项，例如版本和升级工具。"
linkTitle: "概述"
weight: 7100
---

## 确定您的升级方案

KubeSphere 3.3 与 Kubernetes 1.19.x、1.20.x、1.21.x、1.22.x、1.23.x 兼容：

- 在您升级集群至 KubeSphere 3.3 之前，您的 KubeSphere 集群版本必须为 v3.2.x。

- 如果您的现有 KubeSphere v3.2.x 集群安装在 Kubernetes 1.19.x+ 上，您可选择只将 KubeSphere 升级到 3.3 或者同时升级 Kubernetes（到更高版本）和 KubeSphere（到 3.3）。

## 升级前

{{< notice warning >}}

- 您应该先在测试环境中实施升级模拟。在测试环境中成功升级并且所有应用程序都正常运行之后，再在生产环境中升级您的集群。
- 在升级过程中，应用程序可能会短暂中断（尤其是单副本容器组），请安排合理的升级时间。
- 建议在生产环境中升级之前备份 etcd 和有状态应用程序。您可以使用 [Velero](https://velero.io/) 来备份和迁移 Kubernetes 资源以及持久化存储卷。

{{</ notice >}}

## 升级工具

根据您已有集群的搭建方式，您可以使用 KubeKey 或 ks-installer 升级集群。如果您的集群由 KubeKey 搭建，[建议您使用 KubeKey 升级集群](../upgrade-with-kubekey/)。如果您通过其他方式搭建集群，[请使用 ks-installer 升级集群](../upgrade-with-ks-installer/)。