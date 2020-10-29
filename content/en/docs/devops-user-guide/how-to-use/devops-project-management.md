---
title: "DevOps Project Management"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
linkTitle: "DevOps Project Management"
weight: 110
---

## Prerequisites

- You need to create a workspace, a project and an account (project-admin). Please refer to Create Workspace, Project, Account and Role if they are not ready yet.
- You need to enable KubeSphere DevOps system.

## Create a DevOps 

1. Sign in with project-admin, choose `DevOps Projects` tap, then click **Create** and select **Create a DevOps project**.

![Create a DevOps](/images/devops/create-devops-1.png)

2. Fill in the basic information for this DevOps project.

- Name: A concise and clear name for this DevOps project, which is convenient for users to browse and search, e.g. `demo-devops`.
- Description: A brief introduction to DevOps project.

![devops_create_project](/images/devops/create-devops-2.png)

3. Then you will be able to view it has been created successfully. 

![devops_create_project](/images/devops/create-devops-3.png)

## View the DevOps Project

4. Enter into `demo-devops` page, it allows DevOps project admin to create CI/CD Pipelines and Credentials, as well as project management which includes basic information, roles and members. 

![devops_create_project](/images/devops/create-devops-4.png)

### Pipeline

Pipeline is a suite of plugins which supports implementing and integrating continuous delivery pipelines into Jenkins.

### Credentials

A DevOps project user can configure credentials in the application for dedicated use by Jenkins Pipeline. Once a user (e.g. Owner and Maintainer) adds/configures these credentials in DevOps project, the credentials can be used by DevOps projects to interact with these 3rd party applications, such as GitHub, GitLab, Docker Hub, etc. See [Credentials Management](../credential-management/) for how to use the credentials.

### Member Roles

Currently, there are 4 kind of built-in roles in DevOps project as following list:

- Viewer: The viewer who can view all resources in the DevOps project.
- Operator: The normal member in a DevOps project who can create pipelines and credentials in the DevOps project.
- Admin: The administrator in the DevOps project who can perform any action on any resource. It gives full control over all resources in the DevOps project.

### Project Members

Click on the **Project Members** to see which users are currently in the project. Click the **Invite Member** button to invite developer, testing, or operation colleagues to join this DevOps project. 

![Invite Project Members](/images/devops/create-devops-5.png)

You can search for the member name in the pop-up page, click the “+” sign on the right to invite members from the user pool in the workspace to join the current DevOps project for collaborative work. 

![Project Members Setting](/images/devops/create-devops-6.png)

For example, you can grant invite `project-regular` into this DevOps project, and grant `project-regular` as Maintainer.


Note that after the project-admin invites the member to the current DevOps project, in general, the resources (pipelines, credentials, etc.) created by the other members are visible to each other within the same group.

## Edit or Delete the DevOps Project

Choose **Project Management → Basic Info**, then click **···**, you will see the option for edit and delete button. It allows project admin to modify the basic information of this DevOps project.

![Edit or Delete the DevOps Project](/images/devops/create-devops-7.png)