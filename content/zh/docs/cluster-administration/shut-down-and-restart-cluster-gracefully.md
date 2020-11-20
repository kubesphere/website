---
title: "集群关闭和重新启动"
description: "Demonstrate how to shut down and restart Kubernetes clusters gracefully"
layout: "single"

linkTitle: "集群关闭和重新启动"
weight: 5000

icon: "/images/docs/docs.svg"
---

出于维护原因，您可能需要临时关闭群集。本文档介绍了正常关闭集群的过程以及如何重新启动集群。

{{< notice warning >}}
关闭群集非常危险。 您必须完全了解所做的操作及其后果。 请先进行etcd备份，然后再继续。 通常建议一 一维护您的节点，而不是重新启动整个集群。
{{</ notice >}}

## 前提条件

- 关闭群集之前，请先进行[etcd备份](https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/recovery.md#snapshotting-the-keyspace)。
- 主机之间设置了SSH[免密登录](https://man.openbsd.org/ssh.1#AUTHENTICATION)。

## 关闭集群

{{< notice tip >}}

- 关闭群集之前，必须备份etcd数据，因为如果在重新启动群集时遇到任何问题，则可以通过etcd还原群集。
- 使用本教程中的方法可以正常关闭集群，而数据损坏的可能性仍然存在。

{{</ notice >}}

### 步骤 1: 获取节点列表

```bash
nodes=$(kubectl get nodes -o name)
```

### 步骤 2: 关闭所有节点

```bash
for node in ${nodes[@]}
do
    echo "==== Shut down $node ===="
    ssh $node sudo shutdown -h 1
done
```

然后，您可以关闭其他群集依赖项，例如外部存储。

## 正常重启群集

在正常关闭集群后，可以正常重启集群。

### 前提条件

您已正常关闭集群。

{{< notice tip >}}
大多数情况下，重新启动集群后可以继续正常使用，但是由于意外情况，该集群可能不可用。 例如:

- 关闭期间Etcd数据损坏。
- 节点故障。
- 不可预期的网络错误。

{{</ notice >}}

### 步骤 1: 检查所有群集依赖项的状态

确保所有群集依赖项均已就绪，例如外部存储。

### 步骤 2: 打开集群主机电源

等待集群启动并运行，这可能需要大约10分钟。

### 步骤 3: 检查所有主节点的状态

检查核心组件（例如etcd服务）的状态，并确保一切就绪。

```bash
kubectl get nodes -l node-role.kubernetes.io/master
```

### 步骤 4: 检查所有工作节点的状态

```bash
kubectl get nodes -l node-role.kubernetes.io/worker
```

如果您的集群重启失败，请尝试[恢复etcd集群](https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/recovery.md#restoring-a-cluster)。
