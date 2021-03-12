---
title: "删除节点"
keywords: 'kubernetes, kubesphere, scale, delete-nodes'
description: '如何删除 KubeSphere 工作节点'


weight: 3420
---

## 停止调度节点

将节点标记为不可调度可防止调度程序将新的 Pod 放置到该节点上，同时不会影响该节点上的现有 Pod。作为节点重启或者其他维护之前的准备步骤，这十分有用。

以 `admin` 身份登录控制台，访问**集群管理**页面。若要将节点标记为不可调度，从左侧菜单中选择**节点管理**下的**集群节点**，找到想要从集群中删除的节点，点击**停止调度**按钮。或者，直接执行命令 `kubectl cordon $NODENAME`。有关更多详细信息，请参见 [Kubernetes 节点](https://kubernetes.io/docs/concepts/architecture/nodes/)。

![cordon](/images/docs/zh-cn/installing-on-linux/add-and-delete-nodes/delete-nodes/cordon.png)

{{< notice note >}}

守护进程集的 Pod 可以在无法调度的节点上运行。守护进程集通常提供应在节点上运行的本地节点服务，即使正在驱逐工作负载应用程序也不受影响。

{{</ notice >}}

## 删除节点

1. 若要删除节点，您需要首先准备集群的配置文件（即在[设置集群](../../introduction/multioverview/#1-create-an-example-configuration-file)时创建的集群）。如果您没有该配置文件，请使用 [KubeKey](https://github.com/kubesphere/kubekey) 检索群集信息（将默认创建文件 `sample.yaml`）。

   ```bash
   ./kk create config --from-cluster
   ```

2. 请确保在该配置文件中提供主机的所有信息，然后运行以下命令以删除节点。

   ```bash
   ./kk delete node <nodeName> -f config-sample.yaml
   ```