---
title: "升级说明"
keywords: "Kubernetes, upgrade, KubeSphere, v3.0.0, upgrade"
description: "KubeSphere Upgrade Overview"

linkTitle: "升级说明"
weight: 8100
---

## Kubernetes

KubeSphere v3.0.0 与 Kubernetes 1.15.x, 1.16.x, 1.17.x 以及 1.18.x 兼容：

- 如果您的 KubeSphere v2.1.x 安装在 Kubernetes 1.15.x+ 上，您可选择只将 KubeSphere 升级到 v3.0.0 或者同时升级 Kubernetes（到高版本）和 KubeSphere (到 v3.0.0) 。

- 如果您的 KubeSphere v2.1.x 安装在 Kubernetes 1.14.x上，您必须同时升级 Kubernetes (到 1.15.x+) 和 KubeSphere (到 v3.0.0) 。

{{< notice warning >}}
与之前的1.14.x 和1.15.x 相比，Kubernetes 1.16.x 的 API 有一些重要的改动。更多详细信息，请参阅 [Deprecated APIs Removed In 1.16: Here’s What You Need To Know](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/)。 因此，如果您打算将 Kubernetes 1.14.x/1.15.x 升级到 1.16.x+，升级后，还必须进行一些迁移工作。

{{</ notice >}}

## 升级前

{{< notice warning >}}

- 您应该先在测试环境中实施升级模拟。在测试环境中成功升级之后，所有应用程序都可以正常运行，再在生产环境中进行升级。
- 在升级过程中，应用程序可能会短暂中断 (尤其是那些单副本 Pod)。请安排合理的升级时间。
- 建议在生产环境中升级之前备份 ETCD 和运行中的应用程序。可以使用 [Velero](https://velero.io/) 来备份和迁移 Kubernetes 资源以及持久化存储卷。

{{</ notice >}}

## 方法

KubeSphere v3.0.0 采用了全新的 [KubeKey](https://github.com/kubesphere/kubekey) 安装程序，您可以使用该程序安装或升级 Kubernetes 和 KubeSphere。更多关于使用 KubeKey 升级的详细内容请参阅 [使用 KubeKey 升级](../upgrade-with-kubekey/) 。

## 用 KubeKey 还是 ks-installer 升级

[ks-installer](https://github.com/kubesphere/ks-installer/tree/master) 曾是 KubeSphere v2 的主要安装工具。对于未使用 [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/#step-2-download-installer-package) 部署 Kubernetes 集群的用户，应选择使用 ks-installer 升级 KubeSphere。例如，如果您的 Kubernetes 是由云供应商托管或自行配置的，请参阅 [使用 ks-installer 升级](../upgrade-with-ks-installer)。
