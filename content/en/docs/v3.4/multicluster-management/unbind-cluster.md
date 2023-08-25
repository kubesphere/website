---
title: "Remove a Member Cluster"
keywords: 'Kubernetes, KubeSphere, multicluster, hybrid-cloud'
description: 'Learn how to remove a member cluster from your cluster pool in KubeSphere.'
linkTitle: "Remove a Member Cluster"
weight: 5500
---

This tutorial demonstrates how to remove a member cluster on the KubeSphere web console.

## Prerequisites

- You have enabled multi-cluster management.
- You need a user granted a role including the authorization of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to a user.

## Remove a Cluster

You can remove a cluster by using either of the following methods:

**Method 1**

1. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. In the **Member Clusters** area, click <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" /> on the right of the the cluster that you want to remove from the control plane, and then click **Remove Cluster**.

3. In the **Remove Cluster** dialog box that is displayed, read the risk alert carefully. If you still want to proceed, enter the name of the member cluster, and click **OK**.

**Method 2**

1. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. In the **Member Clusters** area, click the name of the member cluster that you want to remove from the control plane.

3. In the navigation tree on the left, select **Cluster Settings** > **Basic Information**.

4. In the **Cluster Information** area, click **Manage** > **Remove Cluster**.

5. In the **Remove Cluster** dialog box that is displayed, read the risk alert carefully. If you still want to proceed, enter the name of the member cluster, and click **OK**.

   {{< notice warning >}}

   * After the member cluster has been removed, existing resources of the removed member cluster will not be automatically cleaned up.

   * After the member cluster has been removed, multi-cluster configuration data of the removed member cluster will not be automatically cleaned up, which results in data loss when you uninstall KubeSphere or delete associated resources.

   {{</ notice >}} 

6. Run the following command to clean up multi-cluster configuration data of the removed member cluster:

   ```bash
   for ns in $(kubectl get ns --field-selector status.phase!=Terminating -o jsonpath='{.items[*].metadata.name}'); do kubectl label ns $ns kubesphere.io/workspace- && kubectl patch ns $ns --type merge -p '{"metadata":{"ownerReferences":[]}}'; done
   ```

## Remove an Unhealthy Cluster

On some occasions, you cannot remove a cluster by following the steps above. For example, you import a cluster with the wrong credentials, and you cannot access **Cluster Settings**. In this case, execute the following command to remove an unhealthy cluster:

```bash
kubectl delete cluster <cluster name>
```

