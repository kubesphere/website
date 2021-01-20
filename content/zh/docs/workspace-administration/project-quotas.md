---
title: "项目配额"
keywords: 'KubeSphere, Kubernetes, 项目, 配额, 资源, 请求, 限制'
description: '如何设置项目配额。'
linkTitle: "项目配额"
weight: 9600
---

KubeSphere 使用请求 (Request) 和限制 (Limit) 来控制项目中的资源（例如 CPU 和内存）使用情况，在 Kubernetes 中也称为 [ResourceQuota](https://kubernetes.io/zh/docs/concepts/policy/resource-quotas/)。请求确保项目能够获得其所需的资源，因为这些资源已经得到明确保障和预留。相反地，限制确保项目不能使用超过特定值的资源。

除了 CPU 和内存，您还可以单独为其他对象设置资源配额，例如项目中的 Pod、[部署](../../project-user-guide/application-workloads/deployments/)、[任务](../../project-user-guide/application-workloads/jobs/)、[服务](../../project-user-guide/application-workloads/services/)和 [ConfigMap](../../project-user-guide/configuration/configmaps/)。

本教程演示如何配置项目配额。

## 准备工作

您需要有一个可用的企业空间、一个项目和一个帐户 (`ws-admin`)。该帐户必须在企业空间层级拥有 `admin` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)。

{{< notice note >}}

如果使用 `project-admin` 帐户（该帐户在项目层级拥有 `admin` 角色），您也可以为新项目（即其配额尚未设置）设置项目配额。不过，项目配额设置完成之后，`project-admin` 无法更改配额。一般情况下，`ws-admin` 负责为项目设置限制和请求。`project-admin` 负责为项目中的容器[设置限制范围](../../project-administration/container-limit-ranges/)。 

{{</ notice >}} 

## 设置项目配额

1. 以 `ws-admin` 身份登录控制台，进入一个项目。如果该项目是新创建的项目，您可以在**概览**页面看到项目配额尚未设置。点击**设置**来配置配额。

   ![项目配额](/images/docs/zh-cn/workspace-administration-and-user-guide/project-quotas/project-quotas.PNG)

2. 在弹出对话框中，您可以看到 KubeSphere 默认不为项目设置任何请求或限制。要设置请求和限制来控制 CPU 和内存资源，请将滑块移动到期望的值或者直接输入数字。字段留空意味着您不设置任何请求或限制。

   ![设置项目配额](/images/docs/zh-cn/workspace-administration-and-user-guide/project-quotas/set-project-quotas.PNG)

   {{< notice note >}}

   限制必须大于请求。

   {{</ notice >}} 

3. 要为其他资源设置配额，请点击**添加配额项**，从列表中选择一个对象。

   ![设置其他资源配额](/images/docs/zh-cn/workspace-administration-and-user-guide/project-quotas/set-other-resource-quotas.PNG)

4. 点击**确定**完成配额设置。

5. 在**项目设置**下的**基本信息**页面，您可以查看该项目的所有资源配额。

   ![资源配额](/images/docs/zh-cn/workspace-administration-and-user-guide/project-quotas/resource-quotas.PNG)

6. 要更改项目配额，请在**基本信息**页面点击**项目管理**，然后选择**编辑配额**。

   ![编辑配额](/images/docs/zh-cn/workspace-administration-and-user-guide/project-quotas/edit-quotas.PNG)

7. 在**项目配额**页面直接更改项目配额，然后点击**确定**。

## 另请参见

[容器限制范围](../../project-administration/container-limit-ranges/)
