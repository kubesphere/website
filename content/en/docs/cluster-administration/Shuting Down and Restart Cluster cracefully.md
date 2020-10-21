---
title: "Shutting Down and Restart Cluster Gracefully"
description: "Demonstrate how to shut down and restart kubernetes cluster Gracefully"
layout: "single"

linkTitle: "Shutting Down and Restart Cluster Gracefully"
weight: 2000

icon: "/images/docs/docs.svg"
---
This document describes the process to gracefully shut down your cluster. You might need to temporarily shut down your cluster for maintenance reasons.

{{< notice warning >}}
Shutting down a cluster is very dangerous. You must fully understand the operation and its consequences. Please make an etcd backup before you proceed.
Usually, it is recommended to maintain your nodes one by one instead of restarting the whole cluster.
{{</ notice >}}

### Prerequisites
Take an [etcd buckup](https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/recovery.md#snapshotting-the-keyspace) prior to shutting down the cluster.
Ssh [keyless login](https://man.openbsd.org/ssh.1#AUTHENTICATION) is set up between hosts.

### Shutting Down the Cluster
{{< notice warning >}}
You must back up your etcd data before you shut down the cluster as your cluster can be restored if you encounter any issues when restarting the cluster.
{{</ notice >}}

{{< notice tip >}}
Using the method in this tutorial can shut down a cluster gracefully, while the possibility of data corruption still exists.
{{</ notice >}}

### Step 1: Get the List of Nodes.
```bash
nodes=$(kubectl get nodes -o name)
```
### Step 2: Shut Down all Nodes
```bash
for node in ${nodes[@]}
do
    echo "==== Shut down $node ===="
    ssh $node sudo shutdown -h 1
done
```
Then you can shut down other cluster dependencies, such as external storage.

## Restart the Cluster Gracefully
This is about restarting the cluster gracefully after shutting down cluster gracefully.

### Prerequisites
You had shutdown your cluster gracefully.

{{< notice tip >}}
Usually, the cluster can be used after restarting, but the cluster may be unavailable due to unexpected conditions, for example:
- The Etcd Data Corruption During Shutdown.
- Node Status is Failure.
- Network Exception.
{{</ notice >}}

### Step 1: Check all Cluster Dependencies Status.
Ensure all Cluster Dependencies are Ready, such as External Storage.
### Step 2: Power on cluster machines.
Wait for the cluster make ready, it takes about 10 minutes.
### Step 3: Check all Master Nodes Status.
Check core components status, such as etcd service, make sure everything is ready.
```bash
kubectl get nodes -l node-role.kubernetes.io/master
```

### Step 4: Check all Woker Nodes Status.
```bash
kubectl get nodes -l node-role.kubernetes.io/worker
```

If your cluster fails to restart, maybe you should [restore etcd cluster](https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/recovery.md#restoring-a-cluster).
