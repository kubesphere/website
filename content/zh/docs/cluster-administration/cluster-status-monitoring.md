---
title: "集群状态监控"
keywords: "Kubernetes, KubeSphere, 状态, 监控"
description: "监控 KubeSphere 集群资源"
linkTitle: "集群状态监控"
weight: 8200
---

KubeSphere 支持对集群 CPU、内存、网络和磁盘等资源的相关指标进行监控。在**集群状态监控**页面，您可以查看历史监控数据并根据不同资源的使用率对节点进行排序。

## 准备工作

您需要一个被授予**集群管理**权限的帐户。例如，您可以直接用 `admin` 帐户登录控制台，或创建一个具有**集群管理**权限的角色然后将此角色授予一个帐户。

## 集群状态监控

1. 点击左上角的**平台管理**，然后选择**集群管理**。

    ![Platform](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/platform.png)

2. 如果您已启用了[多集群功能](../../multicluster-management
)并已导入了 Member 集群，您可以选择一个特定集群以查看其应用程序资源。如果尚未启用该功能，请直接进行下一步。

    ![Clusters Management](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/clusters-management.png)

3. 在左侧导航栏选择**监控告警**下的**集群状态**以查看集群状态概览，包括**集群节点状态**、**组件状态**、**集群资源使用情况**、**ETCD 监控**和**服务组件监控**。

    ![Cluster Status Monitoring](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/cluster-status-monitoring.png)

### 集群节点状态

1. **集群节点状态**显示在线节点和所有节点的数量。您可以点击**节点在线状态**跳转到**集群节点**页面以查看所有节点的实时资源使用情况。

    ![Cluster Nodes](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/cluster-nodes.png)
2. 在**集群节点**页面，点击节点名称可打开**运行状态**页面查看 CPU、内存、容器组 (Pod)、本地存储等资源的使用详情，以及节点健康状态。

    ![Running Status](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/running-status.png)
3. 点击**监控**选项卡，可以查看节点在特定时间范围内的各种运行指标，包括 **CPU 使用情况**、**CPU 平均负载**、**内存使用情况**、**磁盘利用率**、**inode 使用率**、**IOPS**、**磁盘吞吐**和**网络带宽**。

    ![Monitoring](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/monitoring.png)

    {{< notice tip >}}

您可以在右上角的下拉列表中自定义时间范围查看历史数据。

{{</ notice  >}}

### 组件状态

KubeSphere 监控集群中各种服务组件的健康状态。当关键组件发生故障时，系统可能会变得不可用。KubeSphere 的监控机制确保平台可以在组件出现故障时将所有问题通知租户，以便快速定位问题并采取相应的措施。

1. 在**集群状态监控**页面，点击**组件状态**区域的组件以查看其状态。

    ![component-monitoring](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/component-monitoring.png)
2. **服务组件**页面列出了所有的组件。标记为绿色的组件是正常运行的组件，标记为橙色的组件存在问题，需要特别关注。

    ![Service Components Status](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/service-components-status.png)
{{< notice tip >}}
标记为橙色的组件可能会由于各种原因在一段时间后变为绿色，例如重试拉取镜像或重新创建实例。您可以点击一个组件查看其服务详情。
{{</ notice  >}}

### 群集资源使用情况

**集群资源使用情况**显示集群中所有节点的 **CPU 使用情况**、**内存使用情况**、**磁盘利用率**和**容器组数量变化**。您可以点击左侧的饼图切换指标。右侧的曲线图显示一段时间内指示的变化趋势。

![Cluster Resources Usage](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/cluster-resources-usage.png)

## 物理资源监控

您可以利用**物理资源监控**页面提供的数据更好地掌控物理资源状态，并建立正常资源和集群性能的标准。KubeSphere 允许用户查看最近 7 天的集群监控数据，包括 **CPU 使用情况**、**内存使用情况**、**CPU 平均负载（1 分钟/5 分钟/15 分钟）**、**inode 使用率**、**磁盘吞吐（读写）**、**IOPS（读写）**、**网络带宽**和**容器组运行状态**。您可以在 KubeSphere 中自定义时间范围和时间间隔以查看物理资源的历史监控数据。以下简要介绍每个监控指标。

![Physical Resources Monitoring](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/physical-resources-monitoring.png)

### CPU 使用情况

**CPU 使用情况**显示一段时间内 CPU 资源的使用率。如果某一时间段的 CPU 使用率急剧上升，您首先需要定位占用 CPU 资源最多的进程。例如，Java 应用程序代码中的内存泄漏或无限循环可能会导致 CPU 使用率急剧上升。

![CPU Utilization](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/cpu-utilization.png)

### 内存使用情况

内存是机器上的重要组件之一，是与 CPU 通信的桥梁。因此，内存对机器的性能有很大影响。当程序运行时，数据加载、线程并发和 I/O 缓冲都依赖于内存。可用内存的大小决定了程序能否正常运行以及如何运行。**内存使用情况**反映了集群内存资源的整体使用情况，显示为特定时刻内存占用的百分比。

![Memory Utilization](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/memory-utilization.png)

### CPU 平均负载

CPU 平均负载是单位时间内系统中处于可运行状态和非中断状态的平均进程数（亦即活动进程的平均数量）。CPU 平均负载和 CPU 利用率之间没有直接关系。理想情况下，平均负载应该等于 CPU 的数量。因此，在查看平均负载时，需要考虑 CPU 的数量。只有当平均负载大于 CPU 数量时，系统才会超载。

KubeSphere 为用户提供了 1 分钟、5 分钟和 15 分钟三种不同的平均负载。通常情况下，建议您比较这三种数据以全面了解平均负载情况。

- 如果在一定时间范围内 1 分钟、5 分钟和 15 分钟的曲线相似，则表明集群的 CPU 负载相对稳定。
- 如果某一时间范围或某一特定时间点 1 分钟的数值远大于 15 分钟的数值，则表明最近 1 分钟的负载在增加，需要继续观察。一旦 1 分钟的数值超过 CPU 数量，系统可能出现超载，您需要进一步分析问题的根源。
- 如果某一时间范围或某一特定时间点 1 分钟的数值远小于 15 分钟的数值，则表明系统在最近 1 分钟内负载在降低，在前 15 分钟内出现了较高的负载。

![CPU Load Average](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/cpu-load-average.png)

### 磁盘使用量

KubeSphere 的工作负载（例如 `StatefulSets` 和 `DaemonSets`）都依赖于持久卷。某些组件和服务也需要持久卷。这种后端存储依赖于磁盘，例如块存储或网络共享存储。因此，实时的磁盘用量监控环境对确保数据的高可靠性尤为重要。

在 Linux 系统的日常管理中，平台管理员可能会遇到磁盘空间不足导致数据丢失甚至系统崩溃的情况。作为集群管理的重要组成部分，平台管理员需要密切关注系统的磁盘使用情况，并确保文件系统不会被用尽或滥用。通过监控磁盘使用的历史数据，您可以评估特定时间范围内磁盘的使用情况。在磁盘使用率较高的情况下，您可以通过清理不必要的镜像或容器来释放磁盘空间。

![Disk Usage](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/disk-usage.png)

### inode 使用率

每个文件都有一个 inode，用于存储文件的创建者和创建日期等元信息。inode 也会占用磁盘空间，众多的小缓存文件很容易导致 inode 资源耗尽。此外，在 inode 已用完但磁盘未满的情况下，也无法在磁盘上创建新文件。

在 KubeSphere 中，对 inode 使用率的监控可以帮助您清楚地了解集群 inode 的使用率，从而提前检测到此类情况。该机制提示用户及时清理临时文件，防止集群因 inode 耗尽而无法工作。

![inode Utilization](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/inode-utilization.png)

### 磁盘吞吐

磁盘吞吐和 IOPS 监控是磁盘监控不可或缺的一部分，可帮助集群管理员调整数据布局和其他管理活动以优化集群整体性能。磁盘吞吐量是指磁盘传输数据流（包括读写数据）的速度，单位为 MB/s。当传输大块非连续数据时，该指标具有重要的参考意义。

![Disk Throughput](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/disk-throughput.png)

### IOPS

IOPS 表示每秒读取和写入操作数。具体来说，磁盘的 IOPS 是每秒连续读取和写入的总和。当传输小块非连续数据时，该指示器具有重要的参考意义。

![IOPS](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/iops.png)

### 网络带宽

网络带宽是网卡每秒接收或发送数据的能力，单位为 Mbps。

![Network Bandwidth](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/netework-bandwidth.png)

### 容器组运行状态

**容器组运行状态**显示不同状态的 Pod 的总数，包括**运行中**、**已完成**和**异常**状态。标记为**已完成**的 Pod 通常为 Job 或 CronJob。标记为**异常**的 Pod 需要特别注意。

![Pod Status](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/pod-status.png)

## ETCD 监控

**ETCD 监控**可以帮助您更好地利用 etcd，特别用于是定位性能问题。etcd 服务提供了原生的指标接口。KubeSphere 监控系统提供了高度图形化和响应性强的仪表板，用于显示原生数据。

| 指标 | 描述 |
| --- | --- |
| ETCD 节点 | - **是否有 Leader** 表示成员是否有 Leader。如果成员没有 Leader，则成员完全不可用。如果集群中的所有成员都没有任何 Leader，则整个集群完全不可用。<br>- **Leader 变更次数**表示集群成员观察到的 Leader 变更总次数。频繁变更 Leader 将显著影响 etcd 性能，同时这还表明 Leader 可能由于网络连接问题或 etcd 集群负载过高而不稳定。 |
| 库大小 | etcd 的底层数据库大小，单位为 MiB。图表中显示的是 etcd 的每个成员数据库的平均大小。 |
| 客户端流量 | 包括发送到 gRPC 客户端的总流量和从 gRPC 客户端接收的总流量。有关该指标的更多信息，请参阅[ etcd Network](https://github.com/etcd-io/etcd/blob/v3.2.17/Documentation/metrics.md#network)。 |
| gRPC 流式消息 | 服务器端的 gRPC 流消息接收速率和发送速率，反映集群内是否正在进行大规模的数据读写操作。有关该指标的更多信息，请参阅[ go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus#counters)。 |
| WAL 日志同步时间 | WAL 调用 fsync 的延迟。在应用日志条目之前，etcd 会在持久化日志条目到磁盘时调用 `wal_fsync`。有关该指标的更多信息，请参阅[ etcd Disk](https://etcd.io/docs/v3.3.12/metrics/#disk)。 |
| 库同步时间 | 后端调用提交延迟的分布。当 etcd 将其最新的增量快照提交到磁盘时，会调用 `backend_commit`。需要注意的是，磁盘操作延迟较大（WAL 日志同步时间或库同步时间较长）通常表示磁盘存在问题，这可能会导致请求延迟过高或集群不稳定。有关该指标的详细信息，请参阅[ etcd Disk](https://etcd.io/docs/v3.3.12/metrics/#disk)。 |
| Raft 提议 | - **提议提交速率**记录提交的协商一致提议的速率。如果群集运行状况良好，则该指标应随着时间的推移而增加。etcd 集群的几个健康成员可以同时具有不同的一般提议。单个成员与其 Leader 之间的持续较大滞后表示该成员缓慢或不健康。<br>- **提议应用速率**记录协商一致提议的总应用率。etcd 服务器异步地应用每个提交的提议。**提议提交速率**和**提议应用速率**的差异应该很小（即使在高负载下也只有几千）。如果它们之间的差异持续增大，则表明 etcd 服务器过载。当使用大范围查询或大量 txn 操作等大规模查询时，可能会出现这种情况。<br>- **提议失败速率**记录提议失败的总速率。这通常与两个问题有关：与 Leader 选举相关的临时失败或由于群集成员数目达不到规定数目而导致的长时间停机。<br>- **排队提议数**记录当前待处理提议的数量。待处理提议的增加表明客户端负载较高或成员无法提交提议。<br>目前，仪表板上显示的数据是 etcd 成员的平均数值。有关这些指标的详细信息，请参阅[ etcd Server](https://etcd.io/docs/v3.3.12/metrics/#server)。 |

![ETCD Monitoring](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/etcd-monitoring.png)

## APIServer 监控

[APIServer](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) 是 Kubernetes 集群中所有组件交互的中枢。下表列出了 APIServer 的主要监控指标。

| 指标 | 描述 |
| --- | --- |
| 请求延迟 | 资源请求响应延迟，单位为毫秒。该指标按照 HTTP 请求方法进行分类。 |
| 每秒请求次数 | kube-apiserver 每秒接受的请求数。 |

![APIServer Monitoring](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/apiserver-monitoring.png)

## 调度器监控

[调度器](https://kubernetes.io/zh/docs/reference/command-line-tools-reference/kube-scheduler/)监控新建 Pod 的 Kubernetes API，并决定这些新 Pod 运行在哪些节点上。调度器根据收集资源的可用性和 Pod 的资源需求等数据进行决策。监控调度延迟的数据可确保您及时了解调度器的任何延迟。

| 指标 | 描述 |
| --- | --- |
| 调度次数 | 包括调度成功、错误和失败的次数。 |
| 调度频率 | 包括调度成功、错误和失败的频率。 |
| 调度延迟 | 端到端调度延迟，即调度算法延迟和绑定延迟之和。 |

![Scheduler Monitoring](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/scheduler-monitoring.png)

## 节点用量排行

您可以按 **CPU 使用率**、**CPU 平均负载**、**内存使用率**、**本地存储用量**、**inode 使用率**和**容器组用量**等指标对节点进行升序和降序排序。您可以利用这一功能快速发现潜在问题和节点资源不足的情况。

![Node Usage Ranking](/images/docs/zh-cn/cluster-administration/cluster-status-monitoring/node-usage-ranking.png)