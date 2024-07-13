---
title: "删除节点"
keywords: 'Kubernetes, KubeSphere, 水平扩缩, 删除节点'
description: '停止调度节点，或者删除节点以缩小集群规模。'
linkTitle: "删除节点"
weight: 3620
version: "v3.3"
---

## 停止调度节点

将节点标记为不可调度可防止调度程序将新的 Pod 放置到该节点上，同时不会影响该节点上的现有 Pod。作为节点重启或者其他维护之前的准备步骤，这十分有用。

以 `admin` 身份登录控制台，访问**集群管理**页面。若要将节点标记为不可调度，从左侧菜单中选择**节点**下的**集群节点**，找到想要从集群中删除的节点，点击**停止调度**。或者，直接执行命令 `kubectl cordon $NODENAME`。有关更多详细信息，请参见 [Kubernetes 节点](https://kubernetes.io/docs/concepts/architecture/nodes/)。

{{< notice note >}}

守护进程集的 Pod 可以在无法调度的节点上运行。守护进程集通常提供应在节点上运行的本地节点服务，即使正在驱逐工作负载应用程序也不受影响。

{{</ notice >}}

## 删除节点

1. 若要删除节点，您需要首先准备集群的配置文件（即在[设置集群](../../introduction/multioverview/#1-create-an-example-configuration-file)时所用的配置文件）。如果您没有该配置文件，请使用 [KubeKey](https://github.com/kubesphere/kubekey) 检索集群信息（将默认创建文件 `sample.yaml`）。

   ```bash
   ./kk create config --from-cluster
   ```

2. 请确保在该配置文件中提供主机的所有信息，然后运行以下命令以删除节点。

   ```bash
   ./kk delete node <nodeName> -f config-sample.yaml
   ```