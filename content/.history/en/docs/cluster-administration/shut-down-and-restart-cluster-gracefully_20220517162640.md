---
title: "Cluster Shutdown and Restart"
description: "Learn how to gracefully shut down your cluster and restart it."
layout: "single"

linkTitle: "Cluster Shutdown and Restart"
weight: 8800

icon: "/images/docs/docs.svg"
---
This document describes the process of gracefully shutting down your Kubernetes cluster and how to restart it. You might need to temporarily shut down your cluster for maintenance reasons.

{{< notice warning >}}
Shutting down a cluster is very dangerous. You must fully understand the operation and its consequences. Please make an etcd backup before you proceed.
Usually, it is recommended to maintain your nodes one by one instead of restarting the whole cluster.
{{</ notice >}}

## Prerequisites
- Take an [etcd backup](https://etcd.io/docs/current/op-guide/recovery/#snapshotting-the-keyspace) prior to shutting down a cluster.
- SSH [passwordless login](https://man.openbsd.org/ssh.1#AUTHENTICATION) is set up between hosts.

## Shut Down a Kubernetes Cluster
{{< notice tip >}}

- You must back up your etcd data before you shut down the cluster as your cluster can be restored if you encounter any issues when restarting the cluster.
- Using the method in this tutorial can shut down a cluster gracefully, while the possibility of data corruption still exists.

{{</ notice >}}

### Step 1: Get the node list
```bash
nodes=$(kubectl get nodes -o name)
```
### Step 2: Shut down all nodes
```bash
for node in ${nodes[@]}
do
    echo "==== Shut down $node ===="
    ssh $node sudo shutdown -h 1
done
```
Then you can shut down other cluster dependencies, such as external storage.

## Restart a Cluster Gracefully
You can restart a cluster gracefully after shutting down the cluster gracefully.

### Prerequisites
You have shut down your cluster gracefully.

{{< notice tip >}}
Usually, a cluster can be used after restarting, but the cluster may be unavailable due to unexpected conditions. For example:

- etcd data corruption during the shutdown.
- Node failures.
- Unexpected network errors.

{{</ notice >}}

### Step 1: Check all cluster dependencies' status
Ensure all cluster dependencies are ready, such as external storage.
### Step 2: Power on cluster machines
Wait for the cluster to be up and running, which may take about 10 minutes.
### Step 3: Check the status of all control plane components
Check the status of core components, such as etcd services, and make sure everything is ready.
```bash
kubectl get nodes -l node-role.kubernetes.io/master
```

### Step 4: Check all worker nodes' status
```bash
kubectl get nodes -l node-role.kubernetes.io/worker
```

If your cluster fails to restart, please try to [restore the etcd cluster](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster).
