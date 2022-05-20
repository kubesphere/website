---
title: "DevOps Project Management"
keywords: 'Kubernetes, KubeSphere, DevOps, Jenkins'
description: 'Create and manage DevOps projects, and understand basic elements in DevOps projects.'
linkTitle: "DevOps Project Management"
weight: 11120
---

This tutorial demonstrates how to create and manage DevOps projects.

## Prerequisites

- You need to create a workspace and a user (`project-admin`). The user must be invited to the workspace with the role of `workspace-self-provisioner`. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to enable the [KubeSphere DevOps system](../../../pluggable-components/devops/).

## Create a DevOps Project

1. Log in to the console of KubeSphere as `project-admin`. Go to **DevOps Projects** and click **Create**.

2. Provide the basic information for the DevOps project and click **OK**.

   - **Name**: A concise and clear name for this DevOps project, which is convenient for users to identify, such as `demo-devops`.
   - **Alias**: The alias name of the DevOps project.
   - **Description**: A brief introduction to the DevOps project.
   - **Cluster Settings**: In the current version, a DevOps project cannot run across multiple clusters at the same time. If you have enabled [the multi-cluster feature](../../../multicluster-management/), you must select the cluster where your DevOps project runs.

3. A DevOps project is displayed in the list below after created.

## View a DevOps Project

Click the DevOps project just created to go to its details page. Tenants with different permissions can perform various tasks in a DevOps project, including creating CI/CD pipelines and credentials, and managing accounts and roles. 

### Pipelines

A pipeline entails a collection of plugins that allow you to constantly and consistently test and build your code. It combines continuous integration (CI) and continuous delivery (CD) to provide streamlined workflows so that your code can be automatically delivered to any target.

### Credentials

A DevOps project user with required permissions can configure credentials for pipelines for the interaction with external environments. Once the user adds these credentials in a DevOps project, the credentials can be used by the DevOps project to interact with third-party applications, such as GitHub, GitLab and Docker Hub. For more information, see [Credential Management](../../../devops-user-guide/how-to-use/devops-settings/credential-management/).

### Members and Roles

Similar to a project, a DevOps project also requires users to be granted different roles before they can work in the DevOps project. Project administrators (for example, `project-admin`) are responsible for inviting tenants and granting them different roles. For more information, see [Role and Member Management](../role-and-member-management/).

## Edit or Delete a DevOps Project

1. Click **Basic Information** under **DevOps Project Settings**, and you can see an overview of the current DevOps project, including the number of project roles and members, project name and project creator.

2. Click **Manage** on the right, and you can edit the basic information of the DevOps project or delete it.
