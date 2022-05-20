---
title: "导入代码仓库"
keywords: 'Kubernetes, GitOps, KubeSphere, 代码仓库'
description: '介绍如何在 KubeSphere 中导入代码仓库。'
linkTitle: "导入代码仓库"
weight: 11231
---

KubeSphere 3.3.0 支持您从 GitHub 、 GitLab 或 Bitbucket 导入代码仓库。下面以 Github 仓库为例，展示如何导入代码仓库。

## 准备工作

- 您需要有一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)，并已邀请此帐户至 DevOps 项目中且授予 `operator` 角色。如果尚未准备好，请参考[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

- 您需要启用 [KubeSphere DevOps 系统](../../../../devops-user-guide/devops-overview/devops-project-management/)。

<<<<<<< HEAD
## 操作步骤
1. 以 `project-regular` 用户登录 KubeSphere 控制台，在左侧导航树，点击 **DevOps 项目**。

2. 在右侧的 **DevOps 项目**页面，点击您创建的 DevOps 项目。

3. 在左侧的导航树，点击**代码仓库**。

4. 在右侧的**代码仓库**页面，点击**导入**。

5. 在**导入代码仓库**对话框，输入代码仓库名称，并选择代码仓库，此处以 GitHub 为例。您也可以为代码仓库设置别名和添加描述信息。

=======

## 操作步骤
1. 以 `project-regular` 用户登录 KubeSphere 控制台，在左侧导航树，点击 **DevOps 项目**。

2. 在右侧的 **DevOps 项目**页面，点击您创建的 DevOps 项目。

3. 在左侧的导航树，点击**代码仓库**。

4. 在右侧的**代码仓库**页面，点击**导入**。

5. 在**导入代码仓库**对话框，输入代码仓库名称，并选择代码仓库，此处以 GitHub 为例。您也可以为代码仓库设置别名和添加描述信息。

>>>>>>> 44284bfb (devops english version)
6. 在**凭证**区域，点击**创建凭证**。在弹出的**创建凭证**对话框，设置以下参数：
   - **名称**：输入凭证名称，如 `github-id`。
   - **类型**：取值包括**用户名和密码**、**SSH 密钥**、**访问令牌**和 **kubeconfig**。在 DevOps 项目中，建议使用**用户名和密码**。
   - **用户名**：此处默认用户名为 `admin`。
   - **密码/令牌**：输入您的 GitHub 令牌。
   - **描述**：添加描述信息。

7. 在弹出的 GitHub 仓库中，选择代码仓库，点击**确定**。

8. 点击代码仓库右侧的 <img src="/images/docs/common-icons/three-dots.png" width="15" />，您可以执行以下操作：

   - 编辑：修改代码仓库别名和描述信息以及重新选择代码仓库。
   - 编辑 YAML：编辑代码仓库 YAML 文件。
   - 删除：删除代码仓库。

