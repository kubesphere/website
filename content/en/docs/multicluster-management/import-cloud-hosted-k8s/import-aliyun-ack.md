---
title: "Import an Aliyun ACK Cluster"
keywords: 'Kubernetes, KubeSphere, multicluster, Aliyun ACK'
description: 'How to import an Aliyun ACK Cluster'
titleLink: "Import an Aliyun ACK Cluster"
weight: 5310
---

This tutorial demonstrates how to import an Aliyun ACK cluster through the [direct connection](../../../multicluster-management/enable-multicluster/direct-connection/) method. If you want to use the agent connection method, refer to [Agent Connection](../../../multicluster-management/enable-multicluster/agent-connection/).

## Prerequisites

- You have a Kubernetes cluster with KubeSphere installed, and prepared this cluster as the Host Cluster. For more information about how to prepare a Host Cluster, refer to [Prepare a Host Cluster](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-host-cluster).
- You have an ACK cluster with KubeSphere installed to be used as the Member Cluster.

## Import an ACK Cluster

### Step 1: Prepare the ACK Member Cluster

1. In order to manage the Member Cluster from the Host Cluster, you need to make `jwtSecret` the same between them. Therefore, get it first by executing the following command on your Host Cluster.

   ```bash
   kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
   ```

   The output is similar to the following:

   ```yaml
   jwtSecret: "QVguGh7qnURywHn2od9IiOX6X8f8wK8g"
   ```

2. Log in to the KubeSphere console of the ACK cluster as `admin`. Click **Platform** in the upper left corner and then select **Clusters Management**.

3. Go to **CRDs**, input `ClusterConfiguration` in the search bar, and then press **Enter** on your keyboard. Click **ClusterConfiguration** to go to its detail page.

   ![search-config](/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/search-config.png)

4. Click the three dots on the right and then select **Edit YAML** to edit `ks-installer`. 

   ![click-edit](/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/click-edit.png)

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

Log in to the web console of Aliyun. Go to **Clusters** under **Container Service - Kubernetes**, click your cluster to go to its detail page, and then select the **Connection Information** tab. You can see the kubeconfig file under the **Public Access** tab. Copy the contents of the kubeconfig file.

![kubeconfig](/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/kubeconfig.png)

### Step 3: Import the ACK Member Cluster

1. Log in to the KubeSphere console on your Host Cluster as `admin`. Click **Platform** in the upper left corner and then select **Clusters Management**. On the **Clusters Management** page, click **Add Cluster**.

   ![click-add-cluster](/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/click-add-cluster.png)

2. Input the basic information based on your needs and click **Next**.

   ![input-info](/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/input-info.png)

3. In **Connection Method**, select **Direct connection to Kubernetes cluster**. Fill in the kubeconfig file of the ACK Member Cluster and then click **Import**.

   ![select-method](/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/select-method.png)

4. Wait for cluster initialization to finish.

   ![ack-cluster-imported](/images/docs/multicluster-management/import-cloud-hosted-k8s/import-ack/ack-cluster-imported.png)