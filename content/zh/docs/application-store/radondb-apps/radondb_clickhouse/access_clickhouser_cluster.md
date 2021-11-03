---
title: "在 KubeSphere 中访问 RadonDB ClickHouse"
keywords: 'KubeSphere, Kubernetes, 访问, RadonDB ClickHouse'
description: '了解如何从 KubeSphere 访问 RadonDB ClickHouse。'
linkTitle: "访问数据库"
weight: 14512
---

[RadonDB ClickHouse](https://github.com/radondb/radondb-clickhouse-kubernetes) 是一款深度定制的 ClickHouse 集群应用，完美保持了 ClickHouse 集群功能特性，并具备集群自动管理、集群数据重分布、高性能低成本等特性。

本教程演示了如何在 KubeSphere 上访问 ClickHouse 数据库。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 请确保 KubeSphere 项目网关已开启外网访问。有关更多信息，请参见[项目网关](https://kubesphere.io/zh/docs/project-administration/project-gateway/)。

## 动手实验

1. 以 `admin` 身份登录 KubeSphere 的 Web 控制台，将鼠标悬停在右下角的锤子图标上，选择 **Kubectl**。

2. 打开终端窗口，执行如下命令，并输入 ClickHouse 用户名和密码。

   ```bash
   $ kubectl edit chi <appName> -n <projectName>
   ```
   {{< notice note >}}

   以下命令示例中 **appName** 为 `clickhouse-app` ，**projectName** 为 `demo-project`。

   {{</ notice >}} 

   ![get-username-password](/images/docs/zh-cn/appstore/built-in-apps/radondb-clickhouse-app/get-username-password.png)

3. 执行如下命令，访问 ClickHouse 集群，并可通过 `show databases` 命令查看数据库。

   ```bash
   $ kubectl exec -it <podName> -n <projectName> -- clickhouse-client --user=<userName> --password=<userPassword>
   ```

   {{< notice note >}}

   - 以下命令示例中 **podName** 为 `chi-clickhouse-app-all-nodes-0-1-0` ，**projectName** 为 `demo-project`，**userName** 为 `clickhouse`，**userPassword** 为  `clickh0use0perator`。

   - 可在**应用负载**的**容器组**下获取 **podName**。

   {{</ notice >}} 

   ![use-clickhouse](/images/docs/zh-cn/appstore/built-in-apps/radondb-clickhouse-app/use-clickhouse.png)
