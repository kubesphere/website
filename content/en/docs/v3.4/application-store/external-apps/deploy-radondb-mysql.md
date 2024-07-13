---
title: "Deploy RadonDB MySQL Operator and RadonDB MySQL Cluster on KubeSphere"
keywords: 'KubeSphere, Kubernetes, Deploy, RadonDB MySQL'
description: 'Learn how to deploy RadonDB MySQL Operator and RadonDB MySQL Cluster on KubeSphere.'
linkTitle: "Deploy RadonDB MySQL Operator and Cluster"
weight: 14350
version: "v3.4"
---

[RadonDB MySQL](https://github.com/radondb/radondb-mysql-kubernetes) is an open source, cloud-native, and highly available cluster solution based on [MySQL](https://MySQL.org) database. With the Raft protocol, RadonDB MySQL enables fast failover without losing any transactions.

This tutorial demonstrates how to deploy RadonDB MySQL Operator and a RadonDB MySQL Cluster on KubeSphere.

## Prerequisites

- You need to enable [the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user for this tutorial. In this tutorial, you log in as `admin` and work in the project `demo-project` in the workspace `demo`. If they are not ready, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to enable the gateway in your project to provide external access. If they are not ready, refer to [Project Gateway](../../../project-administration/project-gateway/).

## Hands-on Lab

### Step 1: Add an app repository

1. Log in to the KubeSphere Web console.

2. In `demo` workspace, go to **App Repositories** under **App Management**, and then click **Create**.

3. In the dialog that appears, enter an app repository name and URL.

   Enter `radondb-mysql-operator` for the app repository name 。  
   Enter `https://radondb.github.io/radondb-mysql-kubernetes/` for the MeterSphere repository URL. Click **Validate** to verify the URL.

4. You will see a green check mark next to the URL if it is available. Click **OK** to continue.

   Your repository displays in the list after it is successfully imported to KubeSphere.

![certify URL](/images/docs/v3.x/appstore/external-apps/deploy-radondb-mysql/certify_url.png)

### Step 2: Deploy RadonDB MySQL Operator

1. In `demo-project`, go to **Apps** under **Application Workloads** and click **Deploy New App**.

2. In the dialog that appears, select **From App Template**.

3. On the new page that appears, select `radondb-mysql-operator` from the drop-down list.

4. Click **clickhouse-cluster**, check and config RadonDB MySQL Operator.  

   On the **Chart Files** tab, you can view the configuration and edit the `.yaml` files.  
   On the **Version** list, you can view the app versions and select a version.

   ![operator configuration](/images/docs/v3.x/appstore/external-apps/deploy-radondb-mysql/operator_yaml.png)

5. Click **Deploy**, go to the **Basic Information** page.  

   Confirm the app name, app version, and deployment location.

6. Click **Next** to continue, go to the **App Configuration** page.

   You can change the YAML file to customize settings.

7. Click **Deploy** to use the default settings.

   After a while, you can see the app is in the **Running** status.

### Step 3: Deploy a RadonDB MySQL cluster

You can refer to [RadonDB MySQL template](https://github.com/radondb/radondb-mysql-kubernetes/tree/main/config/samples) to deploy a cluster, or you can customize the yaml file to deploy a cluster.

Take `mysql_v1alpha1_mysqlcluster.yaml` template as an example to create a RadonDB MySQL cluster.

1. Hover your cursor over the hammer icon in the lower-right corner, and then select **Kubectl**.

2. Run the following command to install RadonDB MySQL cluster.

   ```kubectl
   kubectl apply -f https://github.com/radondb/radondb-mysql-kubernetes/releases/latest/download/mysql_v1alpha1_mysqlcluster.yaml --namespace=<project_name>
   ```

   {{< notice note >}}

   When no project is specified, the cluster will be installed in the `kubesphere-controls-system` project by default. To specify a project, the install command needs to add the `--namespace=<project_name>` field.

   {{</ notice >}}

   You can see the expected output as below if the installation is successful.

   ```powershell
   $ kubectl apply -f https://github.com/radondb/radondb-mysql-kubernetes/releases/latest/download/mysql_v1alpha1_mysqlcluster.yaml --namespace=demo-project
   mysqlcluster.mysql.radondb.com/sample created
   ```

3. You can run the following command to view all services of RadonDB MySQL cluster.

   ```kubectl
   kubectl get statefulset,svc
   ```

   **Expected output**

   ```powershell
   $ kubectl get statefulset,svc
   NAME                            READY   AGE
   statefulset.apps/sample-mysql   3/3     10m

   NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
   service/default-http-backend   ClusterIP   10.96.69.202    <none>        80/TCP     3h2m
   service/sample-follower        ClusterIP   10.96.9.162     <none>        3306/TCP   10m
   service/sample-leader          ClusterIP   10.96.255.188   <none>        3306/TCP   10m
   service/sample-mysql           ClusterIP   None            <none>        3306/TCP   10m
   ```

### Step 4: View RadonDB MySQL cluster status

1. In `demo-project` project，go to **Services** under **Application Workloads**, you can see the information of services.

2. In **Workloads** under **Application Workloads**, click the **StatefulSets** tab,  and you can see the StatefulSets are up and running.

   Click a single StatefulSet to go to its detail page. You can see the metrics in line charts over a period of time under the **Monitoring** tab.

3. In **Pods** under **Application Workloads**, you can see all the Pods are up and running.

4. In **Persistent Volume Claims** under **Storage**, you can see the ClickHouse Cluster components are using persistent volumes.

   Usage of the persistent volume is also monitored. Click a persistent volume to go to its detail page.

### Step 5: Access the RadonDB MySQL cluster

The following demonstrates how to access RadonDB MySQL in KubeSphere Web console. To access RadonDB MySQL from outside the cluster, please refer to [RadonDB MySQL open source project](https://github.com/radondb/radondb-mysql-kubernetes/).

**Method 1**

Go to the `demo-project` project management page, access RadonDB MySQL through the terminal.

1. Go to **Pods** under **Application Workloads**.

2. Click a pod name to go to the pod management page.

3. Under the **Container** column box in **Resource Status**, click the terminal icon for the **mysql** container.

4. In terminal window, run the following command to access the RadonDB MySQL cluster.

![Access RadonDB MySQL](/images/docs/v3.x/appstore/external-apps/deploy-radondb-mysql/pod_terminal.png)

**Method 2**

Hover your cursor over the hammer icon in the lower-right corner, and then select **Kubectl**.

Run the following command to access the RadonDB MySQL cluster.

```kubectl
kubectl exec -it <pod_name> -c mysql -n <project_name> -- mysql --user=<user_name> --password=<user_password>
```

{{< notice note >}}

In the blow command, `sample-mysql-0` is the Pod name and `demo-project` is the Project name. Make sure you use your own Pod name, project name, username, and password.

{{</ notice >}}

![Access RadonDB MySQL](/images/docs/v3.x/appstore/external-apps/deploy-radondb-mysql/kubectl_terminal.png)
