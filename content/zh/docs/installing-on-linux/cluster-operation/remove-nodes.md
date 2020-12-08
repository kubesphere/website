---
title: "删除节点"
keywords: 'kubernetes, kubesphere, scale, delete-nodes'
description: '如何删除 KubeSphere 工作节点'


weight: 3420
---

## 停止调度节点

将节点标记为不可调度可防止调度程序将新的容器放置到该节点上，但不会影响该节点上的现有容器，这对于重启或维护该节点之前的准备步骤很有用。

若要将节点标记为不可调度，可以从 KubeSphere 菜单中选择**节点管理→集群节点**，找到要从集群中删除的节点，然后单击**停止调度**按钮。或者用命令行执行`kubectl cordon $NODENAME`也能将此节点标记为不可调度，有关更多详细信息，请参见 [Kubernetes Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/)。

![Cordon a Node](https://ap3.qingstor.com/kubesphere-website/docs/20200828232951.png)

{{< notice note >}}

注意：DaemonSet 的 Pod 可以在无法调度的节点上运行。DaemonSet 通常提供节点上运行的本地服务，即使正在驱逐应用程序也不受影响。

{{</ notice >}}

## 删除节点

可以使用 [KubeKey](https://github.com/kubesphere/kubekey) 以下命令删除节点。`config-sample.yaml` 文件是您在[创建该集群](../../introduction/multioverview/)的时候定义的配置文件。

```bash
./kk delete node <nodeName> -f config-sample.yaml
```
