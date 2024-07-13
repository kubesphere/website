---
title: "项目配额"
keywords: 'KubeSphere, Kubernetes, 项目, 配额, 资源, 请求, 限制'
description: '设置请求和限制，控制项目中的资源使用情况。'
linkTitle: "项目配额"
weight: 9600
version: "v3.4"
---

KubeSphere 使用预留（Request）和限制（Limit）来控制项目中的资源（例如 CPU 和内存）使用情况，在 Kubernetes 中也称为[资源配额](https://kubernetes.io/zh/docs/concepts/policy/resource-quotas/)。请求确保项目能够获得其所需的资源，因为这些资源已经得到明确保障和预留。相反地，限制确保项目不能使用超过特定值的资源。

除了 CPU 和内存，您还可以单独为其他对象设置资源配额，例如项目中的容器组、[部署](../../project-user-guide/application-workloads/deployments/)、[任务](../../project-user-guide/application-workloads/jobs/)、[服务](../../project-user-guide/application-workloads/services/)和[配置字典](../../project-user-guide/configuration/configmaps/)。

本教程演示如何配置项目配额。

## 准备工作

您需要有一个可用的企业空间、一个项目和一个用户 (`ws-admin`)。该用户必须在企业空间层级拥有 `admin` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project/)。

{{< notice note >}}

如果使用 `project-admin` 用户（该用户在项目层级拥有 `admin` 角色），您也可以为新项目（即其配额尚未设置）设置项目配额。不过，项目配额设置完成之后，`project-admin` 无法更改配额。一般情况下，`ws-admin` 负责为项目设置限制和请求。`project-admin` 负责为项目中的容器[设置限制范围](../../project-administration/container-limit-ranges/)。 

{{</ notice >}} 

## 设置项目配额

1. 以 `ws-admin` 身份登录控制台，进入一个项目。如果该项目是新创建的项目，您可以在**概览**页面看到项目配额尚未设置。点击**编辑配额**来配置配额。

2. 在弹出对话框中，您可以看到 KubeSphere 默认不为项目设置任何请求或限制。要设置请求和限制来控制 CPU 和内存资源，请将滑块移动到期望的值或者直接输入数字。字段留空意味着您不设置任何请求或限制。

   {{< notice note >}}

   限制必须大于请求。

   {{</ notice >}} 

3. 要为其他资源设置配额，在**项目资源配额**下点击**添加**，选择一个资源或输入资源名称并设置配额。

4. 点击**确定**完成配额设置。

5. 在**项目设置**下的**基本信息**页面，您可以查看该项目的所有资源配额。

6. 要更改项目配额，请在**基本信息**页面点击**编辑项目**，然后选择**编辑项目配额**。

   {{< notice note >}}

   对于[多集群项目](../../project-administration/project-and-multicluster-project/#多集群项目)，**管理项目**下拉菜单中不会显示**编辑配额**选项。若要为多集群项目设置配额，前往**项目设置**下的**项目配额**，并点击**编辑配额**。请注意，由于多集群项目跨集群运行，您可以为多集群项目针对不同集群分别设置资源配额。

   {{</ notice >}} 

7. 在**项目配额**页面更改项目配额，然后点击**确定**。

## 另请参见

[容器限制范围](../../project-administration/container-limit-ranges/)
