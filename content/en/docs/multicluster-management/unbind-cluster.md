---
title: "Unbind a Cluster"
keywords: 'Kubernetes, KubeSphere, multicluster, hybrid-cloud'
description: 'Learn how to unbind a cluster from your cluster pool in KubeSphere.'
linkTitle: "Unbind a Cluster"
weight: 5500
---

This tutorial demonstrates how to unbind a cluster from the central control plane of KubeSphere.

## Prerequisites

- You have enabled multi-cluster management.
- You need a user granted a role including the authorization of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to a user.

## Unbind a Cluster
You can unbind a cluster by using either of the following methods:

**Method 1**

1. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. In the **Member Clusters** area, click <img src="/images/three-dots.png" width="20px"> on the right of the the cluster that you want to remove from the control plane, and then click **Unbind Cluster**.

3. In the **Unbind Cluster** dialog box that is displayed, read the risk alert carefully. If you still want to proceed, enter the name of the member cluster, and click **OK**.

**Method 2**

1. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. In the **Member Clusters** area, click the name of the member cluster that you want to remove from the control plane.

3. In the navigation tree on the left, select **Cluster Settings** > **Basic Information**.

4. In the **Cluster Information** area, click **Manage** > **Unbind Cluster**.

5. In the **Unbind Cluster** dialog box that is displayed, read the risk alert carefully. If you still want to proceed, enter the name of the member cluster, and click **OK**.

   {{< notice note >}}

   After you unbind the cluster, you cannot manage it from the control plane while Kubernetes resources on the cluster will not be deleted.

   {{</ notice >}} 

## Unbind an Unhealthy Cluster

On some occasions, you cannot unbind a cluster by following the steps above. For example, you import a cluster with the wrong credentials, and you cannot access **Cluster Settings**. In this case, execute the following command to unbind an unhealthy cluster:

```bash
kubectl delete cluster <cluster name>
```

