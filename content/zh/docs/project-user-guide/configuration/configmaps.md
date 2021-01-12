---
title: "ConfigMap"
keywords: 'KubeSphere, Kubernetes, ConfigMap'
description: '如何在 KubeSphere 中创建 ConfigMap。'
linkTitle: "ConfigMap"
weight: 10420
---

Kubernetes [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) 以键值对的形式存储配置数据。ConfigMap 资源可用于向 Pod 中注入配置数据。ConfigMap 对象中存储的数据可以被 `ConfigMap` 类型的卷引用，并由 Pod 中运行的容器化应用使用。ConfigMap 通常用于以下场景：

- 设置环境变量的值。
- 设置容器中的命令参数。
- 在卷中创建配置文件。

本教程演示如何在 KubeSphere 中创建 ConfigMap。

## 准备工作

您需要创建一个企业空间、一个项目和一个帐户（例如 `project-regular`）。该帐户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project)。

## 创建 ConfigMap

### 步骤 1：进入 ConfigMap 页面

以 `project-regular` 用户登录控制台并进入项目，在左侧导航栏中选择**配置中心**下的**配置**，然后点击**创建**。

![create-configmap](/images/docs/zh-cn/project-user-guide/configurations/configmaps/create-configmap.jpg)

### 步骤 2：配置基本信息

设置 ConfigMap 的名称（例如 `demo-configmap`），然后点击**下一步**。

{{< notice tip >}}

您可以在对话框右上角启用**编辑模式**来查看 ConfigMap 的 YAML 清单文件，并通过直接编辑清单文件来创建 ConfigMap。您也可以继续执行后续步骤在控制台上创建 ConfigMap。

{{</ notice >}} 

![set-basic-info](/images/docs/project-user-guide/configurations/configmaps/set-basic-info.jpg)

### 步骤 3：配置键值对

1. 在**配置设置**选项卡，点击**添加数据**以配置键值对。

   ![add-data](/images/docs/zh-cn/project-user-guide/configurations/configmaps/add-data.jpg)

2. 配置一个键值对。下图为示例：

   ![key-value](/images/docs/zh-cn/project-user-guide/configurations/configmaps/key-value.jpg)

   {{< notice note >}}

   - 配置的键值对会显示在清单文件中的 `data` 字段下。

   - 目前 KubeSphere 控制台只支持在 ConfigMap 中配置键值对。未来版本将会支持添加配置文件的路径来创建 ConfigMap。

   {{</ notice >}} 

3. 点击对话框右下角的 **√** 以保存配置。您可以再次点击**添加数据**继续配置更多键值对。

   ![finish-creating](/images/docs/zh-cn/project-user-guide/configurations/configmaps/finish-creating.jpg)

4. 配置完成后点击**创建**来生成 ConfigMap。

## 查看 ConfigMap 详情

1. ConfigMap 创建后会显示在如图所示的列表中。您可以点击右边的三个点，并从下拉菜单中选择操作来修改 ConfigMap。

    ![configmap-list](/images/docs/project-user-guide/configurations/configmaps/configmap-list.jpg)

    - **编辑**：查看和编辑基本信息。
    - **编辑配置文件**：查看、上传、下载或更新 YAML 文件。
    - **修改配置**：修改 ConfigMap 键值对。
    - **删除**：删除 ConfigMap。

2. 点击 ConfigMap 名称打开 ConfigMap 详情页面。在**详情**选项卡，您可以查看 ConfigMap 的所有键值对。

    ![detail-page](/images/docs/zh-cn/project-user-guide/configurations/configmaps/detail-page.jpg)

3. 点击**更多操作**对 ConfigMap 进行其他操作。

    ![configmap-dropdown-menu](/images/docs/zh-cn/project-user-guide/configurations/configmaps/configmap-dropdown-menu.jpg)

    - **编辑配置文件**：查看、上传、下载或更新 YAML 文件。
    - **修改配置**：修改 ConfigMap 键值对。
    - **删除**：删除 ConfigMap 并返回 ConfigMap 列表页面。

4. 点击**编辑信息**来查看和编辑 ConfigMap 的基本信息。

    ![edit-configmap-info](/images/docs/project-user-guide/configurations/configmaps/edit-configmap-info.jpg)
    

## 使用 ConfigMap

在创建工作负载、[服务](../../../project-user-guide/application-workloads/services/)、[任务](../../../project-user-guide/application-workloads/jobs/)或[定时任务](../../../project-user-guide/application-workloads/cronjob/)时，您可以用 ConfigMap 为容器添加环境变量。您可以在**容器镜像**页面勾选**环境变量**，点击**引用配置文件或密钥**，然后从下拉列表中选择一个 ConfigMap。

![use-configmap](/images/docs/zh-cn/project-user-guide/configurations/configmaps/use-configmap.jpg)

