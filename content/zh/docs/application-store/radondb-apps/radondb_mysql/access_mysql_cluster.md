---
title: "在 KubeSphere 中访问 RadonDB MySQL"
keywords: 'KubeSphere, Kubernetes, 访问, RadonDB MySQL'
description: '了解如何从 KubeSphere 访问 RadonDB MySQL。'
linkTitle: "访问数据库"
weight: 14522
---



本教程演示了如何在 KubeSphere 上访问 MySQL 数据库。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，应用安装在在企业空间 `demo-workspace` 中的 `demo-project` 项目中。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保 KubeSphere 项目网关已开启外网访问。有关更多信息，请参见[项目网关](https://kubesphere.io/zh/docs/project-administration/project-gateway/)。

## 通过 KubeSphere 平台访问

以下演示在 KubeSphere 平台访问 RadonDB MySQL 的方式。

### 方式 1：通过 mysql 终端

进入 `demo-project` 项目管理页面，通过容器组终端访问 RadonDB MySQL。

1. 进入**应用负载**下的**容器组**页面。

2. 在**容器组**下，点击集群其中一个容器组名称，进入容器组详情页面。

3. 在**资源状态**中**容器**列框下，点击 **mysql** 容器的**终端**图标。

4. 在终端窗口中，输入连接集群。

   ```bash
   mysql -u <user_name> -p <user_password>
   ```

以下示例中相应参数取值如下：

- **pod_name** 为 `sample-mysql-0`
- **project_name** 为 `demo-project`  
- **user_name** 为 `radondb_usr`  
- **user_password** 为  `RadonDB@123`

![访问 RadonDB MySQL](_images/pod_terminal.png)

### 方式 2：通过 Kubectl 工具

在右下角**工具箱**中选择 **Kubectl** 工具，通过 Kubectl 工具访问 RadonDB MySQL。

执行如下命令连接集群，连接成功后即可使用 RadonDB MySQL 应用。

```kubectl
kubectl exec -it <pod_name> -c mysql -n <project_name> -- mysql --user=<user_name> --password=<user_password>
```

以下示例中相应参数取值如下：

- **pod_name** 为 `radondb-1zh93n-mysql-0`
- **project_name** 为 `demo-project`  
- **user_name** 为 `radondb_usr`  
- **user_password** 为  `RadonDB@123`

![访问 RadonDB MySQL](_images/kubectl_terminal.png)

kubectl exec -it radondb-1zh93n-mysql-0 -c mysql -n test1 -- mysql --user=radondb_usr --password=RadonDB@123
kubectl exec -it 192.168.0.7 -c mysql -n test1 -- mysql --user=radondb_usr --password=RadonDB@123
kubectl exec -it radondb-1zh93n-leader -c mysql -n test1 -- mysql --user=radondb_usr --password=RadonDB@123
mysql -h sample-leader.demo-project -u radondb_usr -p
mysql -h 10.96.4.90 -P 3306 -u radondb_usr -p

## 通过 mysql-client 访问

> **注意**
> 
> 准备可用于连接 MySQL 的客户端。

- 当客户端的与数据库不在同一 KubeSphere 集群环境时，可通过配置端口转发、负载均衡等方式连接。
- 当客户端的与数据库在同一 KubeSphere 集群环境时，可通过 `service_name` 或者 `clusterIP` 方式连接。
  
> **说明**
> 
> RadonDB MySQL 提供 leader 服务和 follower 服务用于分别访问主从节点。leader 服务始终指向主节点（读写），follower 服务始终指向从节点（只读）。

以下为客户端与数据库在同一 Kubernetes 集群内，访问 RadonDB MySQL 的方式。

### 方式 1：`service_name` 方式

连接 RadonDB MySQL 主节点。

```shell
mysql -h <leader_service_name>.<project_name> -u <user_name> -p
```

以下示例中相应参数取值如下：

- **leader_service_name** 为 `radondb-1zh93n-leader`
- **project_name** 为 `demo-project`  
- **user_name** 为 `radondb_usr`  
- **user_password** 为  `RadonDB@123`

```shell
mysql -h radondb-1zh93n-leader.demo-project -u radondb_usr -p
```

### 方式 2：`clusterIP` 方式

RadonDB MySQL 的高可用读写 IP 指向 leader 服务的 `clusterIP`，高可用只读 IP 指向 follower 服务的 `clusterIP`。

```shell
mysql -h <clusterIP> -P <mysql_Port> -u <user_name> -p
```

以下示例中相应参数取值如下：

- **clusterIP** 为 `10.10.128.136`
- **mysql_Port** 为 `3306`  
- **user_name** 为 `radondb_usr`  
- **user_password** 为  `RadonDB@123`

```shell
mysql -h 10.10.128.136 -P 3306 -u radondb_usr -p
```
