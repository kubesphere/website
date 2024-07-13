---
title: "Manage a Multi-cluster Environment on KubeSphere"
keywords: 'Kubernetes, KubeSphere, federation, multicluster, hybrid-cloud'
description: 'Understand how to manage a multi-cluster environment on KubeSphere.'
linkTitle: "Manage a Multi-cluster Environment on KubeSphere"
weight: 16710
version: "v3.3"
---

KubeSphere provides an easy-to-use multi-cluster feature to help you [build your multi-cluster environment on KubeSphere](../../../multicluster-management/). This guide illustrates how to manage a multi-cluster environment on KubeSphere.

## Prerequisites

- Make sure your Kubernetes clusters are installed with KubeSphere before you use them as your Host Cluster and Member Clusters. 

- Make sure the cluster role is set correctly on your Host Cluster and Member Clusters respectively, and the `jwtSecret` is the same between them.

- It is recommended that your Member Cluster is in a clean environment where no resources have been created on it before it is imported to the Host Cluster.


## Manage your KubeSphere Multi-cluster Environment

Once you build a multi-cluster environment on KubeSphere, you can manage it through the central control plane from your Host Cluster. When creating resources, you can select a specific cluster while the Host Cluster should be avoided in case of overload. It is not recommended to log in to the KubeSphere web console of your Member Clusters to create resources on them as some resources (for example, workspaces) won't be synchronized to your Host Cluster for management.

### Resource Management

It is not recommended that you change a Host Cluster to a Member Cluster or the other way round. If a Member Cluster has been imported to a Host Cluster before, you have to use the same cluster name when importing it to a new Host Cluster after unbinding it from the previous Host Cluster.

If you want to import the Member Cluster to a new Host Cluster while retaining existing projects, you can follow the steps as below.

1. Run the following command on the Member Cluster to unbind the projects to be retained from your workspace.

   ```bash
   kubectl label ns <namespace> kubesphere.io/workspace- && kubectl patch ns <namespace>   -p '{"metadata":{"ownerReferences":[]}}' --type=merge
   ```

2. Run the following command on the Member Cluster to clear your workspace.

   ```bash
   kubectl delete workspacetemplate <workspace name>
   ```

3. When you create a workspace on the new Host Cluster and assign the Member Cluster to this workspace, run the following command on the Member Cluster to bind the projects retained for the workspace.

   ```bash
   kuebctl label ns <namespace> kubesphere.io/workspace=<workspace name>
   ```

### User Management

The users you create through the central control plane from your Host Cluster will be synchronized to Member Clusters. 

If you want to let different users access different clusters, you can create workspaces and [assign different clusters to them](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/). After that, you can invite different users to these workspaces per access requirements for these users.

### KubeSphere Components Management

KubeSphere provides some pluggable components that you can enable based on your needs. In a multi-cluster environment, you can choose to enable these components on your Host Cluster or Member Cluster.

For example, you only need to enable the App Store on your Host Cluster and you can use functions related to the App Store on your Member Clusters directly. For other components, when you enable them on your Host Cluster, you still have to manually enable the same components on your Member Cluster to implement the same features. Besides, you can also enable components only on your Member Cluster to implement corresponding features solely on your Member Cluster.

For more information about how to enable pluggable components, refer to [Enable Pluggable Components](../../../pluggable-components/).

