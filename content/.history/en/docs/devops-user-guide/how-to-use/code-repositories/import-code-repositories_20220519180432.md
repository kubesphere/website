---
title: "Import a Code Repository"
keywords: 'Kubernetes, GitOps, KubeSphere, Code Repository'
description: 'Describe how to import a code repository on KubeSphere.'
linkTitle: "Import a Code Repository"
weight: 11231
---

In KubeSphere 3.3.0, you can import a GitHub, GitLab, or Bitbucket repository. The following describes how to import a code repository, for example, a Github repository.

## Prerequisites

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/)。

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).


## Procedures

1. Log in to the KubeSphere console as `project-regular`. In the navigation pane on the left, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the navigation pane on the left, click **Code Repositories**.

4. 在右侧的**Code Repositories**页面，点击**Import**。

5. 在**Import Code Repository**对话框，输入代码仓库名称，并选择代码仓库，此处以 GitHub 为例。您也可以为代码仓库设置别名和添加描述信息。

6. 在**Credential**区域，点击**Create Credential**。在弹出的**Create Credential**对话框，设置以下参数：
   - **Name**：输入凭证名称，如 `github-id`。
   - **Type**：取值包括**Username and password**、**SSH key**、**Access token**和 **kubeconfig**。在 DevOps 项目中，建议使用**用户名和密码**。
   - **Username**：此处默认用户名为 `admin`。
   - **Password/Token**：输入您的 GitHub 令牌。
   - **Description**：添加描述信息。

7. 在弹出的 GitHub 仓库中，选择代码仓库，点击**OK**。

8. 点击代码仓库右侧的 <img src="/images/docs/common-icons/three-dots.png" width="15" />，您可以执行以下操作：

   - Edit：修改代码仓库别名和描述信息以及重新选择代码仓库。
   - Edit YAML：编辑代码仓库 YAML 文件。
   - Delete：删除代码仓库。

