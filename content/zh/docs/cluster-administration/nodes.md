---
title: "节点管理"
keywords: "Kubernetes, KubeSphere, 污点, 节点, 标签, 请求, 限制"
description: "Kubernetes 节点管理"

linkTitle: "节点管理"
weight: 8100
---

Kubernetes 将容器放入容器组中并在节点上运行，从而运行工作负载。取决于具体的集群环境，节点可以是虚拟机，也可以是物理机。每个节点都包含运行容器组所需的服务，这些服务由控制平面管理。有关节点的更多信息，请参阅[ Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/architecture/nodes/)。

本教程介绍集群管理员可查看的集群节点信息和可执行的操作。

## 准备工作

您需要一个被授予**集群管理**权限的帐户。例如，您可以直接用 `admin` 帐户登录控制台，或创建一个具有**集群管理**权限的角色然后将此角色授予一个帐户。

## 节点状态

只有集群管理员可以访问集群节点。由于一些节点指标对集群非常重要，集群管理员应监控这些指标并确保节点可用。请按照以下步骤查看节点状态。

1. 单击左上角的**平台管理**，然后选择**集群管理**。
   ![clusters-management-select](/images/docs/cluster-administration/node-management-zh/clusters-management-select.png)

2. 如果您已启用了[多集群特性](../../multicluster-management
   )并已导入了成员集群，您可以选择一个集群以查看其应用程序资源。如果尚未启用该特性，请直接进行下一步。
![select-a-cluster](/images/docs/cluster-administration/node-management-zh/select-a-cluster.png)
   
3. 在左侧导航栏中选择**节点管理**下的**集群节点**。您可以显示的页面查看节点的状态详情。
   ![Node Status](/images/docs/cluster-administration/node-management-zh/node_status.png)

   - **名称**：节点的名称和子网 IP 地址。
   - **状态**：节点的当前状态，标识节点是否可用。
   - **角色**：节点的角色，标识节点是工作节点还是主节点。
   - **CPU**：节点的实时 CPU 使用率。
   - **内存**：节点的实时内存使用率。
   - **容器组**：节点的实时容器组使用率。
   - **已分配 CPU**：该指标是根据节点上容器组的总 CPU 请求数计算得出的。它表示节点上为工作负载预留的 CPU 资源。工作负载实际正在使用 CPU 资源可能低于该数值。该指标对于 Kubernetes 调度器 (kube-scheduler) 非常重要。在大多数情况下，调度器在调度容器组时会偏向配得 CPU 资源较少的节点。有关更多信息，请参阅[为容器管理资源](https://kubernetes.io/zh/docs/concepts/configuration/manage-resources-containers/)。
   - **已分配内存**：该指标是根据节点上容器组的总内存请求计算得出的。它表示节点上为工作负载预留的内存资源。工作负载实际正在使用内存资源可能低于该数值。

    {{< notice note >}}
   在大多数情况下，**CPU** 和**已分配 CPU** 的数值不同，**内存**和**已分配内存**的数值也不同，这是正常现象。集群管理员需要同时关注一对指标。最佳实践是根据节点的实际使用情况为每个节点设置资源请求和限制。过度分配资源可能导致集群资源利用率过低，而资源分配不足可能导致集群压力过大从而处于不健康状态。
    {{</ notice >}}

## 节点管理

单击列表中的一个节点打开节点详情页面。

![Node Detail](/images/docs/cluster-administration/node-management-zh/node_detail.png)

- **停止调度/启用调度**：您可以在节点重启或维护期间将节点标记为不可调度。Kubernetes 调度器不会将新容器组调度到标记为不可调度的节点。但这不会影响节点上现有工作负载。在 KubeSphere 中，您可以单击节点详情页面的**停止调度**将节点标记为不可调度。再次单击此按钮（**启用调度**）可将节点标记为可调度。
- **标签**：您可以利用节点标签将容器组分配给特定节点。首先标记节点（例如，用 `node-role.kubernetes.io/gpu-node` 标记 GPU 节点），然后在[创建工作负载](../../project-user-guide/application-workloads/deployments/#步骤-5配置高级设置)时在**高级设置**中添加此标签，从而使容器组在 GPU 节点上运行。要添加节点标签，请单击**更多操作**，然后选择**编辑标签**。
   ![drop-down-list-node](/images/docs/cluster-administration/node-management-zh/drop-down-list-node.png)

   ![Label Node](/images/docs/cluster-administration/node-management-zh/label_node.png)

   ![Assign pods to nodes](/images/docs/cluster-administration/node-management-zh/assign_pods_to_node.png)

- **污点**：污点允许节点排斥一些容器组。您可以在节点详情页面添加或删除节点污点。要添加或删除污点，请单击**更多操作**，然后从下拉菜单中选择**污点管理**。
  
   ![taint-management](/images/docs/cluster-administration/node-management-zh/taint-management.png)

   ![add-taints](/images/docs/cluster-administration/node-management-zh/add-taints.png)

    {{< notice note >}}
请谨慎添加污点，因为它们可能会导致意外行为从而导致服务不可用。有关更多信息，请参阅[污点和容忍度](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)。
    {{</ notice >}}

## 添加和删除节点

当前版本不支持通过 KubeSphere 控制台添加或删除节点。您可以使用 [KubeKey](https://github.com/kubesphere/kubekey) 来进行此类操作。有关更多信息，请参阅[添加新节点](../../installing-on-linux/cluster-operation/add-new-nodes/)和[删除节点](../../installing-on-linux/cluster-operation/remove-nodes/)。

