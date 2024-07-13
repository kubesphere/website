---
title: "Projects and Multi-cluster Projects"
keywords: 'KubeSphere, Kubernetes, project, multicluster-project'
description: 'Learn how to create different types of projects.'
linkTitle: "Projects and Multi-cluster Projects"
weight: 13100
version: "v3.3"
---

A project in KubeSphere is a Kubernetes [namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/), which is used to organize resources into non-overlapping groups. It represents a logical partitioning capability as it divides cluster resources between multiple tenants.

A multi-cluster project runs across clusters, empowering users to achieve high availability and isolate occurring issues to a certain cluster while not affecting your business. For more information, see [Multi-cluster Management](../../multicluster-management/).

This tutorial demonstrates how to manage projects and multi-cluster projects.

## Prerequisites

- You need to create a workspace and a user (`project-admin`). The user must be invited to the workspace with the role of `workspace-self-provisioner`. For more information, see [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).
- You must enable the multi-cluster feature through [Direction Connection](../../multicluster-management/enable-multicluster/direct-connection/) or [Agent Connection](../../multicluster-management/enable-multicluster/agent-connection/) before you create a multi-cluster project.

## Projects

### Create a project

1. Go to the **Projects** page of a workspace and click **Create** on the **Projects** tab.

    {{< notice note >}}

- You can change the cluster where the project will be created on the **Cluster** drop-down menu. The list is only visible after you enable the multi-cluster feature.
- If you cannot see the **Create** button, it means no cluster is available to use for your workspace. You need to contact the platform administrator or cluster administrator so that workspace resources can be created in the cluster. [To assign a cluster to a workspace](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/), the platform administrator or cluster administrator needs to edit **Cluster Visibility** on the **Cluster Management** page.

    {{</ notice >}}

2. In the **Create Project** window that appears, enter a project name and add an alias or description if necessary. Under **Cluster**, select the cluster where the project will be created (this option does not appear if the multi-cluster feature is not enabled), and click **OK**.

3. A project created will display in the list. You can click the project name to go to its **Overview** page.

### Edit a project

1. Go to your project, navigate to **Basic Information** under **Project Settings** and click **Manage** on the right.

2. Choose **Edit Information** from the drop-down menu.
   
    {{< notice note >}}

The project name cannot be edited. If you want to change other information, see relevant tutorials in the documentation.

{{</ notice >}}

3. To delete a project, choose **Delete** from the drop-down menu. In the dialog that appears, enter the project name and click **OK** to confirm the deletion.

{{< notice warning >}}

A project cannot be recovered once deleted and resources in the project will be removed.

{{</ notice >}}

## Multi-cluster Projects

### Create a multi-cluster project

1. Go to the **Projects** page of a workspace, click the **Multi-cluster Projects** tab and click **Create**.

    {{< notice note >}}

- If you cannot see the **Create** button, it means no cluster is available to use for your workspace. You need to contact the platform administrator or cluster administrator so that workspace resources can be created in the cluster. [To assign a cluster to a workspace](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/), the platform administrator or cluster administrator needs to edit **Cluster Visibility** on the **Cluster Management** page.
- Make sure at least two clusters are assigned to your workspace.

    {{</ notice >}}

2. In the **Create Multi-cluster Project** window that appears, enter a project name and add an alias or description if necessary. Under **Clusters**, select multiple clusters for your project by clicking **Add Cluster**, and then click **OK**.
3. A multi-cluster project created is displayed in the list. Click <img src="/images/docs/v3.x/common-icons/three-dots.png" width="15" alt="icon" /> on the right of a multi-cluster project to select an operation from the drop-down menu:

   - **Edit Information**: Edit the basic information of a multi-cluster project.
   - **Add Cluster**: Select a cluster from the drop-down list in the displayed dialog box and click **OK** to add a cluster to a multi-cluster project.
   - **Delete**: Delete a multi-cluster project.

### Edit a multi-cluster project

1. Go to your multi-cluster project, navigate to **Basic Information** under **Project Settings** and click **Manage** on the right.

2. Choose **Edit Information** from the drop-down menu.

    {{< notice note >}}

The project name cannot be edited. If you want to change other information, see relevant tutorials in the documentation.

{{</ notice >}}

3. To delete a multi-cluster project, choose **Delete Project** from the drop-down menu. In the dialog that appears, enter the project name and click **OK** to confirm the deletion.

{{< notice warning >}}

A multi-cluster project cannot be recovered once deleted and resources in the project will be removed.

{{</ notice >}}
