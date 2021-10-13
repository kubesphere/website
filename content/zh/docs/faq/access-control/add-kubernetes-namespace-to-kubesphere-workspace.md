---
title: "添加现有 Kubernetes 命名空间至 KubeSphere 企业空间"
keywords: "命名空间, 项目, KubeSphere, Kubernetes"
description: "将您现有 Kubernetes 集群中的命名空间添加至 KubeSphere 的企业空间。"
linkTitle: "添加现有 Kubernetes 命名空间至 KubeSphere 企业空间"
Weight: 16430
---

Kubernetes 命名空间即 KubeSphere 项目。如果您不是在 KubeSphere 控制台创建命名空间对象，则该命名空间不会直接在企业空间中显示。不过，集群管理员依然可以在**集群管理**页面查看该命名空间。同时，您也可以将该命名空间添加至企业空间。

本教程演示如何添加现有 Kubernetes 命名空间至 KubeSphere 企业空间。

## 准备工作

- 您需要有一个具有**集群管理**权限的帐户。例如，您可以直接以 `admin` 身份登录控制台，或者创建一个具有该权限的新角色并将其分配至一个用户。

- 您需要有一个可用的企业空间，以便将命名空间分配至该企业空间。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建 Kubernetes 命名空间

首先，创建一个示例 Kubernetes 命名空间，以便稍后将其添加至企业空间。执行以下命令：

```bash
kubectl create ns demo-namespace
```

有关创建 Kubernetes 命名空间的更多信息，请参见[命名空间演练](https://kubernetes.io/zh/docs/tasks/administer-cluster/namespaces-walkthrough/)。

## 添加命名空间至 KubeSphere 企业空间

1. 以 `admin` 身份登录 KubeSphere 控制台，转到**集群管理**页面。点击**项目管理**，您可以查看在当前集群中运行的所有项目（即命名空间），包括前述刚刚创建的项目。

2. 通过 kubectl 创建的命名空间不属于任何企业空间。请点击右侧的 <img src="/images/docs/zh-cn/faq/access-control-and-account-management/add-kubernetes-namespace-to-kubesphere-workspace/three-dots.png" height="20px">，选择**分配企业空间**。

   ![分配企业空间](/images/docs/zh-cn/faq/access-control-and-account-management/add-kubernetes-namespace-to-kubesphere-workspace/assign-workspace.PNG)

3. 在弹出的对话框中，为该项目选择一个**目标企业空间**和**项目管理员**，然后点击**确定**。

4. 转到您的企业空间，可以在**项目管理**页面看到该项目已显示。

   ![项目管理页面](/images/docs/zh-cn/faq/access-control-and-account-management/add-kubernetes-namespace-to-kubesphere-workspace/project-page.PNG)

