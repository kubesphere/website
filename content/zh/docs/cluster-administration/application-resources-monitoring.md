---
title: "应用资源监控"
keywords: "Kubernetes, KubeSphere, 资源, 监控"
description: "监控集群中的应用资源，例如不同项目的部署数量和 CPU 使用情况。"
linkTitle: "应用资源监控"
weight: 8300
---

除了在物理资源级别监控数据外，集群管理员还需要密切跟踪整个平台上的应用资源，例如项目和 DevOps 工程的数量，以及特定类型的工作负载和服务的数量。**应用资源监控**提供了平台的资源使用情况和应用级趋势的汇总信息。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeSphere-v3.1.x-tutorial-videos/zh/KS311_200P014C202111_%E5%BA%94%E7%94%A8%E8%B5%84%E6%BA%90%E7%9B%91%E6%8E%A7.mp4">
</video>

## 准备工作

您需要一个被授予**集群管理**权限的帐户。例如，您可以直接用 `admin` 帐户登录控制台，或创建一个具有**集群管理**权限的角色然后将此角色授予一个帐户。

## 使用情况

1. 点击左上角的**平台管理**，然后选择**集群管理**。
    ![Platform](/images/docs/zh-cn/cluster-administration/application-resources-monitoring/platform.png)

2. 如果您已启用了[多集群功能](../../multicluster-management/)并已导入了 Member 集群，您可以选择一个集群以查看其应用程序资源。如果尚未启用该功能，请直接进行下一步。
    ![Clusters Management](/images/docs/zh-cn/cluster-administration/application-resources-monitoring/clusters-management.png)

3. 在左侧导航栏选择**监控告警**下的**应用资源**以查看应用资源概览，包括集群中所有资源使用情况的汇总信息。
   
   ![application-resources-monitoring1](/images/docs/zh-cn/cluster-administration/application-resources-monitoring/application-resources-monitoring1.png)  
4. **集群资源使用情况**和**应用资源用量**提供最近 7 天的监控数据，并支持自定义时间范围查询。
    ![Time Range](/images/docs/zh-cn/cluster-administration/application-resources-monitoring/time-range.png)

5. 点击特定资源以查看特定时间段内的使用详情和趋势，例如**集群资源使用情况**下的 **CPU**。在详情页面，您可以按项目查看特定的监控数据，以及自定义时间范围查看资源的确切使用情况。
    ![Cluster Resources Usage](/images/docs/zh-cn/cluster-administration/application-resources-monitoring/cluster-resources-monitoring.png)

## 用量排行
**用量排行**支持按照资源使用情况对项目进行排序，帮助平台管理员了解当前集群中每个项目的资源使用情况，包括 **CPU 使用量**、**内存使用量**、**容器组 (Pod) 数量**、**网络流出速率**和**网络流入速率**。您可以选择下拉列表中的任一指标对项目按升序或降序进行排序。此功能可以帮助您快速定位大量消耗 CPU 或内存资源的应用程序 (Pod)。
![Usage Ranking](/images/docs/zh-cn/cluster-administration/application-resources-monitoring/usage-ranking.png)