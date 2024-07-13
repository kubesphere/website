---
title: "容器限制范围"
keywords: 'Kubernetes, KubeSphere, 资源, 配额, 限制, 请求, 限制范围, 容器'
description: '了解如何在项目中设置默认容器限制范围。'
linkTitle: "容器限制范围"
weight: 13400
version: "v3.4"
---

容器所使用的 CPU 和内存资源上限由[项目资源配额](../../workspace-administration/project-quotas/)指定。同时，KubeSphere 使用请求 (Request) 和限制 (Limit) 来控制单个容器的资源（例如 CPU 和内存）使用情况，在 Kubernetes 中也称为 [LimitRange](https://kubernetes.io/zh/docs/concepts/policy/limit-range/)。请求确保容器能够获得其所需要的资源，因为这些资源已经得到明确保障和预留。相反地，限制确保容器不能使用超过特定值的资源。

当您创建工作负载（例如部署）时，您可以为容器配置资源请求和资源限制。要预先填充这些请求字段和限制字段的值，您可以设置默认限制范围。

本教程演示如何为项目中的容器设置默认限制范围。

## 准备工作

您需要有一个可用的企业空间、一个项目和一个用户 (`project-admin`)。该用户必须在项目层级拥有 `admin` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project/)。

## 设置默认限制范围

1. 以 `project-admin` 身份登录控制台，进入一个项目。如果该项目是新创建的项目，您在**概览**页面上会看到默认配额尚未设置。点击**默认容器配额未设置**旁的**编辑配额**来配置限制范围。

2. 在弹出的对话框中，您可以看到 KubeSphere 默认不设置任何请求或限制。要设置请求和限制来控制 CPU 和内存资源，请移动滑块至期望的值或者直接输入数值。字段留空意味着不设置任何请求或限制。

   {{< notice note >}}

   限制必须大于请求。

   {{</ notice >}} 

3. 点击**确定**完成限制范围设置。

4. 在**项目设置**下的**基本信息**页面，您可以查看项目中容器的默认容器配额。

5. 要更改默认容器配额，请在**基本信息**页面点击**管理**，然后选择**编辑默认容器配额**。

6. 在弹出的对话框中直接更改容器配额，然后点击**确定**。

7. 当您创建工作负载时，容器的请求和限制将预先填充对应的值。

   {{< notice note >}}

   有关更多信息，请参见[容器镜像设置](../../project-user-guide/application-workloads/container-image-settings/)中的**资源请求**。

   {{</ notice >}}

## 另请参见

[项目配额](../../workspace-administration/project-quotas/)