---
title: "事件查询"
keywords: 'KubeSphere, Kubernetes, 事件, 查询'
description: '如何在 KubeSphere 中进行事件查询。'
linkTitle: "事件查询"
weight: 15200
---

Kubernetes 事件系统用于深入了解集群内部发生的事件，KubeSphere 在此之上添加了跨度更长的历史查询和聚合功能，并且支持租户隔离的事件查询。

本指南演示了如何进行多层级、细粒度的事件查询，以追踪服务组件的状态。

## 准备工作

需要启用 [KubeSphere 事件系统](../../pluggable-components/events/)。

## 查询事件

1. 所有用户都可以使用事件查询功能。使用任意帐户登录控制台，在右下角的**工具箱**图标上悬停，然后在弹出菜单中选择**事件查询**。

    ![工具箱](/images/docs/zh-cn/toolbox/event-query/events-query-guide.png)

2. 在弹出窗口中，您可以看到该帐户有权限查看的事件数量。

    ![事件查询主界面](/images/docs/zh-cn/toolbox/event-query/events-query-home.png)

    {{< notice note >}}

- 如果您启用了多集群功能，KubeSphere 支持对每个集群分别进行事件查询。您可以使用搜索栏旁边的下拉列表切换目标集群。

- 搜索栏中支持以下字段：
  - **企业空间**
  - **项目**
  - **资源类型**
  - **资源名称**
  - **原因**
  - **消息**
  - **类别**
  - **时间范围**
- 您可以在搜索栏中选择**时间范围**，自定义查询时间范围。KubeSphere 默认存储最近七天的事件。

    {{</ notice >}}

3. 以查询项目 `test` 最近 1 小时内**消息**中包含 `container` 的事件作为示例，如下方截图所示。查询返回 84 行结果，并显示了相应的时间、项目和消息。

    ![事件查询结果列表](/images/docs/zh-cn/toolbox/event-query/events-query-list.PNG)

4. 点击列表中的任一查询结果，可以查看该结果的原始信息，便于开发者分析和排除故障。

    ![事件查询结果详情](/images/docs/zh-cn/toolbox/event-query/events-query-detail.PNG)

    {{< notice note >}}

事件查询界面支持每 5 秒、10 秒或 15 秒动态刷新一次。

    {{</ notice >}}
