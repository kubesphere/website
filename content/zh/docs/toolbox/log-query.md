---
title: "日志查询"
keywords: 'KubeSphere, Kubernetes, 日志, 查询'
description: '了解如何快速执行日志查询，追踪集群的最新日志。'
linkTitle: "日志查询"
weight: 15100
---

应用程序和系统的日志可以帮助您更好地了解集群内部和工作负载内部发生的事情。日志对于排除故障问题和监控集群活动特别有用。KubeSphere 提供强大且易用的日志系统，从租户的角度为用户提供日志收集、查询和管理的功能。基于租户的日志系统使不同的租户只能查看自己的日志，安全性更好，相较于 Kibana 更为实用。此外，KubeSphere 日志系统会过滤掉一些冗余信息，以便用户能够只专注于对自己有用的日志。

本教程演示了如何使用日志查询功能，包括界面、搜索参数和详情页面。

## 准备工作

您需要启用 [KubeSphere 日志系统](../../pluggable-components/logging/)。

## 进入日志查询界面

1. 所有用户都可以使用日志查询功能。使用任意帐户登录控制台，在右下角的 <img src="/images/docs/zh-cn/toolbox/log-query/toolbox.png" width='20' /> 上悬停，然后在弹出菜单中选择**日志查询**。

2. 在弹出窗口中，您可以看到日志数量的时间直方图、集群选择下拉列表以及日志查询栏。

    ![log-search](/images/docs/zh-cn/toolbox/log-query/log-search.png)

    {{< notice note >}}

- 如果您启用了[多集群功能](../../multicluster-management/)，KubeSphere 支持对每个集群分别进行日志查询。您可以点击搜索栏左侧的 <img src="/images/docs/zh-cn/toolbox/log-query/drop-down-list.png" width='20' /> 切换目标集群。
- KubeSphere 默认存储最近七天内的日志。

  {{</ notice >}}

3. 您可以点击搜索栏并输入搜索条件，可以按照消息、企业空间、项目、资源类型、资源名称、原因、类别或时间范围搜索事件（例如，输入`时间范围:最近 10 分钟`来搜索最近 10 分钟的事件）。或者，点击时间直方图中的柱状图，KubeSphere 会使用该柱状图的时间范围进行日志查询。

    ![log-search-list](/images/docs/zh-cn/toolbox/log-query/log-search-list.png)

    {{< notice note >}}

- 关键字字段支持关键字组合查询。例如，您可以同时使用 `Error`、`Fail`、`Fatal`、`Exception` 和 `Warning` 来查询所有异常日志。
- 关键字字段支持精确匹配和模糊匹配。模糊匹配不区分大小写，并且根据 ElasticSearch 分段规则，通过单词或词组的前半部分来检索完整术语。例如，您可以通过搜索关键字 `node_cpu`（而不是 `cpu`）来检索包含 `node_cpu_total` 的日志。

- 每个集群都有自己的日志保留期限，可单独设置，您可以在 `ClusterConfiguration` 中进行修改。有关详细信息，请参考 [KubeSphere 日志系统](../../pluggable-components/logging/)。

    {{</ notice >}}

## 使用搜索参数

1. 您可以输入多个条件来缩小搜索结果。

    ![log-search-conditions](/images/docs/zh-cn/toolbox/log-query/log-search-conditions.png)

2. 点击列表中的任一结果，进入它的详情页面，查看该容器组 (Pod) 的日志，包括右侧的完整内容，便于开发者分析和排除故障。

    ![log-search-details-page](/images/docs/zh-cn/toolbox/log-query/log-search-details-page.png)

    {{< notice note >}}

- 日志查询界面支持每 5 秒、10 秒或 15 秒动态刷新一次.。
- 您可以点击右上角的 <img src="/images/docs/zh-cn/toolbox/log-query/export-logs.png" width='20' /> 将日志导出至本地文件进行进一步分析。

{{</ notice >}}

4. 在左侧面板中，您可以点击 <img src="/images/docs/zh-cn/toolbox/log-query/drop-down-list.png" width='20' /> 切换 Pod 并查看其在同一个项目中的容器，从而查看是否有任何异常 Pod 影响到其他 Pod。


## 进入详情页面

在左侧面板，您可以点击 <img src="/images/docs/zh-cn/toolbox/log-query/view-detail-page.png" width='20' /> 查看 Pod 详情页面或容器详情页面。

下图是 Pod 详情页面示例：

![pod-details-page](/images/docs/zh-cn/toolbox/log-query/pod-details-page.png)

下图是容器详情页面示例。您可以点击右上角的**终端**打开终端为容器排除故障。

![container-detail-page](/images/docs/zh-cn/toolbox/log-query/container-detail-page.png)