---
title: "应用资源监控"
keywords: "Kubernetes, KubeSphere, resources, monitoring"
description: "Monitor application resources in KubeSphere"
linkTitle: "应用资源监控"
weight: 8300
---


除了在物理资源级别监控数据外，集群管理员还需要密切跟踪整个平台上的应用资源，例如DevOps项目的数量，以及特定类型的工作负载和服务的数量。应用资源监控提供了平台的资源使用情况和应用程序级别趋势的摘要。

## 前提条件

您需要一个被授予**集群管理**角色的帐户。 例如，您可以直接以`admin`身份登录控制台或使用授权创建新角色并将其分配给帐户。

## 资源使用情况

1. 单击左上角的**平台管理**，然后选择**集群管理**。
![Platform](/images/docs/cluster-administration/cluster-status-monitoring-zh/platform.png)

2. 如果您已经在导入成员集群时启用了[多集群特性](../../multicluster-management)，那么您可以选择一个特定集群以查看其应用程序资源。 如果尚未启用该特性，请直接参考下一步。
![Clusters Management](/images/docs/cluster-administration/cluster-status-monitoring-zh/clusters-management.png)

3. 在**监控告警**下拉选项里选择**应用资源**以查看应用程序资源监控的概览，包括群集中所有资源使用情况的摘要，如下图所示。
![Resource Usage](/images/docs/cluster-administration/application-resources-monitoring-zh/application-resources-monitoring.png)

4. 其中，**群集资源使用情况**和**应用资源使用情况**保留最近7天的监控数据，而且支持自定义时间范围查询。
![Time Range](/images/docs/cluster-administration/application-resources-monitoring-zh/time-range.png)

5. 单击特定资源以查看特定时间段内的详细使用情况和趋势，例如**集群资源使用情况**下的**CPU**。详细信息页面允许您按项目查看特定的监控数据。 高度交互的仪表板使用户可以自定义时间范围，显示给定时间点的确切资源使用情况。
![Cluster Resources Usage](/images/docs/cluster-administration/application-resources-monitoring-zh/cluster-resources-monitoring.png)

## 用量排行
**用量排行**支持对项目资源使用情况进行排序，因此平台管理员可以了解当前集群中每个项目的资源使用情况，包括**CPU使用量**，**内存使用量**，**容器组数量**以及**网络流出速率**和**网络流入速率**。您可以通过下拉列表中的任一指标按升序或降序对项目进行排序。 此功能对于快速查找消耗大量CPU或内存的应用程序（容器组）非常有用。
![Usage Ranking](/images/docs/cluster-administration/application-resources-monitoring-zh/usage-ranking.png)