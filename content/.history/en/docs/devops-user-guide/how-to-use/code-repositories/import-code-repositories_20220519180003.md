---
title: "Import a Code Repository"
keywords: 'Kubernetes, GitOps, KubeSphere, Code Repository'
description: '介绍如何在 KubeSphere 中导入代码仓库。'
linkTitle: "导入代码仓库"
weight: 11231
---

KubeSphere 3.3.0 支持您从 GitHub 、 GitLab 或 Bitbucket 导入代码仓库。您也可以使用 Git 直接拉取源代码。

## 准备工作

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/)。

- 您需要启用 [KubeSphere DevOps 系统](../../../../devops-user-guide/devops-overview/devops-project-management/)。


## 操作步骤
1. 以 `project-admin` 用户登录 KubeSphere 控制台，选择 **平台管理 > 访问控制**。

2. 在**企业空间**页面，点击您创建的企业空间。

3. 在左侧的导航树，点击 **DevOps 项目**。

4. 在右侧的 **DevOps 项目**页面，点击您创建的 DevOps 项目。

5. 在左侧的导航树，点击**Code Repositories**。在右侧的**Code Repositories**页面，点击**Import**。

6. 在**Import Code Repository**对话框，输入代码仓库名称，并选择代码仓库，此处以 GitHub 为例。您也可以为代码仓库设置别名和添加描述信息。

7. 在**Credential**区域，点击**Create Credential**。在弹出的**Create Credential**对话框，设置以下参数：
   - **Name**：输入凭证名称，如 `github-id`。
   - **Type**：取值包括**Username and password**、**SSH key**、**Access token**和 **kubeconfig**。在 DevOps 项目中，建议使用**用户名和密码**。
   - **Username**：此处默认用户名为 `admin`。
   - **Password/Token**：输入您的 GitHub 令牌。
   - **Description**：添加描述信息。

8. 在弹出的 GitHub 仓库中，选择代码仓库，点击**OK**。

9. 点击代码仓库右侧的 <img src="/images/docs/common-icons/three-dots.png" width="15" />，您可以执行以下操作：

   - Edit：修改代码仓库别名和描述信息以及重新选择代码仓库。
   - Edit YAML：编辑代码仓库 YAML 文件。
   - Delete：删除代码仓库。

