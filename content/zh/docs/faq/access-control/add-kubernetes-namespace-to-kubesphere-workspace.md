---
title: "添加现有 Kubernetes 命名空间至 KubeSphere 企业空间"
keywords: "命名空间, 项目, KubeSphere, Kubernetes"
description: "添加现有 Kubernetes 命名空间至 KubeSphere 企业空间"
linkTitle: "添加现有 Kubernetes 命名空间至 KubeSphere 企业空间"
Weight: 16430
---

Kubernetes 命名空间即 KubeSphere 项目。如果您不是在 KubeSphere 控制台创建命名空间对象，则该命名空间不会直接在企业空间中显示。不过，集群管理员依然可以在**集群管理**页面查看该命名空间。同时，您也可以将该命名空间添加至企业空间。

本教程演示如何添加现有 Kubernetes 命名空间至 KubeSphere 企业空间。

## 准备工作

- 您需要有一个具有**集群管理**权限的帐户。例如，您可以直接以 `admin` 身份登录控制台，或者创建一个具有该权限的新角色并将其分配至一个帐户。

- 您需要有一个可用的企业空间，以便将命名空间分配至该企业空间。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建 Kubernetes 命名空间

首先，创建一个示例 Kubernetes 命名空间，以便稍后将其添加至企业空间。

1. 执行以下命令创建一个名为 `demo-namespace` 的文件。

   ```bash
   vi demo-namespace.json
   ```

2. 在该文件中输入以下内容然后保存。

   ```json
   {
     "apiVersion": "v1",
     "kind": "Namespace",
     "metadata": {
       "name": "demo-namespace",
       "labels": {
         "name": "demo-namespace"
       }
     }
   }
   ```

3. 创建命名空间。

   ```bash
   kubectl create -f demo-namespace.json
   ```

   有关创建 Kubernetes 命名空间的更多信息，请参见[命名空间演练](https://kubernetes.io/zh/docs/tasks/administer-cluster/namespaces-walkthrough/)。

## 添加命名空间至 KubeSphere 企业空间

1. 以 `admin` 身份登录 KubeSphere 控制台，转到**集群管理**页面。点击**项目管理**，您可以查看在当前集群中运行的所有项目（即命名空间），包括前述刚刚创建的项目。

   ![用户项目](/images/docs/zh-cn/faq/access-control-and-account-management/add-kubernetes-namespace-to-kubesphere-workspace/user-projects.PNG)

2. 通过 kubectl 创建的命名空间不属于任何企业空间。请点击右侧的三个点，选择**分配企业空间**。

   ![分配企业空间](/images/docs/zh-cn/faq/access-control-and-account-management/add-kubernetes-namespace-to-kubesphere-workspace/assign-workspace.PNG)

3. 在弹出对话框中，选择一个企业空间，并为该项目选择一个项目管理员，然后点击**确定**。

   ![选择企业空间](/images/docs/zh-cn/faq/access-control-and-account-management/add-kubernetes-namespace-to-kubesphere-workspace/select-workspace.PNG)

4. 转到您的企业空间，可以在**项目管理**页面看到该项目已显示。

   ![项目管理页面](/images/docs/zh-cn/faq/access-control-and-account-management/add-kubernetes-namespace-to-kubesphere-workspace/project-page.PNG)

