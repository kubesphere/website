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

1. Click **Platform** in the top-left corner and select **Cluster Management**.

2. On the **Cluster Management** page, click the cluster that you want to remove from the central control plane.

   ![cluster-management](/images/docs/multicluster-management/unbind-a-cluster/cluster-management.png)

3. Go to **Basic Information** under **Cluster Settings**, check **I confirm I want to unbind the cluster** and click **Unbind**.

   ![unbind-cluster](/images/docs/multicluster-management/unbind-a-cluster/unbind-cluster.png)

   {{< notice note >}}

   After you unbind the cluster, you cannot manage it from the control plane while Kubernetes resources on the cluster will not be deleted.

   {{</ notice >}} 

## Unbind an Unhealthy Cluster

On some occasions, you cannot unbind a cluster by following the steps above. For example, you import a cluster with the wrong credentials and you cannot access **Cluster Settings**. In this case, execute the following command to unbind an unhealthy cluster:

```bash
kubectl delete cluster <cluster name>
```

