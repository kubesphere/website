---
title: "Deploy ClickHouse Operator and a ClickHouse Cluster on KubeSphere"
keywords: 'KubeSphere, Kubernetes, ClickHouse, ClickHouse Operator, ClickHouse Cluster'
description: 'Learn how to deploy ClickHouse Operator and a ClickHouse Cluster on KubeSphere.'
linkTitle: "Deploy RadonDB ClickHouse Operator and Cluster"
weight: 14340
version: "v3.4"
---

[ClickHouse](https://clickhouse.tech/) is a column-oriented database management system (DBMS) for online analytical processing of queries (OLAP). [RadonDB ClickHouse](https://github.com/radondb/radondb-clickhouse-kubernetes) is a deeply customized ClickHouse cluster application maintaining ClickHouse cluster functions and featuring automated cluster management, data redistribution in clusters, and excellent performance with less cost.

This tutorial demonstrates how to deploy ClickHouse Operator and a ClickHouse Cluster on KubeSphere.

## Prerequisites

- You need to enable [the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and two user accounts (`ws-admin` and `project-regular`) for this tutorial. The account `ws-admin` must be granted the role of `workspace-admin` in the workspace, and the account `project-regular` must be invited to the project with the role of `operator`. This tutorial uses `demo-workspace` and `demo-project` for demonstration. If they are not ready, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to enable the gateway in your project to provide external access. If they are not ready, refer to [Project Gateway](../../../project-administration/project-gateway/).

## Hands-on Lab

### Step 1: Deploy ClickHouse Operator

1. Log in to the KubeSphere Web console as `admin`, and use **Kubectl** from the **Toolbox** in the lower-right corner to run the following command to install ClickHouse Operator. It is recommended that you have at least two worker nodes available in your cluster.

   ```bash
   $ kubectl apply -f https://raw.githubusercontent.com/radondb/radondb-clickhouse-kubernetes/master/clickhouse-operator-install.yml
   ```

   {{< notice note >}}

   This command will install ClickHouse Operator in the namespace `kube-system`. Therefore, ClickHouse Operator only needs to be installed once in a Kubernetes cluster.

   {{</ notice >}}

2. You can see the expected output as below if the installation is successful.

   ```powershell
   $ kubectl apply -f https://raw.githubusercontent.com/radondb/radondb-clickhouse-kubernetes/main/clickhouse-operator-install.yml
   customresourcedefinition.apiextensions.k8s.io/clickhouseinstallations.clickhouse.radondb.com created
   customresourcedefinition.apiextensions.k8s.io/clickhouseinstallationtemplates.clickhouse.radondb.com created
   customresourcedefinition.apiextensions.k8s.io/clickhouseoperatorconfigurations.clickhouse.radondb.com created
   serviceaccount/clickhouse-operator created
   clusterrole.rbac.authorization.k8s.io/clickhouse-operator-kube-system created
   clusterrolebinding.rbac.authorization.k8s.io/clickhouse-operator-kube-system created
   configmap/etc-clickhouse-operator-files created
   configmap/etc-clickhouse-operator-confd-files created
   configmap/etc-clickhouse-operator-configd-files created
   configmap/etc-clickhouse-operator-templatesd-files created
   configmap/etc-clickhouse-operator-usersd-files created
   deployment.apps/clickhouse-operator created
   service/clickhouse-operator-metrics created
   ```
   
3. You can run the following command to view the status of ClickHouse Operator resources.

   ```bash
   $ kubectl get all --selector=app=clickhouse-operator -n kube-system
   ```

   Expected output:

   ```
   NAME                                      READY   STATUS    RESTARTS   AGE
   pod/clickhouse-operator-6b8494c8f-tmkmn   2/2     Running   0          6m34s
   
   NAME                                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
   service/clickhouse-operator-metrics   ClusterIP   10.233.51.66   <none>        8888/TCP   6m34s
   
   NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
   deployment.apps/clickhouse-operator   1/1     1            1           6m34s
   
   NAME                                            DESIRED   CURRENT   READY   AGE
   replicaset.apps/clickhouse-operator-6b8494c8f   1         1         1       6m34s
   ```

### Step 2: Add an app repository

1. Log out of KubeSphere and log back in as `ws-admin`. In `demo-workspace`, go to **App Repositories** under **App Management**, and then click **Add**.

2. In the dialog that appears, enter `clickhouse` for the app repository name and `https://radondb.github.io/radondb-clickhouse-kubernetes/` for the repository URL. Click **Validate** to verify the URL, and you will see a green check mark next to the URL if it is available. Click **OK** to continue.

3. Your repository will display in the list after it is successfully imported to KubeSphere.

### Step 3: Deploy a ClickHouse Cluster

1. Log out of KubeSphere and log back in as `project-regular`. In `demo-project`, go to **Apps** under **Application Workloads** and click **Create**.

2. In the dialog that appears, select **From App Template**.

3. On the new page that appears, select **clickhouse** from the drop-down list and then click **clickhouse-cluster**.

4. On the **Chart Files** tab, you can view the configuration and download the `values.yaml` file. Click **Install** to continue.

5. On the **Basic Information** page, confirm the app name, app version, and deployment location. Click **Next** to continue.

6. On the **App Settings** tab, you can change the YAML file to customize settings. In this tutorial, click **Install** to use the default settings.

7. After a while, you can see the app is in the **Running** status.

### Step 4: View ClickHouse cluster status

1. In **Workloads** under **Application Workloads**, click the **StatefulSets** tab,  and you can see the StatefulSets are up and running.

2. Click a single StatefulSet to go to its detail page. You can see the metrics in line charts over a period of time under the **Monitoring** tab.

3. In **Pods** under **Application Workloads**, you can see all the Pods are up and running.

4. In **Persistent Volume Claims** under **Storage**, you can see the ClickHouse Cluster components are using persistent volumes.

5. Usage of the persistent volume is also monitored. Click a persistent volume to go to its detail page.

6. On the **Overview** page of the project, you can see a list of resource usage in the current project.

### Step 5: Access the ClickHouse cluster

1. Log out of KubeSphere and log back in as `admin`. Hover your cursor over the hammer icon in the lower-right corner, and then select **Kubectl**.

2. In the window that appears, run the following command and then navigate to the username and password of the ClickHouse cluster.

   ```bash
   $ kubectl edit chi clickho-749j8s -n demo-project
   ```

   ![get-username-password](/images/docs/v3.x/appstore/external-apps/deploy-clickhouse/get-username-password.png)

   {{< notice note >}}

   In the above command, `clickho-749j8s` is the ClickHouse application name and `demo-project` is the project name. Make sure you use your own application name and project name.

   {{</ notice >}}

3. Run the following command to access the ClickHouse cluster, and then you can use command like `show databases` to interact with it.

   ```bash
   $ kubectl exec -it chi-clickho-749j8s-all-nodes-0-0-0 -n demo-project -- clickhouse-client --user=clickhouse --password=c1ickh0use0perator
   ```

   ![use-clickhouse](/images/docs/v3.x/appstore/external-apps/deploy-clickhouse/use-clickhouse.png)

   {{< notice note >}}

   In the above command, `chi-clickho-749j8s-all-nodes-0-0-0` is the Pod name and you can find it in **Pods** under **Application Workloads**. Make sure you use your own Pod name, project name, username, and password.

   {{</ notice >}}
