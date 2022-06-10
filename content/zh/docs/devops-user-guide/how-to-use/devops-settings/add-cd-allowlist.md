---
title: "添加持续部署白名单"
keywords: 'Kubernetes, GitOps, KubeSphere, 持续部署，白名单'
description: '介绍如何在 KubeSphere 中添加持续部署白名单。'
linkTitle: "添加持续部署白名单"
weight: 11243
---
在 KubeSphere 3.3.0 中，您可以通过设置白名单限制资源持续部署的目标位置。

## 准备工作

- 您需要创建一个企业空间和一个用户 (`project-admin`)，必须邀请该用户至该企业空间并赋予 `workspace-self-provisioner` 角色。有关更多信息，请参考[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

- 您需要启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。

- 您需要[创建 DevOps 项目](../../../../devops-user-guide/devops-overview/devops-project-management/)。

- 您需要[导入代码仓库](../../../../devops-user-guide/how-to-use/code-repositories/import-code-repositories/)。

## 操作步骤

1. 以 `project-admin` 用户登录 KubeSphere 控制台， 选择 **平台管理 > 访问控制**。

2. 在**企业空间**页面，点击您创建的企业空间。

3. 在左侧的导航树，点击 **DevOps 项目**。

4. 在右侧的 **DevOps 项目**页面，点击您创建的 DevOps 项目。

5. 在左侧的导航树，选择 **DevOps 项目设置 > 基本信息**。

6. 在右侧**基本信息**下的**持续部署白名单**区域，点击**编辑白名单**。

7. 在弹出的**编辑白名单**对话框，点击**添加**选择代码仓库和部署位置，点击**确定**。您可以继续点击**添加**以添加多个代码仓库和部署位置。