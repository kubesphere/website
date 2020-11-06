---
title: "集群状态监控"
keywords: "Kubernetes， KubeSphere， status， monitoring"
description: "kubeSphere的集群资源监控"

linkTitle: "集群状态监控"
weight: 300
---

&emsp;&emsp;KubeSphere 提供了对集群的 CPU、内存、网络和磁盘等相关指标的监控。在**集群状态监控**页面中，您还可以查看历史监控数据并根据节点的使用情况按不同的指标对节点进行排序。

## 前提条件

&emsp;&emsp;您需要一个被授予**集群管理**角色的帐户。 例如，您可以直接以`admin`身份登录控制台或使用授权创建新角色并将其分配给帐户。

## 集群状态监控

1. 单击左上角的**平台管理**，然后选择**集群管理**。
![Platform](/images/docs/cluster-administration/cluster-status-monitoring-zh/platform.png)

2. 如果您已经在导入成员集群时启用了[多集群特性](../../multicluster-management
)，那么您可以选择一个特定集群以查看其应用程序资源。 如果尚未启用该特性，请直接参考下一步。
![Clusters Management](/images/docs/cluster-administration/cluster-status-monitoring-zh/clusters-management.png)

3. 在**监控告警**下拉选项里选择“集群状态”以查看集群状态监控的概览，包括**集群节点状态**、**组件状态**、**集群资源使用情况**、**ETCD监控**和**服务组件监控**，如下图所示：
![Cluster Status Monitoring](/images/docs/cluster-administration/cluster-status-monitoring-zh/cluster-status-monitoring.png)

### 集群节点状态

1. **集群节点状态**显示在线结点/所有结点状态。 您可以通过单击**节点在线状态**跳转到如下所示的**集群节点**页以查看所有节点的实时资源使用情况。
![Cluster Nodes](/images/docs/cluster-administration/cluster-status-monitoring-zh/cluster-nodes.png)

2. 在**集群节点**中，单击节点名称可以查看结点**运行状态**中的使用详细信息，包括当前节点中的CPU、内存、容器组、本地存储的信息及其健康状态。
![Running Status](/images/docs/cluster-administration/cluster-status-monitoring-zh/running-status.png)

3. 单击**监控**选项卡，可以根据不同的指标查看节点在特定时期内的运行情况，这些指标包括**CPU使用率**、**CPU平均负载**、**内存使用率**、**磁盘使用率**、**inode使用率**、**IOPS**、**磁盘吞吐**和**网络带宽**，如下图所示：
![Monitoring](/images/docs/cluster-administration/cluster-status-monitoring-zh/monitoring.png)

{{< notice tip >}}
您可以从右上角的下拉列表中自定义时间范围查看历史数据。
{{</ notice  >}}

### 组件状态

&emsp;&emsp;KubeSphere监控集群中各种服务组件的运行健康状况。 当关键组件发生故障时，系统可能变的不可用。 KubeSphere的监控机制确保该平台可以在组件出现故障时将任何发生的问题通知租户，以便他们可以快速定位问题并采取相应的措施。

1. 在**集群状态监控'**页面上，单击**组件状态**里的组件（下面绿色框中的部分）以查看服务组件的状态。
![component-monitoring](/images/docs/cluster-administration/cluster-status-monitoring-zh/component-monitoring.png)

2. 您可以看到所有组件都列在这一页面中。标记为绿色的组件是正常运行的组件，而标记为橙色的组件则需要特别注意，因为它表示此组件存在潜在问题。
![Service Components Status](/images/docs/cluster-administration/cluster-status-monitoring-zh/service-components-status.png)

{{< notice tip >}}
标记为橙色的组件可能会在一段时间后变为绿色，原因可能会有所不同，例如重试拉取镜像或重新创建实例。 您可以单击该组件查看其服务详细信息。
{{</ notice  >}}

### 群集资源使用情况

&emsp;&emsp;**集群资源使用情况**显示的信息包括集群中所有节点的**CPU使用率**、**内存使用率**、**磁盘使用率**和**容器组数量变化**。 单击左侧的饼图以切换指标，在右侧的曲线图中显示一段时间内的趋势。
![Cluster Resources Usage](/images/docs/cluster-administration/cluster-status-monitoring-zh/cluster-resources-usage.png)

## 物理资源监控

&emsp;&emsp;**物理资源监控**中的监控数据可以帮助用户更好地观察自己的物理资源，并据此建立正常的资源和集群性能使用阀值。KubeSphere允许用户查看最近7天的集群监控数据，包括**CPU使用情况**、**内存使用情况**、**CPU平均负载(1分钟/5分钟/15分钟)**、**inode使用率**、**磁盘吞吐量(读写)**、**IOPS(读写)**、**网络带宽**和**容器组运行状态**。您可以在KubeSphere中查看自定义时间范围和时间间隔内的物理资源历史监控数据。 以下各节简要介绍每个监控指标。
![Physical Resources Monitoring](/images/docs/cluster-administration/cluster-status-monitoring-zh/physical-resources-monitoring.png)

### CPU利用率

&emsp;&emsp;CPU利用率显示一段时间内CPU资源的使用率。 如果您注意到某一段时间平台的CPU使用率飙升，您必须首先定位占用CPU资源最多的进程。 例如，对于Java应用程序，代码中出现内存泄漏或无限循环的情况可能会出现CPU使用率飙高。
![CPU Utilization](/images/docs/cluster-administration/cluster-status-monitoring-zh/cpu-utilization.png)

### 内存利用率

&emsp;&emsp;内存是服务器上的重要部件之一，是与CPU通信的桥梁。 因此，内存的性能对机器有很大的影响。 当程序运行时，数据加载、线程并发和I/O缓冲都依赖于内存。 可用内存的大小决定了程序是否可以正常运行以及它是如何运行的。 内存利用率反映了集群内存资源的整体使用情况，显示为给定时刻使用的可用内存的百分比。

![Memory Utilization](/images/docs/cluster-administration/cluster-status-monitoring-zh/memory-utilization.png)

### CPU平均负载

&emsp;&emsp;CPU平均负载是单位时间内系统中处于可运行状态和不中断状态的平均进程数。 也就是说，它是活动进程的平均数量。 请注意，CPU平均负载和CPU利用率之间没有直接关系。 理想情况下，平均负载应该等于CPU的数量。 因此，在查看平均负载时，需要考虑CPU的数量。 只有当平均负载大于cpu数量时，系统才会超载。
&emsp;&emsp;KubeSphere为用户提供了三个不同的时间段来查看平均负载：1分钟，5分钟和15分钟。 通常，建议您查看所有这些参数，以全面了解平均负载：

- 如果在一定时间内1分钟/ 5分钟/ 15分钟的曲线相似，则表明集群的CPU负载相对稳定。
- 如果某一时段或某一特定时间点的1分钟的值远远大于15分钟的值，则表示最近1分钟的负荷在增加，需要继续观察。 一旦1分钟的值超过CPU数量，可能意味着系统超载。 你需要进一步分析问题的根源。
- 反之，如果某一时段或某一特定时间点的1分钟值远小于15分钟，则表示系统在最近1分钟内负载在降低，在前15分钟内产生了较高的负载。
![CPU Load Average](/images/docs/cluster-administration/cluster-status-monitoring-zh/cpu-load-average.png)

### 磁盘使用量

&emsp;&emsp;KubeSphere工作负载(如StatefulSets和DaemonSets)都依赖于持久卷。 某些组件和服务也需要持久卷。 这种后端存储依赖于磁盘，例如块存储或网络共享存储。 因此，为磁盘使用情况提供实时监控环境是保持数据高可靠性的重要组成部分。</br>
&emsp;&emsp;在Linux系统的日常管理中，管理员可能会遇到磁盘空间不足导致数据丢失甚至系统崩溃的情况。 作为集群管理的重要组成部分，他们需要密切关注系统的磁盘使用情况，并确保文件系统不会被填满或滥用。 通过监视磁盘使用的历史数据，您可以评估给定时间段内磁盘的使用情况。 在磁盘使用率较高的情况下，您可以通过清理不必要的镜像或容器来释放磁盘空间。
![Disk Usage](/images/docs/cluster-administration/cluster-status-monitoring-zh/disk-usage.png)

### inode使用率

&emsp;&emsp;每个文件都必须有一个inode，用于存储文件的元信息，如文件的创建者和创建日期。 Inode还会消耗硬盘空间，许多小缓存文件很容易导致inode资源耗尽。 此外，在inode已用完但硬盘未满的情况下，无法在硬盘上创建新文件。</br>
&emsp;&emsp;在KubeSphere中，对inode利用率的监控可以帮助您提前检测到此类情况，因为您可以清楚地了解集群inode的使用情况。 该机制提示用户及时清理临时文件，防止集群因inode耗尽而无法工作。
![inode Utilization](/images/docs/cluster-administration/cluster-status-monitoring-zh/inode-utilization.png)

### 磁盘吞吐

&emsp;&emsp;磁盘吞吐量和IOPS监控是磁盘监控不可或缺的一部分，它方便集群管理员调整数据布局和优化集群整体性能等管理活动。 磁盘吞吐量是指磁盘传输数据流的速度(单位：MB/s)，传输数据是读写数据的总和。 当传输大块不连续数据时，该指标具有重要的参考价值。
![Disk Throughput](/images/docs/cluster-administration/cluster-status-monitoring-zh/disk-throughput.png)

### IOPS

&emsp;&emsp;IOPS（每秒输入/输出操作）表示每秒读取和写入操作数的性能度量。 具体来说，磁盘的IOPS是每秒连续读取和写入的总和。当传输小块不连续数据时，该指示器具有重要的参考意义。
![IOPS](/images/docs/cluster-administration/cluster-status-monitoring-zh/iops.png)

### 网络带宽

&emsp;&emsp;网络带宽是网卡每秒接收或发送数据的能力，以Mbps（兆位/秒）表示。
![Network Bandwidth](/images/docs/cluster-administration/cluster-status-monitoring-zh/netework-bandwidth.png)

### 容器组运行状态

&emsp;&emsp;容器组状态显示所有处于不同状态的容器组的总和，状态包括**正在运行**、**已完成**和**警告**状态。标记为**已完成**的容器组通常指的是Job或CronJob。 标有**警告**(表示异常状态)的Pod数量需要特别注意。
![Pod Status](/images/docs/cluster-administration/cluster-status-monitoring-zh/pod-status.png)

## ETCD监控

&emsp;&emsp;ETCD监控可以帮助您更好地利用ETCD，特别是定位性能问题。 ETCD服务在本地提供指标接口，KubeSphere监控系统具有高度图形化和响应性强的仪表板来显示其本地数据。
| 指标 | 描述 |
|---|---|
|ETCD  结点| - **是否有Leader** 表示成员是否有Leader。 如果成员没有 Leader， 则完全不可用。 如果集群中的所有成员 都没有任何Leader，则整个集群完全不可用。 </br> - **Leader变更次数** 指的是自开始以来集群成员看到的Leader更改次数。 频繁更换Leader将显著影响etcd的性能。 它还标明，Leader不稳定，可能是由于网络连接问题或ETCD集群负载过高所致。|
|DB  大小| ETCD的底层数据库大小(以MiB为单位)。 当前图表显示了ETCD的每个成员数据库的平均大小。 |
|客户端流量|它包括发送到GRPC客户端的总流量和从GRPC客户端接收的总流量。有关该指标的更多信息，请参阅 [etcd Network](https://github.com/etcd-io/etcd/blob/v3.2.17/Documentation/metrics.md#network)。 |
|gRPC  流式消息|服务器端的gRPC流消息接收速率和发送速率，反映集群内是否正在进行大规模的数据读写操作。 有关指标的更多信息，请参阅 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus#counters)。|
|WAL  日志同步时间|WAL调用fsync的延迟。当ETCD在应用日志条目之前将其日志条目持久保存到磁盘时，将调用`wal_fsync` 。有关该指标的详细信息，请参阅 [etcd Disk](https://etcd.io/docs/v3.3.12/metrics/#grpc-requests)。 |
|DB  同步时间|后端调用的提交延迟分布。 当ETCD将其最新的增量快照提交到磁盘时，将调用 `backend_commit`。 需要注意的是，磁盘操作延迟较大(WAL日志同步时间较长或库同步<时间较长)通常表示磁盘有问题，这可能会导致请求延迟过高或导致集群不稳定。有关该指标的详细信息，请参阅[etcd Disk](https://etcd.io/docs/v3.3.12/metrics/#grpc-requests)。 |
|Raft  提议|- **提议提交速率**记录提交的协商一致提议的速率。 如果群集运行状况良好，则此指标应随着时间的推移而增加。 ETCD群集的几个健康成员可以同时具有不同的一般提议。 单个成员与其领导者之间的持续较大滞后表示该成员是缓慢或不健康的。</br>- **提议应用速率** 记录协商一致提议的总应用率。ETCD服务器异步地应用每个提交的提议。**提议提交速率** 和**提议应用速率** 的差异应该很小 (即使在高负载下也只有几千)。如果它们之间的差异持续增大，则表明 ETCD服务器过载。当使用大范围查询或大量txn操作等大规模查询时，可能会出现这种情况。</br>- **提议失败速率** 记录提议失败的总速率，通常与两个问题有关：与领导人选举相关的临时失败或由于群集中失去法定人数而导致的更长停机时间。</br>- **排队提议数** 记录当前待处理提案的数量。 待处理提案的增加表明客户负载较高或成员无法提交提案。当前仪表板上显示的数据是ETCD成员的平均大小。 有关这些指标的详细信息，请参阅 [ETCD Server](https://etcd.io/docs/v3.3.12/metrics/#server)。 |

![ETCD Monitoring](/images/docs/cluster-administration/cluster-status-monitoring-zh/etcd-monitoring.png)

## APIServer监控

&emsp;&emsp;[API Server](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) 是Kubernetes集群中所有组件交互的中枢。 下表列出了为APIServer监控的主要指标。
|指标|描述|
|---|---|
|请求延迟|按HTTP请求方法分类，以毫秒为单位的资源请求响应延迟。|
|每秒请求次数|Kube-apiserver每秒接受的请求数。|

![APIServer Monitoring](/images/docs/cluster-administration/cluster-status-monitoring-zh/apiserver-monitoring.png)

## 调度器监控

&emsp;&emsp;[调度器](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/) 监控新建Pod的Kubernetes API，并确定这些新Pod运行在哪些节点上。 它根据可用数据做出这一决定，包括收集的资源的可用性和Pod的资源需求。 监控调度延迟的数据可确保您可以看到调度程序面临的任何延迟。
|指标|描述|
|---|---|
|调度次数|包括调度成功、错误和失败的次数。|
|调度频率|包括调度成功、错误和失败的频率。|
|调度延迟|端到端调度时延，即调度算法时延和绑定时延之和|

![Scheduler Monitoring](/images/docs/cluster-administration/cluster-status-monitoring-zh/scheduler-monitoring.png)

## 节点用量排行

&emsp;&emsp;您可以按CPU使用率、CPU平均负载、内存使用率、本地存储用量、innode使用率和Pod用量等指标对节点进行升序和降序排序， 因此管理员能够快速发现潜在问题或发现节点资源不足的情况。
![Node Usage Ranking](/images/docs/cluster-administration/cluster-status-monitoring-zh/node-usage-ranking.png)
