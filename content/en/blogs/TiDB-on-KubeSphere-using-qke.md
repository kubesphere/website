---
title: 'TiDB on KubeSphere: Using Cloud-Native Distributed Database on Kubernetes Platform Tailored for Hybrid Cloud'
keywords: Kubernetes, KubeSphere, TiDB, QingCloud Kubernetes Engine
description: This blog demonstrates how to add a PingCap repository to KubeSphere to deploy tidb-operator and tidb-cluster.
tag: 'TiDB, Kubernetes, QKE'
createTime: '2020-10-28'
author: 'Will, Feynman, Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/tidb-architecture.png'
---

![TiDB on KubeSphere](https://ap3.qingstor.com/kubesphere-website/docs/20201028212049.png)

In a world where Kubernetes has become the de facto standard to build application services that span multiple containers, running a cloud-native distributed database represents an important part of the experience of using Kubernetes. In this connection, [TiDB](https://docs.pingcap.com/tidb/dev/overview), a cloud-native, open-source NewSQL database that supports Hybrid Transactional and Analytical Processing (HTAP) workloads, meets those needs admirably. Its architecture is suitable for Kubernetes, and it is MySQL compatible. TiDB also features horizontal scalability, strong consistency, and high availability.

![tidb-architecture](https://ap3.qingstor.com/kubesphere-website/docs/tidb-architecture.png)

In addition to TiDB, I am also using KubeSphere [Container Platform](https://kubesphere.io/), an open-source distributed operating system that manages cloud-native applications with [Kubernetes](https://kubernetes.io/) as its kernel. It provides a plug-and-play architecture for the seamless integration of third-party applications to boost its ecosystem. [KubeSphere can be run anywhere](https://kubesphere.io/docs/introduction/what-is-kubesphere/#run-kubesphere-everywhere) as it is highly pluggable without any hacking into Kubernetes.

![KubeSphere-structure-comp](https://ap3.qingstor.com/kubesphere-website/docs/KubeSphere-structure-comp.png)

By combining TiDB with KubeSphere, we can have Kubernetes-powered TiDB clusters, and manage the clusters using a developer-friendly wizard web UI. In this post, I will demonstrate how to deploy TiDB on KubeSphere from scratch.

## Preparing Environments

As you can imagine, the very first thing to consider is to have a Kubernetes cluster so that you can deploy TiDB. Well, in this regard, the installation of Kubernetes may have haunted a large number of neophytes, especially the preparation of working machines, either physical or virtual. Besides, you also need to configure different network rules so that traffic can move smoothly among instances. Fortunately, QingCloud, the sponsor of KubeSphere, provides users with a highly functional platform that enables them to quickly deploy Kubernetes and KubeSphere at the same time (you can choose to deploy Kubernetes only). Namely, you only need to click few buttons and the platform will do the rest.

Therefore, I select QingCloud Kubernetes Engine (QKE) to prepare the environment. In fact, you can also use instances on the platform directly and [deploy a highly-available Kubernetes cluster with KubeSphere installed](https://kubesphere.io/docs/installing-on-linux/public-cloud/install-kubesphere-on-qingcloud-vms/). Here is how I deploy the cluster and TiDB:

1. Log in to the [web console of QingCloud](https://console.qingcloud.com/). Simply select **KubeSphere (QKE)** from the menu and create a Kubernetes cluster with KubeSphere installed. The platform allows you to install different components of KubeSphere. Here, we need to enable [OpenPitrix](https://github.com/openpitrix/openpitrix), which powers the app management feature in KubeSphere.

   {{< notice note >}}

   KubeSphere can be installed on any infrastructure. I just use QingCloud Platform as an example. See [KubeSphere Documentation](https://kubesphere.io/docs/) for more details.

   {{</ notice >}}

   ![qingcloud-kubernetes-engine](https://ap3.qingstor.com/kubesphere-website/docs/20201026173924.png)

2. The cluster will be up and running in around 10 minutes. In this example, I select 3 working nodes to make sure I have enough resources for the deployment later. You can also customize configurations based on your needs. When the cluster is ready, log in to the web console of KubeSphere with the default account and password (`admin/P@88w0rd`). Here is the cluster **Overview** page:

   ![cluster-management](https://ap3.qingstor.com/kubesphere-website/docs/20201026175447.png)

3. Use the built-in **Web Kubectl** from the Toolkit in the bottom-right corner to execute the following command to install TiDB Operator CRD:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/pingcap/tidb-operator/v1.1.6/manifests/crd.yaml
   ```

4. You can see the expected output as below:

   ```bash
   customresourcedefinition.apiextensions.k8s.io/tidbclusters.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/backups.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/restores.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/backupschedules.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbmonitors.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbinitializers.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbclusterautoscalers.pingcap.com created
   ```

5. Now, let's get back to the **Access Control** page where all the workspaces are listed. Before I proceed, first I need to create a new workspace (e.g. `dev-workspace`).

   In a workspace, different users have different permissions to perform varied tasks in projects. Usually, a department-wide project requires a multi-tenant system so that everyone is responsible for their own part. For demonstration purposes, I use the user `admin` in this example. You can [see the official documentation of KubeSphere](https://kubesphere.io/docs/quick-start/create-workspace-and-project/) to know more about how the multi-tenant system works.

   ![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/20201026192648.png)

6. Go to a workspace, and you can see that KubeSphere provides two methods to add Helm charts. This article only talks about the first one, which is adding an app repository in KubeSphere. Alternatively, you can also upload your own app templates and submit them to the KubeSphere App Store, which will be talked about in my next blog. Here, follow the images below to add the Helm repository of PingCap (https://charts.pingcap.org) in **App Repos**.

   ![app-repo](https://ap3.qingstor.com/kubesphere-website/docs/20201026192824.png)

   ![add-pingcap-repo](https://ap3.qingstor.com/kubesphere-website/docs/20201026193015.png)

## Deploying TiDB Operator

[TiDB Operator](https://github.com/pingcap/tidb-operator) is an automatic operation system for TiDB clusters in Kubernetes. It provides a full management life-cycle for TiDB, including deployment, upgrades, scaling, backup, fail-over, and configuration changes. With TiDB Operator, TiDB can run seamlessly in Kubernetes clusters deployed on public or private clouds. You need to first deploy TiDB Operator on KubeSphere.

1. Like I mentioned above, we need to create a project (i.e. namespace) first to run TiDB Operator.

   ![create-project](https://ap3.qingstor.com/kubesphere-website/docs/20201026193410.png)

2. After the project is created, navigate to **Applications** and click **Deploy New Application**.

   ![deploy-new-app](https://ap3.qingstor.com/kubesphere-website/docs/20201026193632.png)

3. Select **From App Templates**.

   ![app-template](https://ap3.qingstor.com/kubesphere-website/docs/20201026193657.png)

4. Switch to the PingCAP repository that stores multiple Helm charts. This article only demonstrates how to deploy TiDB Operator and TiDB clusters. You can also deploy other tools based on your needs.

   ![select-pingcap-repo](https://ap3.qingstor.com/kubesphere-website/docs/20201026193744.png)

5. Click tidb-operator and select **Chart Files**. You can view the configuration from the console directly or download the default `values.yaml` file. From the drop-down menu on the right, you can also select the version you want to install.

   ![deploying-tidb](https://ap3.qingstor.com/kubesphere-website/docs/20201027113228.png)

6. Confirm your app name, version and deployment location.

   ![deployment-info](https://ap3.qingstor.com/kubesphere-website/docs/20201027113416.png)

7. You can edit the `values.yaml` file in this step, or click **Deploy** directly with the default configurations.

   ![check-config-file](https://ap3.qingstor.com/kubesphere-website/docs/20201027113509.png)

8. In **Applications**, wait for TiDB Operator to be up and running.

   ![tidb-running](https://ap3.qingstor.com/kubesphere-website/docs/20201027131859.png)

9. In **Workloads**, you can see two **Deployments** created for TiDB Operator.

   ![tidb-deployment](https://ap3.qingstor.com/kubesphere-website/docs/20201027132001.png)

## Deploying a TiDB Cluster

The process of deploying a TiDB cluster is similar to deploying TiDB Operator.

1. Also from the PingCAP repository, select tidb-cluster.

   ![select-tidb-cluster](https://ap3.qingstor.com/kubesphere-website/docs/20201026200620.png)

2. Switch to **Chart Files** and download the **values.yaml** file.

   ![view-and-download-tidb-operator](https://ap3.qingstor.com/kubesphere-website/docs/20201027132136.png)

3. Some TiDB components require persistent volumes. In this regard, QingCloud Platform provides users with the following storage classes.

   ```
   / # kubectl get sc
   NAME                       PROVISIONER     RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
   csi-high-capacity-legacy   csi-qingcloud   Delete          Immediate           true                   71m
   csi-high-perf              csi-qingcloud   Delete          Immediate           true                   71m
   csi-ssd-enterprise         csi-qingcloud   Delete          Immediate           true                   71m
   csi-standard (default)     csi-qingcloud   Delete          Immediate           true                   71m
   csi-super-high-perf        csi-qingcloud   Delete          Immediate           true                   71m
   ```

4. As I installed KubeSphere through QingCloud Kubernetes Engine (QKE), all of these storage components were deployed automatically by default. The QingCloud CSI plugin implements an interface between [CSI](https://github.com/container-storage-interface/)-enabled Container Orchestrator (CO) and the storage of QingCloud. If you are interested in QingCloud CSI, have a look at their [GitHub repository](https://github.com/yunify/qingcloud-csi). Select csi-standard here by replacing the default value `local-storage` of the field `storageClassName` with `csi-standard` in `values.yaml`. In the downloaded file, you can replace all of them directly and copy and paste it to the `values.yaml` file.

   ![tidb-cluster-config](https://ap3.qingstor.com/kubesphere-website/docs/20201026204825.png){{< notice note >}}

   Only the field `storageClassName` is changed to provide external persistent storage. If you want to deploy each TiDB component, such as [TiKV](https://docs.pingcap.com/tidb/dev/tidb-architecture#tikv-server) and [Placement Driver](https://docs.pingcap.com/tidb/dev/tidb-architecture#placement-driver-pd-server), to individual nodes, specify the field `nodeAffinity`.

   {{</ notice >}} 

5. Click **Deploy** and you can see two apps in the list as shown below:

   ![tidb-cluster-app-ready](https://ap3.qingstor.com/kubesphere-website/docs/20201027132819.png)

## Viewing TiDB Cluster Status

Now that we have our apps ready, we may need to focus more on observability. KubeSphere gives users a straightforward view of how apps are doing during their whole lifecycle with different metrics available on the dashboard.

1. Verify that all TiDB cluster Deployments are up and running in **Workloads**.

   ![tidb-cluster-deployment-ready](https://ap3.qingstor.com/kubesphere-website/docs/20201027132450.png)

2. TiDB, TiKV and PD are all stateful applications, which can be found in **StatefulSets**. Note that TiKV and TiDB will be created automatically and it may take a while before they display in the list.

   ![tidb-statefulsets](https://ap3.qingstor.com/kubesphere-website/docs/20201027134239.png)

3. Click a single StatefulSet to display its detail page. This page shows metrics in line charts over a period of time. The following is an example of TiDB metrics:

   ![view-tidb-loads](https://ap3.qingstor.com/kubesphere-website/docs/20201027141426.png)

4. View TiKV loads:

   ![view-tikv-loads](https://ap3.qingstor.com/kubesphere-website/docs/20201027141541.png)

5. Relevant Pods are also listed. As you can see, your TiDB cluster contains three PD Pods, two TiDB Pods and three TiKV Pods.

   ![tidb-pod-list](https://ap3.qingstor.com/kubesphere-website/docs/20201027134634.png)

6. Go to the **Storage** section, and you can see TiKV and PD are using persistent storage.

   ![tidb-storage-usage](https://ap3.qingstor.com/kubesphere-website/docs/20201027133725.png)

7. Volume usage is also monitored. Here is an example of TiKV:

   ![tikv-volume-status](https://ap3.qingstor.com/kubesphere-website/docs/20201027141718.png)

8. On the **Overview** page, you can see a list of resource usage in the current project.

   ![tidb-project-resource-usage](https://ap3.qingstor.com/kubesphere-website/docs/20201027141916.png)

## Accessing TiDB Cluster

These services just created can be accessed easily as KubeSphere tells you how a service is being exposed on which port.

1. In **Services**, you can see detailed information of all services.

   ![tidb-in-service-list](https://ap3.qingstor.com/kubesphere-website/docs/20201027135010.png)

2. As the service type is set to `NodePort`, you can access it through the Node IP address outside the cluster.

3. Here is a test of the connection to the database through MySQL client.

   ```bash
   [root@k8s-master1 ~]# docker run -it --rm mysql bash
   
   [root@0d7cf9d2173e:/# mysql -h 192.168.1.102 -P 32682 -u root
   Welcome to the MySQL monitor.  Commands end with ; or \g.
   Your MySQL connection id is 201
   Server version: 5.7.25-TiDB-v4.0.6 TiDB Server (Apache License 2.0) Community Edition, MySQL 5.7 compatible
   
   Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.
   
   Oracle is a registered trademark of Oracle Corporation and/or its affiliates. Other names may be trademarks of their respective owners.
   
   Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
   
   mysql> show databases;
   +--------------------+
   | Database           |
   +--------------------+
   | INFORMATION_SCHEMA |
   | METRICS_SCHEMA     |
   | PERFORMANCE_SCHEMA |
   | mysql              |
   | test               |
   +--------------------+
   5 rows in set (0.01 sec)
   
   mysql> 
   ```

4. Besides, TiDB integrates Prometheus and Grafana to monitor performance of the database cluster. As we can see above, Grafana is being exposed through `NodePort`. After you configure necessary port forwarding rules and open its port in security groups on QingCloud Platform, you can access the Grafana UI to view metrics.

   ![grafana-in-KubeSphere](https://ap3.qingstor.com/kubesphere-website/docs/20201027141035.png)

## Summary

I hope you guys all have successfully deployed TiDB. Both TiDB and KubeSphere are powerful tools for cloud-native applications, so in fact, I cannot showcase every aspect of them all in this post. For example, the app deployment function has much to offer for cloud-native enthusiasts like me. I will post another article on how to deploy TiDB by uploading Helm charts to the KubeSphere App Store.

If you have any questions, don't hesitate to contact us in [Slack](https://join.slack.com/t/kubesphere/shared_invite/zt-1ilxbsp39-t4ES4xn5OI0eF5hvOoAhEw) or [GitHub](https://github.com/kubesphere).

## References

**KubeSphere GitHub**: https://github.com/kubesphere/kubesphere 

**TiDB GitHub**: https://github.com/pingcap/TiDB

**TiDB Operator Documentation**: https://docs.pingcap.com/tidb-in-kubernetes/stable/tidb-operator-overview

**KubeSphere Introduction**: https://kubesphere.io/docs/introduction/what-is-kubesphere/

**KubeSphere Documentation**: https://kubesphere.io/docs/
