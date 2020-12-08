---
title: "Cluster Visibility and Authorization"
keywords: "Cluster Visibility, Cluster Management"
description: "Cluster Visibility"

linkTitle: "Cluster Visibility and Authorization"
weight: 8610
---

## Objective
This guide demonstrates how to set up cluster visibility. You can limit which clusters workspace can use with cluster visibility settings.

## Prerequisites
* You need to enable [Multi-cluster Management](/docs/multicluster-management/enable-multicluster/direct-connection/).
* You need to create at least one workspace.

## Set cluster visibility

In KubeSphere, clusters can be authorized to multiple workspaces, and workspaces can also be associated with multiple clusters.

### Set up available clusters when creating workspace

1. Log in to an account that has permission to create a workspace, such as `ws-manager`.
2. Open the **Platform** menu to enter the **Access Control** page, and then enter the **Workspaces** list page from the sidebar.
3. Click the **Create** button.
4. Fill in the form and click the **Next** button.
5. Then you can see a list of clusters, and you can check to set which clusters workspace can use.
![create-workspace.png](/images/docs/cluster-administration/create-workspace.png)
6. After the workspace is created, the members of the workspace can use the resources in the associated cluster.
![create-project.png](/images/docs/cluster-administration/create-project.png)

{{< notice warning >}}

Please try not to create resources on the host cluster to avoid excessive loads, which can lead to a decrease in the stability across clusters.

{{</ notice >}} 

### Set cluster visibility after the workspace is created

After the workspace is created, you can also add or cancel the cluster authorization. Please follow the steps below to adjust the visibility of a cluster.

1. Log in to an account that has permission to manage clusters, such as `cluster-manager`.
2. Open the **Platform** menu to enter the **Clusters Management** page, and then Click a cluster to enter the Single **Cluster Management** page.
3. Expand the **Cluster Settings** sidebar and click on the **Cluster Visibility** menu.
4. You can see the list of authorized workspaces.
5. Click the **Edit Visibility** button to set the cluster authorization scope by adjusting the position of the workspace in the **Authorized/Unauthorized** list.
![cluster-visibility-settings-1.png](/images/docs/cluster-administration/cluster-visibility-settings-1.png)
![cluster-visibility-settings-2.png](/images/docs/cluster-administration/cluster-visibility-settings-2.png)

### Public cluster

You can check **Set as public cluster** when setting cluster visibility.

A public cluster means all platform users can access the cluster, in which they are able to create and schedule resources.
