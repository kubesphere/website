---
title: "企业空间网络隔离"
keywords: 'KubeSphere, Kubernetes, Calico, 网络策略'
description: '在您的企业空间中开启或关闭网络策略。'
linkTitle: "企业空间网络隔离"
weight: 9500
---

## 准备工作

- 已经启用[网络策略](../../pluggable-components/network-policy/)。

- 需要使用拥有 `workspace-admin` 角色的用户。例如，使用在[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project/)教程中创建的 `ws-admin` 用户。

  {{< notice note >}}

  关于网络策略的实现，您可以参考 [KubeSphere NetworkPolicy](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md)。

  {{</ notice >}}

## 开启或关闭企业空间网络隔离

企业空间网络隔离默认关闭。您可以在**企业空间设置**下的**基本信息**页面开启网络隔离。

{{< notice note >}}

当网络隔离开启时，默认允许出站流量，而不同企业空间的进站流量将被拒绝。如果您需要自定义网络策略，则需要开启[项目网络隔离](../../project-administration/project-network-isolation/)并在**项目设置**中添加网络策略。

{{</ notice >}}

您也可以在**基本信息**页面关闭网络隔离。

## 最佳做法

要确保企业空间中的所有容器组都安全，一个最佳做法是开启企业空间网络隔离。

当网络隔离开启时，其他企业空间无法访问该企业空间。如果企业空间的默认网络隔离无法满足您的需求，请开启项目网络隔离并自定义您的项目网络策略。
