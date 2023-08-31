---
title: "移除成员集群"
keywords: 'Kubernetes, KubeSphere, 多集群, 混合云'
description: '了解如何从 KubeSphere 的集群池中移除成员集群。'
linkTitle: "移除成员集群"
weight: 5500
---

本教程演示如何在 KubeSphere 控制台移除成员集群。

## 准备工作

- 您已经启用多集群管理。
- 您需要有一个拥有**集群管理**权限角色的用户。例如，您可以直接以 `admin` 身份登录控制台，或者创建一个拥有该权限的新角色并授予至一个用户。

## 移除成员集群

你可以使用以下任一方法移除成员集群：

**方法 1**

1. 点击左上角的**平台管理**，选择**集群管理**。

2. 在**成员集群**区域，点击要从中央控制平面移除的集群右侧的 <img src="/images/docs/v3.x/common-icons/three-dots.png" height="20" />，点击**移除集群**。

3. 在弹出的**移除集群**对话框，请仔细阅读风险提示信息。如果您仍然想移除成员集群，输入集群名称，点击**确定**以移除成员集群。

**方法 2**

1. 点击左上角的**平台管理**，选择**集群管理**。

2. 在**成员集群**区域，请点击要从中央控制平面移除的集群。

3. 点击**集群设置** > **基本信息**。

4. 在**集群信息**右侧，点击**管理** > **移除集群**。

5. 在弹出的**移除集群**对话框，请仔细阅读风险提示信息。如果您仍然想移除成员集群，输入集群名称，点击**确定**以移除成员集群。

   {{< notice warning >}}

   * 集群被移除后，集群中原有的资源不会被自动清除。

   * 集群被移除后，集群中原有的多集群配置数据不会被自动清除，卸载 KubeSphere 或删除关联资源时会导致用户数据丢失。

   {{</ notice >}} 

6. 执行以下命令手动清理被移除集群中的多集群配置数据：

   ```bash
   for ns in $(kubectl get ns --field-selector status.phase!=Terminating -o jsonpath='{.items[*].metadata.name}'); do kubectl label ns $ns kubesphere.io/workspace- && kubectl patch ns $ns --type merge -p '{"metadata":{"ownerReferences":[]}}'; done
   ```

## 移除不健康的集群

在某些情况下，您无法按照上述步骤移除集群。例如，您导入了一个凭证错误的集群，并且无法访问**集群设置**。在这种情况下，请执行以下命令来移除不健康的集群：

```bash
kubectl delete cluster <cluster name>
```

