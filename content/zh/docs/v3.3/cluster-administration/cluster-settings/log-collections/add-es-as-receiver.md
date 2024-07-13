---
title: "添加 Elasticsearch 作为接收器"
keywords: 'Kubernetes, 日志, Elasticsearch, Pod, 容器, Fluentbit, 输出'
description: '了解如何添加 Elasticsearch 来接收容器日志、资源事件或审计日志。'
linkTitle: "添加 Elasticsearch 作为接收器"
weight: 8622
version: "v3.3"
---
您可以在 KubeSphere 中使用 Elasticsearch、Kafka 和 Fluentd 日志接收器。本教程演示如何添加 Elasticsearch 接收器。

## 准备工作

- 您需要一个被授予**集群管理**权限的用户。例如，您可以直接用 `admin` 用户登录控制台，或创建一个具有**集群管理**权限的角色然后将此角色授予一个用户。
- 添加日志接收器前，您需要启用组件 `logging`、`events` 或 `auditing`。有关更多信息，请参见[启用可插拔组件](../../../../pluggable-components/)。本教程启用 `logging` 作为示例。

## 添加 Elasticsearch 作为接收器

1. 以 `admin` 身份登录 KubeSphere 的 Web 控制台。点击左上角的**平台管理**，然后选择**集群管理**。

    {{< notice note >}}

如果您启用了[多集群功能](../../../../multicluster-management/)，您可以选择一个集群。

{{</ notice >}} 

2. 在左侧导航栏，选择**集群设置**下的**日志接收器**。

3. 点击**添加日志接收器**并选择 **Elasticsearch**。

4. 提供 Elasticsearch 服务地址和端口信息。

5. Elasticsearch 会显示在**日志接收器**页面的接收器列表中，状态为**收集中**。

6. 若要验证 Elasticsearch 是否从 Fluent Bit 接收日志，从右下角的**工具箱**中点击**日志查询**，在控制台中搜索日志。有关更多信息，请参阅[日志查询](../../../../toolbox/log-query/)。

