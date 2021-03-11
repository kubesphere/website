---
title: "在 KubeSphere 中部署 TiDB Operator 和 TiDB 集群"
keywords: 'KubeSphere, Kubernetes, TiDB, TiDB Operator, TiDB 集群'
description: '如何在 KubeSphere 中部署 TiDB Operator 和 TiDB 集群'
linkTitle: "部署 TiDB Operator 和 TiDB 集群"
weight: 14320
---

[TiDB](https://en.pingcap.com/) 是一个支持混合事务和分析处理 (HTAP) 工作负载的云原生、开源 NewSQL 数据库，具有弹性伸缩性、强一致性以及高可用性。

本教程演示了如何在 KubeSphere 上部署 TiDB Operator 和 TiDB 集群。

## 准备工作

- 您需要启用 [OpenPitrix 系统](../../../pluggable-components/app-store/).
- 您需要为本教程创建一个企业空间、一个项目和两个帐户（`ws-admin` 和 `project-regular`）。帐户 `ws-admin` 必须在企业空间中被赋予 `workspace-admin` 的角色，帐户 `project-regular` 必须被邀请至项目中赋予 `operator` 的角色。若还未创建好，请参考[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：安装 TiDB Operator CRD

1. 以 `admin` 身份登录 KubeSphere 的 Web 控制台，使用右下角**工具箱**中的 **Kubectl** 执行以下命令来安装 TiDB Operator CRD：

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/pingcap/tidb-operator/v1.1.6/manifests/crd.yaml
   ```

2. 预期的输出如下所示：

   ```bash
   customresourcedefinition.apiextensions.k8s.io/tidbclusters.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/backups.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/restores.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/backupschedules.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbmonitors.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbinitializers.pingcap.com created
   customresourcedefinition.apiextensions.k8s.io/tidbclusterautoscalers.pingcap.com created
   ```

### 步骤 2：添加应用仓库

1. 登出 KubeSphere，再以 `ws-admin` 身份登录。在您的企业空间中，访问**应用管理**下的**应用仓库**，然后点击**添加仓库**。

   ![add-repo](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/add-repo.PNG)

2. 在出现的对话框中，输入 `pingcap` 作为应用仓库名称，输入 `https://charts.pingcap.org` 作为 PingCAP Helm 仓库的 URL。点击**验证**以验证 URL，如果可用，您将会在 URL 旁边看到一个绿色的对号。点击**确定**以继续。

   ![add-pingcap-repo](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/add-pingcap-repo.PNG)

3. 将仓库成功导入到 KubeSphere 之后，它将显示在列表中。

   ![added-pingcap-repo](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/added-pingcap-repo.PNG)

### 步骤 3：部署 TiDB Operator

1. 登出 KubeSphere，再以 `project-regular` 身份登录。在您的项目中，访问**应用负载**下的**应用**，点击**部署新应用**。

   ![deploy-app](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/deploy-app.PNG)

2. 在出现的对话框中，选择**来自应用模板**。

   ![from-app-templates](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/from-app-templates.PNG)

3. 从下拉菜单中选择 `pingcap`，然后点击 **tidb-operator**。

   ![click-tidb-operator](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/click-tidb-operator.PNG)

   {{< notice note >}}

   本教程仅演示如何部署 TiDB Operator 和 TiDB 集群。您也可以按需部署其他工具。

   {{</ notice >}}

4. 在**配置文件**选项卡，您可以直接从控制台查看配置，也可以通过点击右上角的图标以下载默认 `values.yaml` 文件。在**版本**下，从下拉菜单中选择一个版本号，点击**部署**。

   ![select-version](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/select-version.PNG)

5. 在**基本信息**页面，确认应用名称、应用版本以及部署位置。点击**下一步**以继续。

   ![basic-info](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/basic-info.PNG)

6. 在**应用配置**页面，您可以编辑 `values.yaml` 文件，也可以直接点击**部署**使用默认配置。

   ![check-config-file](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/check-config-file.PNG)

7. 等待 TiDB Operator 正常运行。

   ![tidb-operator-running](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-operator-running.PNG)

8. 访问工作负载，可以看到为 TiDB Operator 创建的两个部署。

   ![tidb-deployment](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-deployment.PNG)

### 步骤 4：部署 TiDB 集群

部署 TiDB 集群的过程与部署 TiDB Operator 的过程相似。

1. 访问**应用负载**下的**应用**，再次点击**部署新应用**，然后选择**来自应用模板**。

   ![deploy-app-again](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/deploy-app-again.PNG)

   ![from-app-templates-2](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/from-app-templates-2.PNG)

2. 从 PingCAP 仓库中，点击 **tidb-cluster**。

   ![click-tidb-cluster](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/click-tidb-cluster.PNG)

3. 在**配置文件**选项卡，可以查看配置和下载 `values.yaml` 文件。点击**部署**以继续。

   ![download-yaml-file](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/download-yaml-file.PNG)

4. 在**基本信息**页面，确认应用名称、应用版本和部署位置。点击**下一步**以继续。

   ![tidb-cluster-info](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-cluster-info.PNG)

5. 一些 TiDB 组件需要[持久卷](../../../cluster-administration/persistent-volume-and-storage-class/)。您可以运行以下命令查看存储类型。

   ```
   / # kubectl get sc
   NAME                       PROVISIONER     RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
   csi-high-capacity-legacy   csi-qingcloud   Delete          Immediate           true                   71m
   csi-high-perf              csi-qingcloud   Delete          Immediate           true                   71m
   csi-ssd-enterprise         csi-qingcloud   Delete          Immediate           true                   71m
   csi-standard (default)     csi-qingcloud   Delete          Immediate           true                   71m
   csi-super-high-perf        csi-qingcloud   Delete          Immediate           true                   71m
   ```

6. 在应用配置页面，将字段 `storageClassName` 的默认值从 `local-storage` 更改为您的存储类型名称。例如，您可以根据以上输出将其更改为  `csi-qingcloud`。

   ![tidb-cluster-config](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-cluster-config.PNG)

   {{< notice note >}}

   只有字段 `storageClassName` 被更改为提供外部持久化存储。若想在单个节点上部署每个 TiDB 组件（例如 [TiKV](https://docs.pingcap.com/tidb/dev/tidb-architecture#tikv-server) 和 [Placement Driver](https://docs.pingcap.com/tidb/dev/tidb-architecture#placement-driver-pd-server)），请指定 `nodeAffinity` 字段。

   {{</ notice >}} 

7. 点击**部署**，然后就可以在列表中看到如下所示的两个应用：

   ![tidb-cluster-app-running](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-cluster-app-running.PNG)

### 步骤 5：查看 TiDB 集群状态

1. 访问**应用负载**下的**工作负载**，确认所有的 TiDB 集群部署都在正常运行。

   ![tidb-cluster-deployments-running](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-cluster-deployments-running.PNG)

2. Switch to the **StatefulSets** tab, and you can see TiDB, TiKV and PD are up and running.切换到**有状态副本集**选项卡，可以看到 TiDB、TiKV 和 PD 均正常运行。

   ![tidb-statefulsets](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-statefulsets.PNG)

   {{< notice note >}}

   TiKV 和 TiDB 会自动创建，可能要过一段时间才能在列表中显示。

   {{</ notice >}}

3. Click a single StatefulSet to go to its detail page. You can see the metrics in line charts over a period of time under the **Monitoring** tab.点击单个有状态副本集以访问其详情页。在**监控**选项卡下，可以看到一段时间内的折线图中的指标。

   TiDB 指标：

   ![tidb-metrics](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-metrics.PNG)

   TiKV 指标：

   ![tikv-metrics](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tikv-metrics.PNG)

   PD 指标：

   ![pd-metrics](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/pd-metrics.PNG)

4. In **Pods** under **Application Workloads**, you can see the TiDB cluster contains two TiDB Pods, three TiKV Pods, and three PD Pods.在**应用负载**下的**容器组**中，可以看到 TiDB 集群包含两个

   ![tidb-pod-list](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-pod-list.PNG)

5. In **Volumes** under **Storage**, you can see TiKV and PD are using persistent volumes.

   ![tidb-storage-usage](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-storage-usage.PNG)

6. Volume usage is also monitored. Click a volume item to go to its detail page. Here is an example of TiKV:

   ![tikv-volume-status](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tikv-volume-status.PNG)

7. On the **Overview** page of the project, you can see a list of resource usage in the current project.

   ![tidb-project-resource-usage](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-project-resource-usage.PNG)

### 步骤 6：Access the TiDB cluster

1. Go to **Services** under **Application Workloads**, and you can see detailed information of all Services. As the Service type is set to `NodePort` by default, you can access it through the Node IP address outside the cluster.

   ![tidb-service](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-service.PNG)

3. TiDB integrates Prometheus and Grafana to monitor performance of the database cluster. For example, you can access Grafana through `{$NodeIP}:{Nodeport}` to view metrics.

   ![tidb-service-grafana](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-service-grafana.PNG)

   ![tidb-grafana](/images/docs/appstore/external-apps/deploy-tidb-operator-and-cluster/tidb-grafana.PNG)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.

   {{</ notice >}}

