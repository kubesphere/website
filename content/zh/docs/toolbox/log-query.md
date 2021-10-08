---
title: "日志查询"
keywords: 'KubeSphere, Kubernetes, 日志'
description: '了解如何快速执行日志查询，追踪集群的最新日志。'
linkTitle: "日志查询"
weight: 15100
---

应用程序和系统的日志可以帮助您更好地了解集群内部和工作负载内部发生的事情。日志对于排除故障问题和监控集群活动特别有用。KubeSphere 提供强大且易用的日志系统，从租户的角度为用户提供日志收集、查询和管理的功能。基于租户的日志系统使不同的租户只能查看自己的日志，安全性更好，相较于 Kibana 更为实用。此外，KubeSphere 日志系统会过滤掉一些冗余信息，以便用户能够只专注于对自己有用的日志。

本教程演示了如何使用日志查询功能，包括界面、搜索参数和详情页面。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeSphere-v3.1.x-tutorial-videos/zh/KS311_200P010C202109_%E6%97%A5%E5%BF%97%E4%B8%8E%E4%BA%8B%E4%BB%B6%E6%9F%A5%E8%AF%A2.mp4">
</video>

## 准备工作

您需要启用 [KubeSphere 日志系统](../../pluggable-components/logging/)。

## 进入日志查询界面

1. 所有用户都可以使用日志查询功能。使用任意帐户登录控制台，在右下角的**工具箱**图标上悬停，然后在弹出菜单中选择**日志查询**。

    ![进入日志查询](/images/docs/zh-cn/toolbox/log-query/log-query-guide.PNG)

2. 在弹出窗口中，您可以看到日志数量的时间直方图、集群选择下拉列表以及日志查询栏。

    ![日志查询界面](/images/docs/zh-cn/toolbox/log-query/log-query-interface.PNG)

    {{< notice note >}}

- 如果您启用了多集群功能，KubeSphere 支持对每个集群分别进行日志查询。您可以使用日志搜索栏旁边的下拉列表切换目标集群。
- 日志搜索栏中支持以下字段：
  - **关键字**
  - **项目**
  - **工作负载**
  - **容器组**
  - **容器**
  - **时间范围**
- 关键字字段支持关键字组合查询。例如，您可以同时使用 `Error`、`Fail`、`Fatal`、`Exception` 和 `Warning` 来查询所有异常日志。
- 关键字字段支持精确匹配和模糊匹配。模糊匹配不区分大小写，并且根据 ElasticSearch 分段规则，通过单词或词组的前半部分来检索完整术语。例如，您可以通过搜索关键字 `node_cpu`（而不是 `cpu`）来检索包含 `node_cpu_total` 的日志。

    {{</ notice >}}

3. 您可以在日志搜索栏中选择**时间范围**来自定义查询时间范围。或者，点击时间直方图中的柱状图，KubeSphere 会使用该柱状图的时间范围进行日志查询。

    ![log-query-time-range](/images/docs/zh-cn/toolbox/log-query/log-query-time-range.PNG)

    {{< notice note >}}

- KubeSphere 默认存储最近七天内的日志。
- 每个集群都有自己的日志保留期限，可单独设置，您可以在 `ClusterConfiguration` 中进行修改。有关详细信息，请参考 [KubeSphere 日志系统](../../pluggable-components/logging/)。

    {{</ notice >}}

## 使用搜索参数

1. 您可以提供尽可能多的字段来缩小搜索结果。以在集群 `product` 的项目 `kubesphere-system` 中查询最近 12 小时内包含关键字 `error` 的日志为例，如下图所示。

    ![搜索日志](/images/docs/zh-cn/toolbox/log-query/log-query-log-search.PNG)

2. 查询返回 13 行日志，并显示了相应的时间、项目、容器组（即 Pod）和容器信息。

3. 点击列表中的任一结果，进入它的详情页面，查看该 Pod 的日志，包括右侧的完整内容，便于开发者分析和排除故障。

    {{< notice note >}}

日志查询界面支持每 5 秒、10 秒或 15 秒动态刷新一次，并且用户可以将日志导出至本地文件进行进一步分析（点击右上角按钮）。

    {{</ notice >}}
    
    ![日志详情](/images/docs/zh-cn/toolbox/log-query/log-query-log-detail.PNG)

4. 您在左侧面板可以通过下拉列表切换 Pod 并查看其在同一个项目中的容器，从而查看是否有任何异常 Pod 影响到其他 Pod。

    ![查看其它 Pod](/images/docs/zh-cn/toolbox/log-query/log-query-inspect-other-pods.PNG)

## 进入详情页面

1. 如果日志看起来异常，您可以进入 Pod 详情页面或容器详情页面，进一步查看容器日志、资源监控图以及事件。

    ![进入详情页面](/images/docs/zh-cn/toolbox/log-query/log-query-drill.PNG)

2. 如下图所示，查看容器详情页面。同时，您还可以打开终端直接为容器排除故障。

    ![进入容器](/images/docs/zh-cn/toolbox/log-query/log-query-drill-container.png)