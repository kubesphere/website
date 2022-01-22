---
title: "Import an Alibaba Cloud Kubernetes (ACK) Cluster"
keywords: 'Kubernetes, KubeSphere, multicluster, ACK'
description: 'Learn how to import an Alibaba Cloud Kubernetes cluster.'
titleLink: "Import an Alibaba Cloud Kubernetes (ACK) Cluster"
weight: 5310
---

This tutorial demonstrates how to import an Alibaba Cloud Kubernetes (ACK) cluster through the [direct connection](../../../multicluster-management/enable-multicluster/direct-connection/) method. If you want to use the agent connection method, refer to [Agent Connection](../../../multicluster-management/enable-multicluster/agent-connection/).

## Prerequisites

- You have a Kubernetes cluster with KubeSphere installed, and prepared this cluster as the host cluster. For more information about how to prepare a host cluster, refer to [Prepare a host cluster](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-host-cluster).
- You have an ACK cluster with KubeSphere installed to be used as the member cluster.

## Import an ACK Cluster

### Step 1: Prepare the ACK Member Cluster

1. In order to manage the member cluster from the host cluster, you need to make `jwtSecret` the same between them. Therefore, get it first by executing the following command on your host cluster.

   ```bash
   kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
   ```

   The output is similar to the following:

   ```yaml
   jwtSecret: "QVguGh7qnURywHn2od9IiOX6X8f8wK8g"
   ```

2. Log in to the KubeSphere console of the ACK cluster as `admin`. Click **Platform** in the upper-left corner and then select **Cluster Management**.

3. Go to **CRDs**, enter `ClusterConfiguration` in the search bar, and then press **Enter** on your keyboard. Click **ClusterConfiguration** to go to its detail page.

4. Click <img src="/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/three-dots.png" height="20px"> on the right and then select **Edit YAML** to edit `ks-installer`. 

5. In the YAML file of `ks-installer`, change the value of `jwtSecret` to the corresponding value shown above and set the value of `clusterRole` to `member`. Click **Update** to save your changes.

   ```yaml
   authentication:
     jwtSecret: QVguGh7qnURywHn2od9IiOX6X8f8wK8g
   ```

   ```yaml
   multicluster:
     clusterRole: member
   ```

   {{< notice note >}}

   Make sure you use the value of your own `jwtSecret`. You need to wait for a while so that the changes can take effect.

   {{</ notice >}}

### Step 2: Get the kubeconfig file

Log in to the web console of Alibaba Cloud. Go to **Clusters** under **Container Service - Kubernetes**, click your cluster to go to its detail page, and then select the **Connection Information** tab. You can see the kubeconfig file under the **Public Access** tab. Copy the contents of the kubeconfig file.

![kubeconfig](/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/kubeconfig.png)

### Step 3: Import the ACK member cluster

1. Log in to the KubeSphere console on your host cluster as `admin`. Click **Platform** in the upper-left corner and then select **Cluster Management**. On the **Cluster Management** page, click **Add Cluster**.

2. Enter the basic information based on your needs and click **Next**.

3. In **Connection Method**, select **Direct connection**. Fill in the kubeconfig file of the ACK member cluster and then click **Create**.

4. Wait for cluster initialization to finish.