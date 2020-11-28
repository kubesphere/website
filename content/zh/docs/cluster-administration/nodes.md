---
title: "节点管理"
keywords: "Kubernetes, KubeSphere, taints, nodes, labels, requests, limits"
description: "Kubernetes 节点管理"

linkTitle: "节点管理"
weight: 9200
---

Kubernetes通过将容器放入容器组中并在节点上运行来运行工作负载。节点可以是虚拟机，也可以是物理机，这取决于集群环境。每个节点都包含运行容器组所需的服务，这些服务由控制平面管理。有关节点的更多信息，请参见[Kubernetes的官方文档](https://kubernetes.io/docs/concepts/architecture/nodes/)。

本教程演示了集群管理员对节点可以查看和执行的操作。

## 前提条件

您需要一个被授予**集群管理**角色的帐户。 例如，您可以直接以`admin`身份登录控制台或使用授权创建新角色并将其分配给帐户。

## 节点状态

只有集群管理员可以访问集群节点。有些节点指标对集群非常重要。因此，管理员有责任监控这些指标并确保节点的可用性。请按照以下步骤查看节点状态。

1. 单击左上角的**平台管理**，然后选择**集群管理**。
   ![clusters-management-select](/images/docs/cluster-administration/node-management-zh/clusters-management-select.png)

2. 如果您已经在导入成员集群时启用了[多集群特性](../../multicluster-management)，那么您可以选择一个特定集群以查看其应用程序资源。 如果尚未启用该特性，请直接参考下一步。
   ![select-a-cluster](/images/docs/cluster-administration/node-management-zh/select-a-cluster.png)

3. 选择**节点管理**下的**集群节点**，您可以在其中查看节点状态的详细信息。
   ![Node Status](/images/docs/cluster-administration/node-management-zh/node_status.png)

   - **名称**：节点名称和子网IP地址。
   - **状态**：节点的当前状态，标识节点是否可用。
   - **角色**：节点的角色，标识节点是工作节点还是主节点。
   - **CPU**：节点的实时CPU使用率。
   - **内存**：节点的实时内存使用率。
   - **容器组**：节点上容器组的实时使用率。
   - **已分配CPU**：该指标是根据节点上容器组总CPU请求计算得出的。即使工作负载使用较少的CPU资源，它也表示该节点上为工作负载预留的CPU量。这个指标对于Kubernetes调度器(kube-scheduler)非常重要，在大多数情况下，它在调度容器组时支持分配较少CPU资源的节点。有关更多细节，请参阅[管理容器的资源](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)。
   - **已分配内存**：该指标是根据节点上容器组的总内存请求计算得出的。即使工作负载使用较少的内存资源，它也表示为该节点上的工作负载预留的内存量。

    {{< notice note >}}
CPU和已分配CPU在大多数情况下是不同的，内存和已分配内存也是不同的，这是正常的。作为集群管理员，您需要专注于两个指标，而不仅仅是一个。最佳实践是为每个节点设置资源请求和限制以匹配其实际使用情况。过度分配资源可能导致集群资源利用率低，而分配不足可能导致集群压力大，使集群不健康。
    {{</ notice >}}

## 节点管理

从列表中单击一个节点，然后可以转到其详细信息页面。
   ![Node Detail](/images/docs/cluster-administration/node-management-zh/node_detail.png)

- **停止调度/启用调度**：在节点重新引导或其他维护期间，将节点标记为不可调度非常有用。如果标记为不可调度，则Kubernetes调度程序不会将新容器组调度到该节点。 此外，这不会影响节点上已经存在的现有工作负载。在KubeSphere中，通过单击节点详细信息页面上的**停止调度**将节点标记为不可调度。如果再次单击此按钮（**启用调度**），则该节点将会标记为可调度。
- **标签**：当您想将容器组分配给特定节点时，节点标签会非常有用。首先标记节点（例如，使用`node-role.kubernetes.io/gpu-node`标记GPU节点），然后在[创建工作负载](../../project-user-guide/application-workloads/deployments/#step-5-configure-advanced-settings)时在**高级设置**中添加此标签，以便可以明确容器组在有GPU标记的节点上运行。要添加节点标签，请单击**更多操作**，然后选择**编辑标签**。
   ![drop-down-list-node](/images/docs/cluster-administration/node-management-zh/drop-down-list-node.png)

   ![Label Node](/images/docs/cluster-administration/node-management-zh/label_node.png)

   ![Assign pods to nodes](/images/docs/cluster-administration/node-management-zh/assign_pods_to_node.png)

- **污点**：污染允许节点排斥一系列的容器组。 您可以在节点详细信息页面上添加或删除节点污点。 要添加或删除污点，请单击**更多操作**，然后从下拉菜单中选择**污点管理**。
  
   ![taint-management](/images/docs/cluster-administration/node-management-zh/taint-management.png)

   ![add-taints](/images/docs/cluster-administration/node-management-zh/add-taints.png)

    {{< notice note >}}
添加污点时请小心，因为它们可能会导致意外行为，从而导致服务不可用。有关更多信息，请参见[污点和容忍](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/).
    {{</ notice >}}

## 添加和删除节点

在当前版本，您不能直接通过KubeSphere控制台添加或删除节点，但是可以使用[KubeKey](https://github.com/kubesphere/kubekey)来完成。 有关更多信息，请参见[添加新节点](../../installing-on-linux/cluster-operation/add-new-nodes/)和[删除节点](../../installing-on-linux/cluster-operation/remove-nodes/)。