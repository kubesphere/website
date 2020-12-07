---
title: "Workspace Overview"
keywords: "Kubernetes, KubeSphere, workspace"
description: "This tutorial introduces the concept of workspace and demonstrates how to create and delete a workspace."

linkTitle: "Workspace Overview"
weight: 9100
---

A workspace is a logical unit to organize your [projects](../../project-administration/) and [DevOps projects](../../devops-user-guide/) and manage [app templates](../upload-helm-based-application/) and app repositories. It is the place for you to control resource access and share resources within your team in a secure way.

It is a best practice to create a new workspace for tenants (excluding cluster administrators). A same tenant can work in multiple workspaces, while a workspace allows multiple tenants to access it in different ways.

This tutorial demonstrates how to create and delete a workspace.

## Prerequisites

You have an account granted the role of `workspaces-manager`, such as `ws-manager` in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/).

## Create a Workspace

1. Log in the web console of KubeSphere as `ws-manager`. On the **Access Control** page, you can see all workspaces on the platform. By default, you have at least one workspace `system-workspace` in the list which contains all system projects.

2. Click **Create**.

   ![workspace-list](/images/docs/workspace-administration/workspace-overview/workspace-list.jpg)

3. On the **Basic Info** page, specify a name for the workspace and select a workspace manager from the list. Click **Create** to continue.

   ![provide-workspace-info](/images/docs/workspace-administration/workspace-overview/provide-workspace-info.jpg)

   - **Workspace Name**: Set a name for the workspace which serves as a unique identifier.
   - **Alias**: An alias name for the workspace.
   - **Workspace Manager**: The person who administrates the workspace.
   - **Description**: A brief introduction of the workspace.

4. A newly-created workspace displays in the list as below.

   ![created-workspace](/images/docs/workspace-administration/workspace-overview/created-workspace.jpg)

5. Click the workspace and you can see resource status in the workspace on the **Overview** page.

   ![workspace-overview](/images/docs/workspace-administration/workspace-overview/workspace-overview.jpg)

## Delete a Workspace

1. In your workspace, go to **Basic Info** under **Workspace Settings**. On the **Basic Info** page, you can see the general information of the workspace, such as the number of projects and members.

   ![workspace-basic-info](/images/docs/workspace-administration/workspace-overview/workspace-basic-info.jpg)

   {{< notice note >}}

   On this page, you can click **Edit Info** to change the basic information of the workspace (excluding the workspace name) and turn on/off [Network Isolation](../../workspace-administration/workspace-network-isolation/).

   {{</ notice >}} 

2. To delete the workspace, check **Sure to delete the workspace** and click **Delete**.

   ![delete-workspace](/images/docs/workspace-administration/workspace-overview/delete-workspace.jpg)

   {{< notice warning >}}

   A workspace cannot be restored after it is deleted and resources in the workspace will also be removed.

   {{</ notice >}}

   

