---
title: "配置字典"
keywords: 'KubeSphere, Kubernetes, ConfigMap'
description: '了解如何在 KubeSphere 中创建配置字典。'
linkTitle: "配置字典"
weight: 10420
---

Kubernetes [配置字典（ConfigMap）](https://kubernetes.io/docs/concepts/configuration/configmap/) 以键值对的形式存储配置数据。配置字典资源可用于向容器组中注入配置数据。配置字典对象中存储的数据可以被 `ConfigMap` 类型的卷引用，并由容器组中运行的容器化应用使用。配置字典通常用于以下场景：

- 设置环境变量的值。
- 设置容器中的命令参数。
- 在卷中创建配置文件。

本教程演示如何在 KubeSphere 中创建配置字典。

## 准备工作

您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建配置字典

1. 以 `project-regular` 用户登录控制台并进入项目，在左侧导航栏中选择**配置**下的**配置字典**，然后点击**创建**。

2. 在弹出的对话框中，设置配置字典的名称（例如 `demo-configmap`），然后点击**下一步**。

   {{< notice tip >}}

您可以在对话框右上角启用**编辑 YAML** 来查看配置字典的 YAML 清单文件，并通过直接编辑清单文件来创建配置字典。您也可以继续执行后续步骤在控制台上创建配置字典。

{{</ notice >}} 

3. 在**数据设置**选项卡，点击**添加数据**以配置键值对。

4. 输入一个键值对。下图为示例：

   {{< notice note >}}

- 配置的键值对会显示在清单文件中的 `data` 字段下。

- 目前 KubeSphere 控制台只支持在配置字典中配置键值对。未来版本将会支持添加配置文件的路径来创建配置字典。

{{</ notice >}} 

5. 点击对话框右下角的 **√** 以保存配置。您可以再次点击**添加数据**继续配置更多键值对。
6. 点击**创建**以生成配置字典。

## 查看配置字典详情

1. 配置字典创建后会显示在**配置字典**页面。您可以点击右侧的 <img src="/images/docs/zh-cn/project-user-guide/configurations/configmaps/three-dots.png" height="20px">，并从下拉菜单中选择操作来修改配置字典。

    - **编辑**：查看和编辑基本信息。
    - **编辑 YAML**：查看、上传、下载或更新 YAML 文件。
    - **编辑设置**：修改配置字典键值对。
    - **删除**：删除配置字典。
    
2. 点击配置字典名称打开其详情页面。在**数据**选项卡，您可以查看配置字典的所有键值对。

3. 点击**更多操作**对配置字典进行其他操作。

    - **编辑 YAML**：查看、上传、下载或更新 YAML 文件。
    - **编辑设置**：修改配置字典键值对。
    - **删除**：删除配置字典并返回配置字典列表页面。
    
4. 点击**编辑信息**来查看和编辑配置字典的基本信息。


## 使用配置字典

在创建工作负载、[服务](../../../project-user-guide/application-workloads/services/)、[任务](../../../project-user-guide/application-workloads/jobs/)或[定时任务](../../../project-user-guide/application-workloads/cronjobs/)时，您可以用配置字典为容器添加环境变量。您可以在**添加容器**页面勾选**环境变量**，点击**引用配置字典或保密字典**，然后从下拉列表中选择一个配置字典。

