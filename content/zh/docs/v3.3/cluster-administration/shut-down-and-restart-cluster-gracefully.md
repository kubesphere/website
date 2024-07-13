---
title: "关闭和重启集群"
description: "了解如何平稳地关闭和重启集群。"
layout: "single"

linkTitle: "关闭和重启集群"
weight: 89000

icon: "/images/docs/v3.x/docs.svg"
version: "v3.3"
---

您可能需要临时关闭集群进行维护。本文介绍平稳关闭集群的流程以及如何重新启动集群。

{{< notice warning >}}
关闭集群是非常危险的操作。您必须完全了解该操作及其后果。请先进行 etcd 备份，然后再继续。通常情况下，建议您逐个维护节点，而不是重新启动整个集群。
{{</ notice >}}

## 准备工作

- 请先进行 [etcd 备份](https://etcd.io/docs/current/op-guide/recovery/#snapshotting-the-keyspace)，再关闭集群。
- 主机之间已设置 SSH [免密登录](https://man.openbsd.org/ssh.1#AUTHENTICATION)。

## 关闭集群

{{< notice tip >}}

- 关闭集群前，请您务必备份 etcd 数据，以便在重新启动集群时如果遇到任何问题，可以通过 etcd 还原集群。
- 使用本教程中的方法可以平稳关闭集群，但数据损坏的可能性仍然存在。

{{</ notice >}}

### 步骤 1：获取节点列表

```bash
nodes=$(kubectl get nodes -o name)
```

### 步骤 2：关闭所有节点

```bash
for node in ${nodes[@]}
do
    echo "==== Shut down $node ===="
    ssh $node sudo shutdown -h 1
done
```

然后，您可以关闭其他的集群依赖项，例如外部存储。

## 平稳重启集群

平稳关闭集群后，您可以平稳重启集群。

### 准备工作

您已平稳关闭集群。

{{< notice tip >}}
通常情况下，重新启动集群后可以继续正常使用，但是由于意外情况，该集群可能不可用。例如：

- 关闭集群过程中 etcd 数据损坏。
- 节点故障。
- 不可预期的网络错误。

{{</ notice >}}

### 步骤 1：检查所有集群依赖项的状态

确保所有集群依赖项均已就绪，例如外部存储。

### 步骤 2：打开集群主机电源

等待集群启动并运行，这可能需要大约 10 分钟。

### 步骤 3：检查所有主节点的状态

检查核心组件（例如 etcd 服务）的状态，并确保一切就绪。

```bash
kubectl get nodes -l node-role.kubernetes.io/master
```

### 步骤 4：检查所有工作节点的状态

```bash
kubectl get nodes -l node-role.kubernetes.io/worker
```

如果您的集群重启失败，请尝试[恢复 etcd 集群](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster)。
