---
title: "Cluster Status Monitoring"
keywords: "Kubernetes, KubeSphere, status, monitoring"
description: "Monitor how a cluster is functioning based on different metrics, including physical resources, etcd, and API server."
linkTitle: "Cluster Status Monitoring"
weight: 8200
version: "v3.4"
---

KubeSphere provides monitoring of related metrics such as CPU, memory, network, and disk of the cluster. You can also review historical monitoring data and sort nodes by different indicators based on their usage in **Cluster Status**.

## Prerequisites

You need a user granted a role including the authorization of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to a user.

## Cluster Status Monitoring

1. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. If you have enabled the [multi-cluster feature](../../multicluster-management/) with member clusters imported, you can select a specific cluster to view its application resources. If you have not enabled the feature, refer to the next step directly.

3. Choose **Cluster Status** under **Monitoring & Alerting** to see the overview of cluster status monitoring, including **Cluster Node Status**, **Component Status**, **Cluster Resource Usage**, **etcd Monitoring**, and **Service Component Monitoring**.

### Cluster node status

1. **Cluster Nodes Status** displays the status of all nodes, separately marking the active ones. You can go to the **Cluster Nodes** page to view the real-time resource usage of all nodes by clicking **Node Online Status**.

2. In **Cluster Nodes**, click the node name to view usage details in **Running Status**, including **Resource Usage**, **Allocated Resources**, and **Health Status**.

3. Click the **Monitoring** tab to view how the node is functioning during a certain period based on different metrics, including **CPU Usage**, **Average CPU Load**, **Memory Usage**, **Disk Usage**, **Inode Usage**, **IOPS**, **Disk Throughput**, and **Network Bandwidth**.

    {{< notice tip >}}You can customize the time range from the drop-down list in the upper-right corner to view historical data.
{{</ notice >}}

### Component status

KubeSphere monitors the health status of various service components in the cluster. When a key component malfunctions, the system may become unavailable. The monitoring mechanism of KubeSphere ensures the platform can notify tenants of any occurring issues in case of a component failure, so that they can quickly locate the problem and take corresponding action.

1. On the **Cluster Status** page, click a component under  **Component Status** to view its status.

2. You can see all the components are listed in this part. Components marked in green are those functioning normally while those marked in orange require special attention as it signals potential issues.

    {{< notice tip >}}Components marked in orange may turn to green after a period of time, the reasons of which may be different, such as image pulling retries or pod recreations. You can click the component to see its service details.
{{</ notice >}}

### Cluster resource usage

**Cluster Resource Usage** displays the information including **CPU Usage**, **Memory Usage**, **Disk Usage**, and **Pods** of all nodes in the cluster. Click the pie chart on the left to switch indicators, which shows the trend during a period in a line chart on the right.

## Physical Resource Monitoring

Monitoring data in **Physical Resource Monitoring** help users better observe their physical resources and establish normal standards for resource and cluster performance. KubeSphere allows users to view cluster monitoring data within the last 7 days, including **CPU Usage**, **Memory Usage**, **Average CPU Load (1 minute/5 minutes/15 minutes)**, **Disk Usage**, **Inode Usage**, **Disk Throughput (read/write)**, **IOPS (read/write)**, **Network Bandwidth**, and **Pod Status**. You can customize the time range and time interval to view historical monitoring data of physical resources in KubeSphere. The following sections briefly introduce each monitoring indicator.

### CPU usage

CPU usage shows how CPU resources are used in a period. If you notice that the CPU usage of the platform during a certain period soars, you must first locate the process that is occupying CPU resources the most. For example, for Java applications, you may expect a CPU usage spike in the case of memory leaks or infinite loops in the code.

### Memory usage

Memory is one of the important components on a machine, serving as a bridge for communications with the CPU. Therefore, the performance of memory has a great impact on the machine. Data loading, thread concurrency and I/O buffering are all dependent on memory when a program is running. The size of available memory determines whether the program can run normally and how it is functioning. Memory usage reflects how memory resources are used within a cluster as a whole, displayed as a percentage of available memory in use at a given moment.

### Average CPU load

Average CPU load is the average number of processes in the system in a runnable state and an uninterruptible state per unit time. Namely, it is the average number of active processes. Note that there is no direct relation between the average CPU load and the CPU usage. Ideally, the average load should be equal to the number of CPUs. Therefore, you need to consider the number of CPUs when you look into the average load. A system is overloaded only when the average load is greater than the number of CPUs.

KubeSphere provides users with three different time periods to view the average load: 1 minute, 5 minutes, and 15 minutes. Normally, it is recommended that you review all of them to gain a comprehensive understanding of average CPU load:

- If the curves of 1 minute / 5 minutes / 15 minutes are similar within a certain period, it indicates that the CPU load of the cluster is relatively stable.
- If the value of 1 minute in a certain period, or at a specific time point is much greater than that of 15 minutes, it means that the load in the last 1 minute is increasing, and you need to keep observing. Once the value of 1 minute exceeds the number of CPUs, it may mean that the system is overloaded. You need to further analyze the source of the problem.
- Conversely, if the value of 1 minute in a certain period, or at a specific time point is much less than that of 15 minutes, it means that the load of the system is decreasing in the last 1 minute, and a high load has been generated in the previous 15 minutes.

### Disk usage

KubeSphere workloads such as `StatefulSets` and `DaemonSets` all rely on persistent volumes. Some components and services also require a persistent volume. Such backend storage relies on disks, such as block storage or network shared storage. In this connection, providing a real-time monitoring environment for disk usage is an important part of maintaining the high reliability of data.

In the daily management of the Linux system, platform administrators may encounter data loss or even system crashes due to insufficient disk space. As an essential part of cluster management, they need to pay close attention to the disk usage of the system and ensure that the file system is not filling up or abused. By monitoring the historical data of disk usage, you can evaluate how disks are used during a given period of time. In the case of high disk usage, you can free up disk space by cleaning up unnecessary images or containers.

### Inode usage

Each file must have an inode, which is used to store the file's meta-information, such as the file's creator and creation date. The inode will also consume hard disk space, and many small cache files can easily lead to the exhaustion of inode resources. Also, the inode may be used up, but the hard disk is not full. In this case, new files cannot be created on the hard disk.

In KubeSphere, the monitoring of inode usage can help you detect such situations in advance, as you can have a clear view of cluster inode usage. The mechanism prompts users to clean up temporary files in time, preventing the cluster from being unable to work due to inode exhaustion.

### Disk throughput

The monitoring of disk throughput and IOPS is an indispensable part of disk monitoring, which is convenient for cluster administrators to adjust data layout and other management activities to optimize the overall performance of the cluster. Disk throughput refers to the speed of the disk transmission data stream (shown in MB/s), and the transmission data are the sum of data reading and writing. When large blocks of discontinuous data are being transmitted, this indicator is of great importance for reference.

### IOPS

**IOPS (Input/Output Operations Per Second)** represents a performance measurement of the number of read and write operations per second. Specifically, the IOPS of a disk is the sum of the number of continuous reads and writes per second. This indicator is of great significance for reference when small blocks of discontinuous data are being transmitted.

### Network bandwidth

The network bandwidth is the ability of the network card to receive or send data per second, shown in Mbps (megabits per second).

### Pod status

Pod status displays the total number of pods in different states, including **Running**, **Completed** and **Warning**. The pod tagged **Completed** usually refers to a Job or a CronJob. The number of pods marked **Warning**, which means an abnormal state, requires special attention.

## etcd Monitoring

etcd monitoring helps you to make better use of etcd, especially to locate performance problems. The etcd service provides metrics interfaces natively, and the KubeSphere monitoring system features a highly graphic and responsive dashboard to display its native data.

|Indicators|Description|
|---|---|
|Service Status | - **Leader exists** indicates whether the member has a Leader. If a member does not have a Leader, it is completely unavailable. If all members in the cluster do not have any Leader, the entire cluster is completely unavailable. <br>- **Leader changes in 1 h** refers to the number of Leader changes seen by members of the cluster in 1 hour. Frequent Leader changes will significantly affect the performance of etcd. It also shows that the Leader is unstable, possibly due to network connection issues or excessive loads hitting the etcd cluster. |
|DB Size | The size of the underlying database (in MiB) of etcd. The current graph shows the average size of each member database of etcd. |
|Client Traffic|It includes the total traffic sent to the gRPC client and the total traffic received from the gRPC client. For more information about the indicator, see [etcd Network](https://github.com/etcd-io/etcd/blob/v3.2.17/Documentation/metrics.md#network). |
|gRPC Stream Message|The gRPC streaming message receiving rate and sending rate on the server side, which reflects whether large-scale data read and write operations are happening in the cluster. For more information about the indicator, see [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus#counters).|
|WAL Fsync|The latency of WAL calling fsync. A `wal_fsync` is called when etcd persists its log entries to disk before applying them. For more information about the indicator, see [etcd Disk](https://etcd.io/docs/v3.5/metrics/#grpc-requests). |
|DB Fsync|The submission delay distribution of the backend calls. When etcd submits its most recent incremental snapshot to disk, a `backend_commit` will be called. Note that high latency of disk operations (long WAL log synchronization time or library synchronization time) usually indicates disk problems, which may cause high request latency or make the cluster unstable. For more information about the indicator, see [etcd Disk](https://etcd.io/docs/v3.5/metrics/#grpc-requests). |
|Raft Proposal|- **Proposal Commit Rate** records the rate of consensus proposals committed. If the cluster is healthy, this indicator should increase over time. Several healthy members of an etcd cluster may have different general proposals at the same time. A continuous large lag between a single member and its leader indicates that the member is slow or unhealthy. <br>- **Proposal Apply Rate** records the total rate of consensus proposals applied. The etcd server applies each committed proposal asynchronously. The difference between the **Proposal Commit Rate** and the **Proposal Apply Rate** should usually be small (only a few thousands even under high loads). If the difference between them continues to rise, it indicates that the etcd server is overloaded. This can happen when using large-scale queries such as heavy range queries or large txn operations. <br>- **Proposal Failure Rate** records the total rate of failed proposals, usually related to two issues: temporary failures related to leader election or longer downtime due to a loss of quorum in the cluster. <br> - **Proposal Pending Total** records the current number of pending proposals. An increase in pending proposals indicates high client loads or members unable to submit proposals. <br> Currently, the data displayed on the dashboard is the average size of etcd members. For more information about these indicators, see [etcd Server](https://etcd.io/docs/v3.5/metrics/#server). |

## API Server Monitoring

[API Server](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) is the hub for the interaction of all components in a Kubernetes cluster. The following table lists the main indicators monitored for the API Server.

|Indicators|Description|
|---|---|
|Request Latency|Classified by HTTP request methods, the latency of resource request response in milliseconds.|
|Request per Second|The number of requests accepted by kube-apiserver per second.|

## Scheduler Monitoring

[Scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/) monitors the Kubernetes API of newly created pods and determines which nodes these new pods run on. It makes this decision based on available data, including the availability of collected resources and the resource requirements of the Pod. Monitoring data for scheduling delays ensures that you can see any delays facing the scheduler.

|Indicators|Description|
|---|---|
|Attempt Frequency|Include the number of scheduling successes, errors, and failures.|
|Attempt Rate|Include the scheduling rate of successes, errors, and failures.|
|Scheduling latency|End-to-end scheduling delay, which is the sum of scheduling algorithm delay and binding delay|

## Resource Usage Ranking

You can sort nodes in ascending and descending order by indicators such as CPU usage, average CPU load, memory usage, disk usage, inode usage, and Pod usage. This enables administrators to quickly find potential problems or identify a node's insufficient resources.
