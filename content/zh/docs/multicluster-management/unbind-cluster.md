---
title: "解绑集群"
keywords: 'Kubernetes, KubeSphere, 多集群, 混合云'
description: '了解如何从 KubeSphere 的集群池中解除集群的绑定。'
linkTitle: "解绑集群"
weight: 5500
---

本教程演示如何将集群与 KubeSphere 的中央控制平面解绑。

## 准备工作

- 您已经启用多集群管理。
- 您需要有一个拥有**集群管理**权限角色的用户。例如，您可以直接以 `admin` 身份登录控制台，或者创建一个拥有该权限的新角色并授予至一个用户。

## 解绑集群

1. 点击左上角的**平台管理**，然后选择**集群管理**。

2. 在**集群管理**页面，请点击要从中央控制平面移除的集群。

   ![集群管理](/images/docs/zh-cn/multicluster-management/unbind-a-cluster/cluster-management.PNG)

3. 在**集群设置**下的**基本信息**页面，请选择**我确定要执行解绑集群的操作**，然后点击**解除绑定**。

   ![解绑集群](/images/docs/zh-cn/multicluster-management/unbind-a-cluster/unbind-cluster.PNG)

   {{< notice note >}}

   解绑集群后，您将无法在中央控制平面管理该集群，但该集群上的 Kubernetes 资源不会被删除。

   {{</ notice >}} 

## 解绑不健康的集群

在某些情况下，您无法按照上述步骤解绑集群。例如，您导入了一个凭证错误的集群，并且无法访问**集群设置**。在这种情况下，请执行以下命令来解绑不健康的集群：

```bash
kubectl delete cluster <cluster name>
```

