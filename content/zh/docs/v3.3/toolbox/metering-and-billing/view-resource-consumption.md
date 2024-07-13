---
title: "查看资源消费"
keywords: "Kubernetes, KubeSphere, 计量, 计费, 消费"
description: "在不同层级追踪集群工作负载的资源用量。"
linkTitle: "查看资源消费"
weight: 15410
version: "v3.3"
---

KubeSphere 计量功能帮助您在不同层级追踪集群或企业空间中的资源消费。具有不同角色的租户只能看到其有权访问的数据。此外，您还可以为不同的资源设置价格以查看计费信息。

## 准备工作 

- 所有租户都可以访问**资源消费统计**模块，但每个租户可见的信息可能有所不同，可见信息具体取决于租户在所处层级上具有的角色。请注意，计量功能并非 KubeSphere 的可插拔组件，即只要您有一个 KubeSphere 集群，就可以使用该功能。对于新创建的集群，您需要等待大约一小时才能看到计量信息。
- 如需查看计费信息，您需要预先[启用计费](../enable-billing/)。

## 查看集群资源消费情况

**集群资源消费情况**包含集群（也包括节点）的资源使用情况，如 CPU、内存、存储等。

1. 使用 `admin` 用户登录 KubeSphere Web 控制台，点击右下角的 <img src="/images/docs/v3.x/zh-cn/toolbox/metering-and-billing/view-resource-consumption/toolbox.png" width='20px' alt="icon" />，然后选择**资源消费统计**。

2. 在**集群资源消费情况**一栏，点击**查看消费**。

3. 如果您已经启用[多集群管理](../../../multicluster-management/)，则可以在控制面板左侧看到包含 Host 集群和全部 Member 集群的集群列表。如果您未启用该功能，那么列表中只会显示一个 `default` 集群。

   在右侧，有三个模块以不同的方式显示资源消费情况。

   <table border="1">
     <tbody>
       <tr>
         <th width='160'>模块</th>
         <th>描述</th>
       </tr>
       <tr>
         <td>资源消费统计</td>
         <td>显示自集群创建以来不同资源的消费概览。如果您在 ConfigMap <code>kubesphere-config</code> 中<a href='../enable-billing/'>已经配置资源的价格</a>，则可以看到计费信息。</td>
       </tr>
         <tr>
           <td>消费历史</td>
           <td>显示截止到昨天的资源消费总况，您也可以自定义时间范围和时间间隔，以查看特定周期内的数据。</td>
       </tr>
         <tr>
           <td>当前消费</td>
           <td>显示过去一小时所选目标对象的资源消费情况。</td>
       </tr>
     </tbody>
   </table>
   
4. 在左侧，点击集群名称即可查看集群节点或 Pod 的资源消费详情。

   {{< notice note >}}
   
   如需导出 CSV 格式的资源消费统计数据，请勾选左侧的复选框，然后点击 ✓。
   
   {{</ notice >}} 

## 查看企业空间（项目）资源消费情况

**企业空间（项目）资源消费情况**包含企业空间（包括项目）的资源使用情况，如 CPU、内存、存储等。

1. 使用 `admin` 用户登录 KubeSphere Web 控制台，点击右下角的 <img src="/images/docs/v3.x/zh-cn/toolbox/metering-and-billing/view-resource-consumption/toolbox.png" width='20' alt="icon" /> 图标，然后选择**资源消费统计**。

2. 在**企业空间资源消费情况**一栏，点击**查看**。

3. 在控制面板左侧，可以看到包含当前集群中全部企业空间的列表。右侧显示所选企业空间的消费详情，其布局与集群消费情况布局类似。

   {{< notice note >}}

   在多集群架构中，如果企业空间中没有分配可用集群，则无法查看企业空间的资源消费情况。有关更多信息，请参阅[集群可见性和授权](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/)。

   {{</ notice >}} 

4. 在左侧，点击企业空间名称即可查看其项目或工作负载（例如，部署和有状态副本集）的资源消费详情。
