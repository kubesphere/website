---
title: "Import a Code Repository"
keywords: 'Kubernetes, GitOps, KubeSphere, Code Repository'
description: 'Describe how to import a code repository on KubeSphere.'
linkTitle: "Import a Code Repository"
weight: 11231
---

In KubeSphere 3.3.0, you can import a GitHub, GitLab, or Bitbucket repository. The following describes how to import a code repository, for example, a GitHub repository.

## Prerequisites

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).


## Procedures

1. Log in to the KubeSphere console as `project-regular`. In the navigation pane on the left, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the navigation pane on the left, click **Code Repositories**.

4. On the **Code Repositories** page, click **Import**.

5. In the **Import Code Repository** dialog box, enter a name of the code repository, and then select a Github repository. Optionally, you can set an alias and add description.

6. In **Credential**, click **Create Credential**. In the **Create Credential** dialog box, set the following parameters:
   - **Name**: Enter a name of the credential, for example, `github-id`.
   - **Type**: Optional values include **Username and password**, **SSH key**, **Access token**, and **kubeconfig**. In DevOps projects, **Username and password** is recommended.
   - **Username**: The defalut username is `admin`.
   - **Password/Token**: Enter your GitHub token.
   - **Description**: Add description.

7.In the GitHub repositories that are displayed, select a repostiroy, and click **OK**.

1. Click <img src="/images/docs/common-icons/three-dots.png" width="15" /> on the right of the imported code repository, and you can perform the following operations:

   - **Edit**: Edits the alias and descrition of the code repository and reselects a code repostory.
   - **Edit YAML**: Edits the YAML file of the code repository.
   - **Delete**: Deletes the code repository.

