---
title: "Projects and Multi-cluster Projects"
keywords: 'KubeSphere, Kubernetes, project, multicluster-project'
description: 'This tutorial introduces projects and multi-cluster projects.'

linkTitle: "Projects and Multi-cluster Projects"
weight: 13100
---

A project in KubeSphere is a Kubernetes [namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/), which is used to organize resources into non-overlapping groups. It represents a logical partitioning capability as it divides cluster resources between multiple tenants.

A multi-cluster project runs across clusters, empowering users to achieve high availability and isolate occurring issues to a certain cluster while not affecting your business. For more information, see [Multi-cluster Management](../../multicluster-management/).

This chapter demonstrates the basic operations of project administration, such as creation and deletion.

## Prerequisites

- You have an available workspace.
- You must have the authorization of **Projects Management**, which is included in the built-in role `workspace-self-provisioner`.
- You must enable the multi-cluster feature through [Direction Connection](../../multicluster-management/enable-multicluster/direct-connection/) or [Agent Connection](../../multicluster-management/enable-multicluster/agent-connection/) before you create a multi-cluster project.

## Projects

### Create a project

1. Go to the **Projects** page of a workspace and click **Create**.

    ![create-project](/images/docs/project-admin/create-project.jpg)

    {{< notice note >}}

- You can change the cluster where the project will be created on the **Cluster** drop-down list. The list is only visible after you enable the multi-cluster feature.
- If you cannot see the **Create** button, it means no cluster is available to use for your workspace. You need to contact the platform administrator or cluster administrator so that workspace resources can be created in the cluster. To assign a cluster to a workspace, the platform administrator or cluster administrator needs to edit [**Cluster Visibility**](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/) on the **Cluster Management** page.

    {{</ notice >}}

2. In the **Create Project** window that appears, enter a project name and add an alias or description if necessary. Select the cluster where the project will be created (this option does not appear if the multi-cluster feature is not enabled), and click **OK** to finish.

    ![create-project-page](/images/docs/project-admin/create-project-page.jpg)

3. A project created will display in the list as shown below. You can click the project name to go to its **Overview** page.

    ![project-list](/images/docs/project-admin/project-list.jpg)

### Edit project information

1. Navigate to **Basic Info** under **Project Settings** and click **Manage Project** on the right.

    ![basic-info-page](/images/docs/project-admin/basic-info-page.jpg)

2. Choose **Edit Info** from the drop-down menu.

    {{< notice note >}}

The project name cannot be edited. If you want to change other information, see relevant chapters in the documentation.

    {{</ notice >}}

### Delete a project

1. Navigate to **Basic Info** under **Project Settings** and click **Manage Project** on the right.

    ![basic-info-page](/images/docs/project-admin/basic-info-page.jpg)

2. Choose **Delete Project** from the drop-down menu.

3. In the dialog that appears, enter the project name and click **OK** to confirm the deletion.

    {{< notice warning >}}

A project cannot be recovered once deleted and resources in the project will be removed as well.

    {{</ notice >}}

## Multi-cluster Projects

### Create a multi-cluster project

1. Go to the **Projects** page of a workspace, choose **Multi-cluster Projects** and click **Create**.

    ![create-multicluster-project](/images/docs/project-admin/create-multicluster-project.jpg)

    {{< notice note >}}

- If you cannot see the **Create** button, it means no cluster is available to use for your workspace. You need to contact the platform administrator or cluster administrator so that workspace resources can be created in the cluster. To assign a cluster to a workspace, the platform administrator or cluster administrator needs to edit [**Cluster Visibility**](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/) on the **Cluster Management** page.
- Make sure at least two clusters are assigned to your workspace.

    {{</ notice >}}

2. In the **Create Multi-cluster Project** window that appears, enter a project name and add an alias or description if necessary. Select multiple clusters for your project by clicking **Add Cluster**, and click **OK** to finish.

    ![create-multicluster-project-page](/images/docs/project-admin/create-multicluster-project-page.jpg)

3. A multi-cluster project created will display in the list as shown below. You can click the project name to go to its **Overview** page.

    ![multicluster-project-list](/images/docs/project-admin/multicluster-project-list.jpg)

### Edit multi-cluster project information

1. Navigate to **Basic Info** under **Project Settings** and click **Manage Project** on the right.

    ![basic-info-multicluster](/images/docs/project-admin/basic-info-multicluster.jpg)

2. Choose **Edit Info** from the drop-down menu.

    {{< notice note >}}

The project name cannot be edited. If you want to change other information, see relevant chapters in the documentation.

    {{</ notice >}}

### Delete a multi-cluster project

1. Navigate to **Basic Info** under **Project Settings** and click **Manage Project** on the right.

    ![basic-info-multicluster](/images/docs/project-admin/basic-info-multicluster.jpg)

2. Choose **Delete Project** from the drop-down menu.

3. In the dialog that appears, enter the project name and click **OK** to confirm the deletion.

    {{< notice warning >}}

A multi-cluster project cannot be recovered once deleted and resources in the project will be removed as well.

    {{</ notice >}}
