---
title: "添加持续部署白名单"
keywords: 'Kubernetes, GitOps, KubeSphere, 持续部署，白名单'
description: '介绍如何在 KubeSphere 中添加持续部署白名单。'
linkTitle: "添加持续部署白名单"
weight: 11243
---
在 KubeSphere 3.3 中，您可以通过设置白名单限制资源持续部署的目标位置。

## 准备工作

- 您需要有一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)，并已邀请此帐户至 DevOps 项目中且授予 `operator` 角色。如果尚未准备好，请参考[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

- 您需要启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。

- 您需要[导入代码仓库](../../../../devops-user-guide/how-to-use/code-repositories/import-code-repositories/)。

## 操作步骤

1. 以 `project-regular` 用户登录 KubeSphere 控制台，在左侧导航树，点击 **DevOps 项目**。

2. 在右侧的 **DevOps 项目**页面，点击您创建的 DevOps 项目。

3. 在左侧的导航树，选择 **DevOps 项目设置 > 基本信息**。

4. 在右侧**基本信息**下的**持续部署白名单**区域，点击**编辑白名单**。

5. 在弹出的**编辑白名单**对话框，选择代码仓库和部署集群和项目，点击**确定**。您可以继续点击**添加**以添加多个代码仓库和部署位置。
