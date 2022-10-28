---
title: "介绍"
keywords: 'Kubernetes, 日志, Elasticsearch, Kafka, Fluentd, Pod, 容器, Fluentbit, 输出'
description: '了解集群日志接收器的基础知识，包括工具和一般步骤。'
linkTitle: "介绍"
weight: 8621
---

KubeSphere 提供灵活的日志接收器配置方式。基于 [Fluent Operator](https://github.com/fluent/fluent-operator)，用户可以轻松添加、修改、删除、启用或禁用 Elasticsearch、Kafka 和 Fluentd 接收器。接收器添加后，日志会发送至该接收器。

此教程简述在 KubeSphere 中添加日志接收器的一般性步骤。

## 准备工作

- 您需要一个被授予**集群管理**权限的用户。例如，您可以直接用 `admin` 用户登录控制台，或创建一个具有**集群管理**权限的角色然后将此角色授予一个用户。

- 添加日志接收器前，您需要启用组件 `logging`、`events` 或 `auditing`。有关更多信息，请参见[启用可插拔组件](../../../../pluggable-components/)。

## 为容器日志添加日志接收器

若要添加日志接收器：

1. 以 `admin` 身份登录 KubeSphere 的 Web 控制台。

2. 点击左上角的**平台管理**，然后选择**集群管理**。

   {{< notice note >}}

   如果您启用了[多集群功能](../../../../multicluster-management/)，您可以选择一个集群。

   {{</ notice >}} 

3. 选择**集群设置**下的**日志接收器**。

4. 在日志接收器列表页，点击**添加日志接收器**。

   {{< notice note >}}

- 每个接收器类型至多可以添加一个接收器。
- 可以同时添加不同类型的接收器。

{{</ notice >}}

### 添加 Elasticsearch 作为日志接收器

如果 [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md) 中启用了 `logging`、`events` 或 `auditing`，则会添加默认的 Elasticsearch 接收器，服务地址会设为 Elasticsearch 集群。

当  `logging`、`events` 或 `auditing` 启用时，如果 [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md) 中未指定 `externalElasticsearchUrl` 和 `externalElasticsearchPort`，则内置 Elasticsearch 集群会部署至 Kubernetes 集群。内置 Elasticsearch 集群仅用于测试和开发。生产环境下，建议您集成外置 Elasticsearch 集群。

日志查询需要依靠所配置的内置或外置 Elasticsearch 集群。

如果默认的 Elasticsearch 日志接收器被删除，请参考[添加 Elasticsearch 作为接收器](../add-es-as-receiver/)重新添加。

### 添加 Kafka 作为日志接收器

Kafka 往往用于接收日志，并作为 Spark 等处理系统的代理 (Broker)。[添加 Kafka 作为接收器](../add-kafka-as-receiver/)演示如何添加 Kafka 接收 Kubernetes 日志。

### 添加 Fluentd 作为日志接收器

如果您需要将日志输出到除 Elasticsearch 或 Kafka 以外的其他地方，您可以添加 Fluentd 作为日志接收器。Fluentd 支持多种输出插件，可以将日志发送至多个目标，例如 S3、MongoDB、Cassandra、MySQL、syslog 和 Splunk 等。[添加 Fluentd 作为接收器](../add-fluentd-as-receiver/)演示如何添加 Fluentd 接收 Kubernetes 日志。

## 为资源事件或审计日志添加日志接收器

自 KubeSphere v3.0.0 起，资源事件和审计日志可以通过和容器日志相同的方式进行存档。如果在 [ClusterConfiguration](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md) 中启用了 `events` 或 `auditing`，**日志接收器**页面会对应显示**资源事件**或**审计日志**选项卡。您可以前往对应选项卡为资源事件或审计日志配置日志接收器。

容器日志、资源事件和审计日志应存储在不同的 Elasticsearch 索引中以便在 KubeSphere 中进行搜索。系统以`<索引前缀>-<年-月-日>`格式自动生成索引。

## 启用或停用日志接收器

无需新增或删除日志接收器，您可以随时启用或停用日志接收器，具体步骤如下：

1. 在**日志接收器**页面，点击一个日志接收器并进入其详情页面。
2. 点击**更多操作**并选择**更改状态**。

3. 选择**收集中**或**关闭**以启用或停用该日志接收器。

4. 停用后，日志接收器的状态会变为**关闭**，激活时状态为**收集中**。


## 编辑或删除日志接收器

您可以编辑或删除日志接收器：

1. 在**日志接收器**页面，点击一个日志接收器并进入其详情页面。
2. 点击**编辑**或从下拉菜单中选择**编辑 YAML** 以编辑日志接收器。

3. 点击**删除**以删除日志接收器。
