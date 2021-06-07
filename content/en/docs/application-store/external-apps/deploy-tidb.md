---
title: "Deploy TiDB Operator and a TiDB Cluster on KubeSphere"
keywords: 'KubeSphere, Kubernetes, TiDB, TiDB Operator, TiDB Cluster'
description: 'Learn how to deploy TiDB Operator and a TiDB Cluster on KubeSphere.'
linkTitle: "Deploy TiDB Operator and a TiDB Cluster"
weight: 14320
---

[TiDB](https://en.pingcap.com/) is a cloud-native, open-source NewSQL database that supports Hybrid Transactional and Analytical Processing (HTAP) workloads. It features horizontal scalability, strong consistency, and high availability.

This tutorial demonstrates how to deploy TiDB Operator and a TiDB Cluster on KubeSphere.

## Prerequisites

- You need to have at least 3 schedulable nodes.
- You need to enable [the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and two user accounts (`ws-admin` and `project-regular`) for this tutorial. The account `ws-admin` must be granted the role of `workspace-admin` in the workspace, and the account `project-regular` must be invited to the project with the role of `operator`. If they are not ready, refer to [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Install TiDB Operator CRD

1. Log in to the KubeSphere Web console as `admin`, and use **Kubectl** from the **Toolbox** in the bottom-right corner to execute the following command to install TiDB Operator CRD:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/pingcap/tidb-operator/v1.1.6/manifests/crd.yaml
   ```

2. You can see the expected output as below:

   ```bash
   customresourcedefinition.apiextensions.k8s.io/tidbclusters.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/backups.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/restores.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/backupschedules.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbmonitors.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbinitializers.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbclusterautoscalers.pingcap.com created
   ```

### Step 2: Add an app repository

1. Log out of KubeSphere and log back in as `ws-admin`. In your workspace, go to **App Repositories** under **App Management**, and then click **Add**.

   ![add-repo](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/add-repo.PNG)

2. In the dialog that appears, enter `pingcap` for the app repository name and `https://charts.pingcap.org` for the PingCAP Helm repository URL. Click **Validate** to verify the URL and you will see a green check mark next to the URL if it is available. Click **OK** to continue.

   ![add-pingcap-repo](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/add-pingcap-repo.PNG)

3. Your repository displays in the list after successfully imported to KubeSphere.

   ![added-pingcap-repo](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/added-pingcap-repo.PNG)

### Step 3: Deploy TiDB Operator

1. Log out of KubeSphere and log back in as `project-regular`. In your project, go to **Apps** under **Application Workloads** and click **Deploy New App**.

   ![deploy-app](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/deploy-app.PNG)

2. In the dialog that appears, select **From App Templates**.

   ![from-app-templates](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/from-app-templates.PNG)

3. Select `pingcap` from the drop-down list, then click **tidb-operator**.

   ![click-tidb-operator](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/click-tidb-operator.PNG)

   {{< notice note >}}

   This tutorial only demonstrates how to deploy TiDB Operator and a TiDB cluster. You can also deploy other tools based on your needs.

   {{</ notice >}}

4. On the **Chart Files** tab, you can view the configuration from the console directly or download the default `values.yaml` file by clicking the icon in the upper-right corner. Under **Versions**, select a version number from the drop-down list and click **Deploy**.

   ![select-version](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/select-version.PNG)

5. On the **Basic Information** page, confirm the app name, app version, and deployment location. Click **Next** to continue.

   ![basic-info](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/basic-info.PNG)

6. On the **App Configurations** page, you can either edit the `values.yaml` file, or click **Deploy** directly with the default configurations.

   ![check-config-file](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/check-config-file.PNG)

7. Wait for TiDB Operator to be up and running.

   ![tidb-operator-running](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-operator-running.PNG)

8. Go to **Workloads**, and you can see two Deployments created for TiDB Operator.

   ![tidb-deployment](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-deployment.PNG)

### Step 4: Deploy a TiDB cluster

The process of deploying a TiDB cluster is similar to deploying TiDB Operator.

1. Go to **Apps** under **Application Workloads**, click **Deploy New App**, and then select **From App Templates**.

   ![deploy-app-again](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/deploy-app-again.PNG)

   ![from-app-templates-2](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/from-app-templates-2.PNG)

2. From the PingCAP repository, click **tidb-cluster**.

   ![click-tidb-cluster](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/click-tidb-cluster.PNG)

3. On the **Chart Files** tab, you can view the configuration and download the `values.yaml` file. Click **Deploy** to continue.

   ![download-yaml-file](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/download-yaml-file.PNG)

4. On the **Basic Information** page, confirm the app name, app version, and deployment location. Click **Next** to continue.

   ![tidb-cluster-info](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-cluster-info.PNG)

5. Some TiDB components require [persistent volumes](../../../cluster-administration/persistent-volume-and-storage-class/). You can run the following command to view your storage classes.

   ```
   $ kubectl get sc
   NAME                       PROVISIONER     RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
   csi-high-capacity-legacy   csi-qingcloud   Delete          Immediate           true                   71m
   csi-high-perf              csi-qingcloud   Delete          Immediate           true                   71m
   csi-ssd-enterprise         csi-qingcloud   Delete          Immediate           true                   71m
   csi-standard (default)     csi-qingcloud   Delete          Immediate           true                   71m
   csi-super-high-perf        csi-qingcloud   Delete          Immediate           true                   71m
   ```

6. On the **App Configurations** page, change all the default values of the field `storageClassName` from `local-storage` to the name of your storage class. For example, you can change them to `csi-standard` based on the above output.

   ![tidb-cluster-config](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-cluster-config.PNG)

   {{< notice note >}}

   Only the field `storageClassName` is changed to provide external persistent storage. If you want to deploy each TiDB component, such as [TiKV](https://docs.pingcap.com/tidb/dev/tidb-architecture#tikv-server) and [Placement Driver](https://docs.pingcap.com/tidb/dev/tidb-architecture#placement-driver-pd-server), to individual nodes, specify the field `nodeAffinity`.

   {{</ notice >}} 

7. Click **Deploy** and you can see two apps in the list as shown below:

   ![tidb-cluster-app-running](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-cluster-app-running.PNG)

### Step 5: View TiDB cluster status

1. Go to **Workloads** under **Application Workloads**, and verify that all TiDB cluster Deployments are up and running.

   ![tidb-cluster-deployments-running](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-cluster-deployments-running.PNG)

2. Switch to the **StatefulSets** tab, and you can see TiDB, TiKV and PD are up and running.

   ![tidb-statefulsets](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-statefulsets.PNG)

   {{< notice note >}}

   TiKV and TiDB will be created automatically and it may take a while before they display in the list.

   {{</ notice >}}

3. Click a single StatefulSet to go to its detail page. You can see the metrics in line charts over a period of time under the **Monitoring** tab.

   TiDB metrics:

   ![tidb-metrics](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-metrics.PNG)

   TiKV metrics:

   ![tikv-metrics](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tikv-metrics.PNG)

   PD metrics:

   ![pd-metrics](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/pd-metrics.PNG)

4. In **Pods** under **Application Workloads**, you can see the TiDB cluster contains two TiDB Pods, three TiKV Pods, and three PD Pods.

   ![tidb-pod-list](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-pod-list.PNG)

5. In **Volumes** under **Storage**, you can see TiKV and PD are using persistent volumes.

   ![tidb-storage-usage](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-storage-usage.PNG)

6. Volume usage is also monitored. Click a volume item to go to its detail page. Here is an example of TiKV:

   ![tikv-volume-status](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tikv-volume-status.PNG)

7. On the **Overview** page of the project, you can see a list of resource usage in the current project.

   ![tidb-project-resource-usage](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-project-resource-usage.PNG)

### Step 6: Access the TiDB cluster

1. Go to **Services** under **Application Workloads**, and you can see detailed information of all Services. As the Service type is set to `NodePort` by default, you can access it through the Node IP address outside the cluster.

   ![tidb-service](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-service.PNG)

3. TiDB integrates Prometheus and Grafana to monitor performance of the database cluster. For example, you can access Grafana through `<NodeIP>:<NodePort>` to view metrics.

   ![tidb-service-grafana](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-service-grafana.PNG)

   ![tidb-grafana](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-grafana.PNG)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.

   {{</ notice >}}

