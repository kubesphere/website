---
title: "Cluster Status Monitoring"
keywords: "Kubernetes, docker, kubesphere, Prometheus"
description: "Kubernetes and KubeSphere node management"

linkTitle: "Cluster Status Monitoring"
weight: 300
---

KubeSphere provides monitoring of related indicators such as CPU, memory, network, and disk of the cluster, and supports reviewing historical monitoring and node usage rankings in **Cluster Status Monitoring**.

## Prerequisites 

You need an account granted a role including the authorization of Clusters Management. For example, you can log in the console as admin directly or create a new role with the authorization and assign it to an account.

## Cluster Status Monitoring

Click **Platform** in the top left corner and select **Clusters Management**.

![Platform](/images/docs/cluster-administration/cluster-status-monitoring/platform.png)

If you have enabled the multi-cluster feature with member clusters imported, you can select a specific cluster to view its application resources. If you have not enabled the feature, refer to the next step directly.

![Clusters Management](/images/docs/cluster-administration/cluster-status-monitoring/clusters-management.png)

Click **Monitoring & Alerting -> Cluster Status** to enter the overview page of cluster status monitoring, including **Cluster Node Status, Components Status, Cluster Resources Usage, ETCD Monitoring, Service Component Monitoring**, as shown in the following figure.

![Cluster Status Monitoring](/images/docs/cluster-administration/cluster-status-monitoring/cluster-status-monitoring.png)

### Cluster Node Status

Cluster node status displays the current online status of all nodes, and supports drilling down to the host management page to view the real-time resource usage of all hosts, click **Node Online Status** to enter the cluster nodes page.

![Cluster Nodes](/images/docs/cluster-administration/cluster-status-monitoring/cluster-nodes.png)

Click the node name to enter the running status page of the node, it displays the information of CPU, Memory, Pod, Local Storage in the current node, and health status of the current node.

![Running Status](/images/docs/cluster-administration/cluster-status-monitoring/running-status.png)

Click the tab **Monitoring** to enter the monitoring page of the current node, including **CPU Utilization, CPU Load Average, Memory Utilization. Disk Utilization, inode Utilization, IOPS, DISK Throughput, Network Bandwidth**, as shown in the following figure.

![Monitoring](/images/docs/cluster-administration/cluster-status-monitoring/monitoring.png)

### Components Status

KubeSphere provides the health status monitoring of various service components in the cluster. If some key service components are abnormal, the system may become unavailable. View the health status and running time of the current cluster service components, which can help users monitor the status of the cluster and locate problems in time.

Click **Components Status** to enter the detail page of service components.

![Service Components Status](/images/docs/cluster-administration/cluster-status-monitoring/service-components-status.png)

### Cluster Resources Usage

Cluster resources usage displays the indicators **Utilization of CPU, Memory, Disk, and Pod Quantity Trend** of all nodes in the cluster. Click the pie chart on the left to switch indicators, it will show the change of indicators in the last 15 minutes.

![Cluster Resources Usage](/images/docs/cluster-administration/cluster-status-monitoring/cluster-resources-usage.png)

## Physical Resources Monitoring

Physical resource monitoring data can help users observe and establish normal standards for resources and cluster performance. KubeSphere supports viewing cluster monitoring data within 7 days, including CPU utilization, memory utilization, and average CPU load (1 minute / 5 minutes / 15 Minutes), inode usage rate, disk throughput (read/write), IOPS (read/write), network card rate (out/in), container group operating status. KubeSphere supports custom time range and time interval to view historical monitoring status. The following briefly introduces the meaning of each monitoring indicator.

![Physical Resources Monitoring](/images/docs/cluster-administration/cluster-status-monitoring/physical-resources-monitoring.png)

### Monitoring indicators

#### CPU Utilization

CPU utilization is the statistics of CPU usage in a period. Through this indicator, it can see the situation of the CPU occupied in a period. In monitoring, if you find that the CPU usage of the system during a certain period soars, you must first locate which process is occupying the higher CPU. For example, for Java applications, there may be memory leaks or infinite loops in the code.

![CPU Utilization](/images/docs/cluster-administration/cluster-status-monitoring/cpu-utilization.png)

#### Memory Utilization

Memory is one of the important components on the computer, it is a bridge to communicate with the CPU, so the performance of the memory has a great impact on the computer. Data loading, thread concurrency, I/O buffering, etc. when the program is running all rely on memory. The size of available memory determines whether the program can run normally and the performance of the operation and the memory utilization rate can reflect the memory utilization status of the cluster And performance.

![Memory Utilization](/images/docs/cluster-administration/cluster-status-monitoring/memory-utilization.png)

#### CPU Load Average

CPU load average is the average number of processes in the system in a runnable state,  and an uninterruptible state per unit of time, that is, the average number of active processes. Pay attention to that there is no direct relationship between the CPU load average, and the CPU usage rate. So when is the average load reasonable? The average load should be equal to the number of CPUs under ideal conditions, so when judging the average load, first determine how many CPUs the system has. Only when the average load is more than the number of CPUs, it means that the system is overload.

Now the problem is how to look at the CPU load average when it is divided into 1 minute / 5 minutes / 15 minutes in the figure below.

Under normal circumstances, all three times must be viewed. By analyzing the trend of system load, we can get a more comprehensive understanding of the current load status:

- If the curves of 1 minute / 5 minutes / 15 minutes are similar within a certain period, it indicates that the CPU load of the cluster is relatively stable
- If the value of 1 minute in a certain period, or a time point is much greater than 15 minutes, it means that the load in the last 1 minute is increasing, and you need to keep observation. Once the value of 1 minute exceeds the number of CPUs, it may mean that the system is overload. We need to further analyze the source of the problem.
- Conversely, if the value of 1 minute in a certain period, or a time point is much less than 15 minutes, it means that the load of the system has decreased in the last 1 minute, and a high load has been generated in the previous 15 minutes.

![CPU Load Average](/images/docs/cluster-administration/cluster-status-monitoring/cpu-load-average.png)

#### Disk Usage

The workload of KubeSphere such as `StatefulSets` and `DaemonSets` all rely on persistent volume, and some of its components and services also require a persistent volume to provide support, and such back-end storage relies on disks, such as Block storage or network shared storage. Providing a real-time monitoring environment for disk usage is an important part of maintaining high data reliability, because, in the daily management of the Linux system, platform administrators may encounter data loss or even system crashes due to insufficient disk space. Therefore, paying attention to the disk usage of the system and ensuring that the file system does not be filled, or abused is an important task of cluster management. By monitoring the historical data of disk usage, you can know the disk usage in advance. If you find that the disk usage is too high, you can save disk space by cleaning up unnecessary images or containers.

![Disk Usage](/images/docs/cluster-administration/cluster-status-monitoring/disk-usage.png)

#### inode Utilization

Each file must have an inode, which is used to store the file's meta-information, such as the file's creator and creation date. The inode will also consume hard disk space, and many small cache files can easily lead to the exhaustion of inode resources. Also, the inode may be used up, but the hard disk is not full, and new files cannot be created on the hard disk at this time. The monitoring of inode usage can just detect the above-mentioned situations in advance, help users know the usage of cluster inodes, prevent the cluster from being unable to work due to inode exhaustion, and prompt users to clean up temporary files in time.

![inode Utilization](/images/docs/cluster-administration/cluster-status-monitoring/inode-utilization.png)

#### Disk Throughput

The monitoring of disk throughput and IOPS is an indispensable part of disk monitoring, which is convenient for cluster administrators to adjust data layout and other management activities to optimize the overall performance of the cluster. Disk throughput refers to the speed of the disk transmission data stream, the unit is MB/s, and the transmission data is the sum of reading data and write data. When transmitting large blocks of discontinuous data, this indicator has an important reference role.
![Disk Throughput](/images/docs/cluster-administration/cluster-status-monitoring/disk-throughput.png)

#### IOPS

A disk I/O is a continuous read or write of a disk. The IOPS of a disk is the sum of the number of continuous reads and writes per second. This indicator has an important reference significance when transmitting small discontinuous data.

![IOPS](/images/docs/cluster-administration/cluster-status-monitoring/iops.png)

#### Network Bandwidth

The network bandwidth is the ability of the network card to receive or send data per second, in Mbps (megabits per second).

![Network Bandwidth](/images/docs/cluster-administration/cluster-status-monitoring/netework-bandwidth.png)

#### Pod Status

Pod status displays the total number of pods in different states, including Running, Completed and Warning. The pod tagged Completed usually refers to a Job or a CronJob. The number of pods marked Warning, which means an abnormal state, requires special attention.

![Pod Status](/images/docs/cluster-administration/cluster-status-monitoring/pod-status.png)

## ETCD Monitoring

ETCD monitoring is useful to make good use of ETCD, especially to locate performance problems. The ETCD service provides metrics interfaces natively, and the KubeSphere monitoring system provides a good monitoring display effect for its native data.

|Monitoring indicators|Description|
|---|---|
|ETCD Nodes | - `Is there a Leader`: Indicates whether the member has a Leader. If the member does not have a Leader, it is completely unavailable. If all members in the cluster do not have any Leader, the entire cluster is completely unavailable. <br> - `Leader change times`: Used to calculate the times of Leader changed seen by members of the cluster since the beginning. Frequent Leader changes will significantly affect the performance of ETCD. It also shows that the leader is unstable, possibly due to network connection issues or excessive load hitting the ETCD cluster|
|DB Size | The size of the underlying database (in MiB) of ETCD, the current display is the average size of each member database of ETCD. |
|Client Traffic|Including the total traffic sent to the grpc client and the total traffic received from the grpc client, for more information about indicators, see [etcd Network](https://github.com/etcd-io/etcd/blob/v3.2.17/Documentation/metrics.md#network) |
|gRPC Stream Messages|The gRPC streaming message receiving rate and sending rate on the server-side, which can reflect whether there are large-scale data read and write operations in the cluster, for more information about indicators, see [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus#counters)|
|WAL Fsync|The delay of WAL calling fsync, when ETCD keeps its log entries to disk before applying them, wal_fsync will be called, for more information about indicators, see [etcd Disk](https://etcd.io/docs/v3.3.12/metrics/#grpc-requests) |
|DB Fsync|The submission delay distribution of the backend calls. When ETCD submits its most recent incremental snapshot to disk, backend_commit will be called. Note that high latency of disk operations (long WAL log synchronization time or library synchronization time) usually indicates disk problems, which may cause high request latency or make the cluster unstable, for more information about indicators, see [etcd Disk](https://etcd.io/docs/v3.3.12/metrics/#grpc-requests) |
|Raft Proposals| - `Proposal Commit Rate`: Record the rate of consensus proposals committed. If the cluster is healthy, this indicator should increase over time. Several healthy members of the ETCD cluster may have different general proposals at the same time. The continuous large lag between a single member and its leader indicates that the member is slow or unhealthy. <br> - `Proposal Apply Rate`: Record the total rate of consensus proposals applied. The ETCD server applies each committed proposal asynchronously. The difference between the proposal commit rate and the proposal apply rate should usually be small (only a few thousand even under high load). If the difference between them continues to rise, it indicates that the ETCD server is overloaded. This can happen when using large-scale queries such as heavy range queries or large txn operations. <br> - `Proposal Failure Rate`: The total rate of failed proposals, usually related to two issues, temporary failures related to leader election or longer downtime due to loss of arbitration in the cluster. <br> - `Proposal Pending Total`: The current number of pending proposals. An increase in pending proposals indicates high client load or members unable to submit proposals. <br> Currently, the data displayed on the interface is the average size of the ETCD member indicators. For more information about indicators, see [etcd Server](https://etcd.io/docs/v3.3.12/metrics/#server).

![ETCD Monitoring](/images/docs/cluster-administration/cluster-status-monitoring/etcd-monitoring.png)

## APIServer Monitoring

[API Server](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) is the hub for the interaction of all components in a Kubernetes cluster. The following table lists the main indicators monitored for the APIServer.

|Monitoring indicators|Description|
|---|---|
|Request Latency|Classified statistics by HTTP request method, the latency of resource request response in milliseconds|
|Request Per Second|The number of requests accepted by kube-apiserver per second|

![APIServer Monitoring](/images/docs/cluster-administration/cluster-status-monitoring/apiserver-monitoring.png)

## Scheduler Monitoring

[Scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/) monitors the Kubernetes API of newly created pods and determines which nodes these new pods run on. It makes this decision based on available data, including the availability of collected resources and the resource requirements of the Pod. Monitoring data for scheduling delays ensures that you can see any delays facing the scheduler.

|Monitoring indicators|Description|
|---|---|
|Attempt Frequency|Including the number of scheduling successes, errors, and failures|
|Attempt Rate|Including scheduling rate of success, error, and failure|
|Scheduling latency|End-to-end scheduling delay, which is the sum of scheduling algorithm delay and binding delay|

![Scheduler Monitoring](/images/docs/cluster-administration/cluster-status-monitoring/scheduler-monitoring.png)

## Node Usage Ranking

You can sort nodes in ascending and descending order by indicators such as CPU, Load Average, Memory, Local Storage, inode Utilization, and Pod Utilization. This enables administrators to quickly find potential problems or identify a node's insufficient resources.

![Node Usage Ranking](/images/docs/cluster-administration/cluster-status-monitoring/node-usage-ranking.png)
