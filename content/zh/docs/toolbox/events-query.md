---
title: "事件查询"
keywords: 'KubeSphere, Kubernetes, 事件, 查询'
description: '了解如何快速执行事件查询，追踪集群的最新事件。'
linkTitle: "事件查询"
weight: 15200
---

Kubernetes 事件系统用于深入了解集群内部发生的事件，KubeSphere 在此之上添加了跨度更长的历史查询和聚合功能，并且支持租户隔离的事件查询。

本指南演示了如何进行多层级、细粒度的事件查询，以追踪服务组件的状态。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeSphere-v3.1.x-tutorial-videos/zh/KS311_200P010C202109_%E6%97%A5%E5%BF%97%E4%B8%8E%E4%BA%8B%E4%BB%B6%E6%9F%A5%E8%AF%A2.mp4">
</video>

## 准备工作

需要启用 [KubeSphere 事件系统](../../pluggable-components/events/)。

## 查询事件

1. 所有用户都可以使用事件查询功能。使用任意帐户登录控制台，在右下角的 <img src="/images/docs/zh-cn/toolbox/event-query/toolbox.png" width="20" /> 上悬停，然后在弹出菜单中选择**事件查询**。

2. 在弹出窗口中，您可以看到该帐户有权限查看的事件数量。

    ![event-search](/images/docs/zh-cn/toolbox/event-query/event-search.png)

    {{< notice note >}}

- 如果您启用了[多集群功能](../../multicluster-management/)，KubeSphere 支持对每个集群分别进行事件查询。您可以点击搜索栏左侧的 <img src="/images/docs/zh-cn/toolbox/event-query/drop-down-list.png" width='20' />，然后选择一个目标集群。

- KubeSphere 默认存储最近七天的事件。

    {{</ notice >}}

3. 您可以点击搜索栏并输入搜索条件，可以按照消息、企业空间、项目、资源类型、资源名称、原因、类别或时间范围搜索事件（例如，输入`时间范围:最近 10 分钟`来搜索最近 10 分钟的事件）。

    ![event-search-list](/images/docs/zh-cn/toolbox/event-query/event-search-list.png)

4. 点击列表中的任一查询结果，可以查看该结果的原始信息，便于开发者分析和排除故障。

    ![event-details](/images/docs/zh-cn/toolbox/event-query/event-details.png)

    {{< notice note >}}

事件查询界面支持每 5 秒、10 秒或 15 秒动态刷新一次。

    {{</ notice >}}
