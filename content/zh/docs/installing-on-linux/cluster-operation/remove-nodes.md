---
title: "删除节点"
keywords: 'kubernetes, kubesphere, scale, add-nodes'
description: 'How to add new nodes in an existing cluster'


weight: 2345
---

## 停止调度节点

将节点标记为不可调度可防止调度程序将新的容器放置到该节点上，但不会影响该节点上的现有容器。 这对于节点重新引导或其他维护之前的准备步骤很有用。

若要将节点标记为不可调度，可以从菜单中选择 **节点管理→群集节点 **，然后找到要从群集中删除的节点，然后单击**停止调度**按钮。 它与命令`kubectl cordon $NODENAME`具有相同的效果，有关更多详细信息，请参见[Kubernetes Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/)。

![Cordon a Node](https://ap3.qingstor.com/kubesphere-website/docs/20200828232951.png)

{{< notice note >}}

注意：作为DaemonSet一部分的Pod可以在无法调度的节点上运行。 守护程序集通常提供应在节点上运行的节点本地服务，即使正在耗尽工作负载应用程序也是如此。

{{</ notice >}}

## 删除节点

您可以通过以下命令删除节点：

```
./kk delete node <nodeName> -f config-sample.yaml
```
