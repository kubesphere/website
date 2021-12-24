---
title: "在 KubeSphere 中部署 RadonDB MySQL Operator 和 RadonDB MySQL 集群"
keywords: 'KubeSphere, Kubernetes, 安装, RadonDB MySQL'
description: '了解如何从 KubeSphere 应用商店部署 RadonDB MySQL。'
linkTitle: "部署 RadonDB MySQL Operator 和集群"
weight: 14350
---

[RadonDB MySQL](https://github.com/radondb/radondb-mysql-kubernetes) 是基于 [MySQL](https://MySQL.org) 的开源、云原生、高可用集群解决方案。通过使用 Raft 协议，RadonDB MySQL 可以快速进行故障转移，且不会丢失任何事务。

本教程演示了如何在 KubeSphere 上部署 RadonDB MySQL Operator 和 RadonDB MySQL 集群。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保 KubeSphere 项目网关已开启外网访问。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

## 动手实验

### 步骤 1：添加应用仓库

1. 登录 KubeSphere 的 Web 控制台。

2. 在企业空间中，进入**应用管理**下的**应用仓库**页面，点击**添加**。

3. 在出现的对话框中，输入 `radondb-mysql-operator` 作为应用仓库名称，输入 `https://radondb.github.io/radondb-mysql-kubernetes/` 作为仓库的 URL。点击**验证**以验证 URL。在 URL 旁边呈现一个绿色的对号，验证通过后，点击**确定**继续。

4. 将仓库成功导入到 KubeSphere 之后，在列表中可查看 RadonDB MySQL 仓库。

### 步骤 2：部署 RadonDB MySQL Operator

1. 登录 KubeSphere 的 Web 控制台，并使用**工具箱**中的 **Kubectl** 执行以下命令来安装 ClickHouse Operator。建议至少准备 2 个可用集群节点。

2. 执行如下命令可查看 ClickHouse Operator 资源状态。

   ```bash
   $ kubectl get all --selector=app=clickhouse-operator -n kube-system
   ```
   **预期结果**
   ```
   NAME                                       READY   STATUS    RESTARTS   AGE
   pod/clickhouse-operator-644fcb8759-9tfcx   2/2     Running   0          4m32s
   
   NAME                                  TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
   service/clickhouse-operator-metrics   ClusterIP   10.96.72.49   <none>        8888/TCP   4m32s
   
   NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
   deployment.apps/clickhouse-operator   1/1     1            1           4m32s
   
   NAME                                             DESIRED   CURRENT   READY   AGE
   replicaset.apps/clickhouse-operator-644fcb8759   1         1         1       4m32s
   
   ```

### 步骤 3：部署 RadonDB MySQL 集群

1. 在 KubeSphere 的 Web 控制台。在 `demo-project` 项目中，进入**应用负载**下的**应用**页面，点击**创建**。

2. 在对话框中，选择**从应用模板**。

3. 从下拉菜单中选择 `clickhouse` 应用仓库 ，然后点击 **clickhouse-cluster**。

4. 在**Chart 文件**选项卡，可以直接通过控制台查看配置信息，也可以通过下载默认 `values.yaml` 文件查看。在**版本**列框下，选择一个版本号，点击**安装**以继续。

5. 在**基本信息**页面，确认应用名称、应用版本以及部署位置。点击**下一步**以继续。

6. 在**应用配置**页面，可以编辑 `values.yaml` 文件，也可以直接点击**安装**使用默认配置。

7. 等待 ClickHouse 集群正常运行。可在**工作负载**下的**应用**页面，查看部署的应用。

### 步骤 4：查看 RadonDB MySQL 集群状态

1. 以 `project-regular` 身份登录 KubeSphere 的 Web 控制台。

2. 进入**应用负载**下的**工作负载**页面，点击**有状态副本集**，查看集群状态。

   进入一个有状态副本集群详情页面，点击**监控**标签页，可查看一定时间范围内的集群指标。

3. 进入**应用负载**下的**容器组**页面，可查看所有状态的容器。

4. 进入**存储**下的**存储卷**页面，可查看存储卷，所有组件均使用了持久化存储。

   查看某个存储卷用量信息，以其中一个数据节点为例，可以看到当前存储的存储容量和剩余容量等监控数据。

5. 在项目**概览**页面，可查看当前项目资源使用情况。

### 步骤 5：访问 RadonDB MySQL 集群

1. 在 KubeSphere 的 Web 控制台，将鼠标悬停在右下角的锤子图标上，选择 **Kubectl**。

2. 打开终端窗口，执行如下命令，并输入 ClickHouse 集群用户名和密码。

   ```bash
   $ kubectl edit chi <app name> -n <project name>
   ```

   {{< notice note >}}

   以下命令示例中 **app name** 为 `clickhouse-app` ，**project name** 为 `demo-project`。

   {{</ notice >}}

   ![get-username-password](/images/docs/zh-cn/appstore/external-apps/deploy-clickhouse/get-username-password.png)

3. 执行如下命令，访问 ClickHouse 集群，并可通过 `show databases` 命令查看数据库。

   ```bash
   $ kubectl exec -it <pod name> -n <project name> -- clickhouse-client --user=<user name> --password=<user password>
   ```

   {{< notice note >}}

   - 以下命令示例中 **pod name** 为 `chi-clickhouse-app-all-nodes-0-1-0` ，**project name** 为 `demo-project`，**user name** 为 `clickhouse`，**password** 为  `clickh0use0perator`。

   - 可在**应用负载**的**容器组**下获取 **pod name**。

   {{</ notice >}}

   ![use-clickhouse](/images/docs/zh-cn/appstore/external-apps/deploy-clickhouse/use-clickhouse.png)
