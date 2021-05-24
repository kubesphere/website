---
title: "View Resource Consumption"
keywords: "Kubernetes, KubeSphere, metering, billing, consumption"
description: "Track information about resource usage of your cluster's workloads at different levels."
linkTitle: "View Resource Consumption"
weight: 15410
---

KubeSphere metering helps you track resource consumption within a given cluster or workspace at a granular level. Different tenants with different roles can only see the data to which they have access. Besides, you can also set prices for varied resources to see billing information.

## Prerequisites 

- The **Metering and Billing** section is accessible to all tenants while the information visible to each of them may be different depending on what roles they have at what level. Note that metering is not a pluggable component of KubeSphere, which means you can use it as long as you have a KubeSphere cluster. For a newly created cluster, you need to wait for about 1 hour to see metering information.
- To see billing information, you need to [enable it first](../enable-billing/).

## View Cluster Resource Consumption 

**Cluster Resource Consumption** contains resource usage information of clusters (and nodes included), such as CPU, memory and storage.

1. Log in to the KubeSphere console as `admin`, click the hammer icon in the bottom right corner and select **Metering and Billing**.

2. Click **View Consumption** in the **Cluster Resource Consumption** section.

3. On the left side of the dashboard, you can see a cluster list containing your Host Cluster and all Member Clusters if you have enabled [multi-cluster management](../../../multicluster-management/). There is only one cluster called `default` in the list if it is not enabled.

   ![cluster-page](/images/docs/toolbox/metering-and-billing/view-resource-consumption/cluster-page.png)

   On the right side, there are three parts showing resource consumption in different ways.

   ### Overview

   The top part displays a consumption overview of different resources in a cluster since its creation. You can also see the billing information if you [have set prices for these resources](../enable-billing/) in the ConfigMap `kubesphere-config`.

   ### Consumption by Yesterday

   The middle part shows the total resource consumption by yesterday while you can also customize the time range and internal to see data within a specific period.

   ### Current Resources Included

   The bottom part displays the consumption of resources included in the selected target object (in this case, all nodes in the selected cluster) over the last hour.

4. You can click a cluster on the left and dive deeper into a node or Pod to see detailed consumption information.

   ![node-page](/images/docs/toolbox/metering-and-billing/view-resource-consumption/node-page.png)
   
   ![pod-page](/images/docs/toolbox/metering-and-billing/view-resource-consumption/pod-page.png)
   
   {{< notice note >}}
   
   To export the metering and billing data of an object as a CSV file, check the box on the left and click **✓**.
   
   {{</ notice >}} 

## View Workspace (Project) Resource Consumption

**Workspace (Project) Resource Consumption** contains resource usage information of workspaces (and projects included), such as CPU, memory and storage.

1. Log in to the KubeSphere console as `admin`, click the hammer icon in the bottom right corner and select **Metering and Billing**.

2. Click **View Consumption** in the **Workspace (Project) Resource Consumption** section.

3. On the left side of the dashboard, you can see a list containing all the workspaces in the current cluster. The right part displays detailed consumption information in the selected workspace, the layout of which is basically the same as that of a cluster.

   ![workspace-page](/images/docs/toolbox/metering-and-billing/view-resource-consumption/workspace-page.png)

   {{< notice note >}}

   In a multi-cluster architecture, you cannot see the metering and billing information of a workspace if it does not have any available cluster assigned to it. For more information, see [Cluster Visibility and Authorization](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/).

   {{</ notice >}} 

4. Click a workspace on the left and dive deeper into a project or workload (for example, Deployment and StatefulSet) to see detailed consumption information.

   ![project-page](/images/docs/toolbox/metering-and-billing/view-resource-consumption/project-page.png)

   ![workload-page](/images/docs/toolbox/metering-and-billing/view-resource-consumption/workload-page.png)