---
title: "应用资源监控"
keywords: "Kubernetes, KubeSphere, 资源, 监控"
description: "在 KubeSphere 监控应用资源。"
linkTitle: "应用资源监控"
weight: 8300
---


除了在物理资源级别监控数据外，集群管理员还需要密切跟踪整个平台上的应用资源，例如项目和 DevOps 项目的数量，以及特定类型的工作负载和服务的数量。**应用资源监控**提供了平台的资源使用情况和应用级趋势的汇总信息。

## 准备工作

您需要一个被授予**集群管理**权限的帐户。例如，您可以直接用 `admin` 帐户登录控制台，或创建一个具有**集群管理**权限的角色然后将此角色授予一个帐户。

## 使用情况

1. 点击左上角的**平台管理**，然后选择**集群管理**。
![Platform](/images/docs/cluster-administration/cluster-status-monitoring-zh/platform.png)
2. 如果您已启用了[多集群特性](../../multicluster-management
)并已导入了成员集群，您可以选择一个集群以查看其应用程序资源。如果尚未启用该特性，请直接进行下一步。
![Clusters Management](/images/docs/cluster-administration/cluster-status-monitoring-zh/clusters-management.png)
3. 在左侧导航栏选择**监控告警**下的**应用资源**以查看应用资源概览，包括群集中所有资源使用情况的汇总信息。
    ![Resource Usage](/images/docs/cluster-administration/application-resources-monitoring-zh/application-resources-monitoring.png)
4. **群集资源使用情况**和**应用资源用量**提供最近 7 天的监控数据，并支持自定义时间范围查询。
    ![Time Range](/images/docs/cluster-administration/application-resources-monitoring-zh/time-range.png)
5. 单击特定资源以查看特定时间段内的使用详情和趋势，例如**集群资源使用情况**下的 **CPU**。在详情页面，您可以按项目查看特定的监控数据，以及自定义时间范围查看资源的确切使用情况。
    ![Cluster Resources Usage](/images/docs/cluster-administration/application-resources-monitoring-zh/cluster-resources-monitoring.png)

## 用量排行
**用量排行**支持按照资源使用情况对项目进行排序，帮助平台管理员了解当前集群中每个项目的资源使用情况，包括 **CPU 使用量**、**内存使用量**、**容器组 (Pod) 数量**、**网络流出速率**和**网络流入速率**。您可以选择下拉列表中的任一指标对项目按升序或降序进行排序。此功能可以帮助您快速定位大量消耗 CPU 或内存资源的应用程序 (Pod)。
![Usage Ranking](/images/docs/cluster-administration/application-resources-monitoring-zh/usage-ranking.png)