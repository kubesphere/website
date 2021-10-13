---
title: "存储卷"
keywords: 'Kubernetes, 持久卷, 持久卷申领, 存储卷克隆, 存储卷快照, 存储卷扩容'
description: '了解如何在 KubeSphere 中创建、编辑和挂载存储卷。'
linkTitle: "存储卷"
weight: 10310
---

 在项目中创建应用负载时，您可以为应用负载创建 [PersistentVolumeClaim (PVC)](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/)。PVC 可用于创建存储请求，从而进一步为应用提供持久化存储。更具体地说，PersistentVolume 资源可用于管理持久化存储。

集群管理员需要用存储类型 (Storage Class) 配置 PersistentVolume。也就是说，要在项目中创建 PersistentVolumeClaim，您的集群中必须要有可用的存储类型。如果在安装 KubeSphere 时没有配置自定义存储类型，集群中将默认安装 [OpenEBS](https://openebs.io/) 以提供本地持久卷。然而，OpenEBS 不支持动态存储卷供应。在生产环境中，建议您提前配置存储类型从而为应用提供持久化存储服务。

本教程介绍如何创建存储卷、挂载存储卷和通过存储卷详情页面使用存储卷功能。

## 准备工作

- 您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

- 如需使用动态存储卷供应，您需要配置一个支持动态供应的[存储类型](../../../cluster-administration/persistent-volume-and-storage-class/)。

## 创建存储卷

在**存储卷**页面创建的所有存储卷都是 PersistentVolumeClaim 对象。KubeSphere 将 PersistentVolumeClaim 绑定到满足您设定的请求条件（例如容量和访问模式）的 PersistentVolume。在创建应用负载时，您可以选择所需的存储卷并将其挂载到负载。

1. 以 `project-regular` 身份登录 KubeSphere Web 控制台并进入项目，在左侧导航栏中点击**存储管理**下的**存储卷**。页面上显示所有已挂载至项目工作负载的存储卷。

2. 在**存储卷**页面，点击**创建**以创建存储卷。

3. 在弹出的对话框设置存储卷的名称（例如 `demo-volume`），然后点击**下一步**。

   {{< notice note >}}

   您可以在对话框右上角启用**编辑模式**来查看存储卷的 YAML 清单文件，并通过直接编辑清单文件来创建存储卷。您也可继续执行后续步骤在控制台上创建存储卷。

   {{</ notice >}} 

4. 在**存储卷设置**页面，选择创建存储卷的方式。

   - **通过存储类型**：您可以在 KubeSphere [安装前](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)或[安装后](../../../cluster-administration/persistent-volume-and-storage-class/)配置存储类型。
   
   - **通过存储卷快照创建**：如需通过快照创建存储卷，您必须先创建存储卷快照。
   
   选择**通过存储类型**。有关通过存储卷快照创建存储卷的更多信息，请参阅[存储卷快照](../volume-snapshots/)。
5. 从下拉列表中选择存储类型。本教程以青云QingCloud 平台提供的 `csi-standard` 标准存储类型为例。您可以根据需要选择其他存储类型。

   ![select-storage-class](/images/docs/zh-cn/project-user-guide/volume-management/volumes/select-storage-class.jpg)

6. 由于一些 PersistentVolume 只支持特定的访问模式，页面上显示的访问模式会因您选择的存储类型而不同。访问模式一共有三种：

   - **ReadWriteOnce (RWO)**：存储卷以单节点读写的形式挂载。
   - **ReadOnlyMany (ROX)**：存储卷以多节点只读的形式挂载。
   - **ReadWriteMany (RWX)**：存储卷以多节点读写的形式挂载。

   选择所需的访问模式。

7. 在**存储卷容量**区域设置存储卷的大小，然后点击**下一步**。

8. 在**高级设置**页面，您可以为存储卷添加元数据，例如 **Label** 和 **Annotation**。元数据可用作搜索和调度资源的标识符。

9. 点击**创建**完成存储卷创建。

10. 新建的存储卷会显示在项目的**存储卷**页面。存储卷挂载至工作负载后，**挂载**列会显示为**已挂载**。

    ![volume-status](/images/docs/zh-cn/project-user-guide/volume-management/volumes/volume-status.jpg)

    {{< notice note >}}

新建的存储卷也会显示在**集群管理**中的**存储卷**页面。通常情况下项目用户（例如 `project-regular`）无法查看该页面。集群管理员需要查看和跟踪项目中创建的存储卷。另一方面，集群管理员在**集群管理**中为项目创建的存储卷也会显示在项目的**存储卷**页面。

{{</ notice >}} 

11. 一些存储卷是动态供应的存储卷，它们的状态会在创建后立刻从**等待中**变为**准备就绪**。其他仍处于**等待中**的存储卷会在挂载至工作负载后变为**准备就绪**。存储卷是否支持动态供应取决于其存储类型。

    ![local-pending](/images/docs/zh-cn/project-user-guide/volume-management/volumes/local-pending.jpg)

    例如，如果您使用默认的存储类型 (OpenEBS) 安装 KubeSphere，您只能创建不支持动态供应的本地存储卷。这类存储卷的绑定模式由 YAML 文件中的 `VolumeBindingMode: WaitForFirstConsumer` 字段指定。

    ![volumebindingmode](/images/docs/project-user-guide/volume-management/volumes/volumebindingmode.jpg)

## 挂载存储卷

创建[部署](../../../project-user-guide/application-workloads/deployments/)、[有状态副本集](../../../project-user-guide/application-workloads/statefulsets/)和[守护进程集](../../../project-user-guide/application-workloads/daemonsets/)等应用负载时，您可以为它们挂载存储卷。

{{< notice note >}}

关于如何创建应用负载，请参阅[应用负载](../../application-workloads/deployments/)中的相关指南。

{{</ notice >}}

在**挂载存储**页面，您可以为工作负载挂载不同的存储卷。

![volume-page](/images/docs/zh-cn/project-user-guide/volume-management/volumes/volume-page.jpg)

- **添加存储卷模板**（仅对[有状态副本集](../../../project-user-guide/application-workloads/statefulsets/)可用）：存储卷模板用于动态创建 PVC。您需要设置存储卷名称、存储类型、访问模式、存储卷容量和挂载路径（以上参数都由 `volumeClaimTemplates` 字段指定），以便将对应 StorageClass 的 PVC 挂载至 Pod。

- **添加存储卷**：支持 emptyDir 存储卷和 PVC。

  **添加存储卷**页面提供了三类存储卷：

  - **已有存储卷**：用 PVC 挂载。

    持久卷可用于保存用户的持久数据。您需要提前创建存储卷（PVC），存储卷创建后会显示在列表中供选择。

  - **临时存储卷**：用 emptyDir 存储卷挂载。

    临时存储卷即 [emptyDir](https://kubernetes.io/zh/docs/concepts/storage/volumes/#emptydir) 存储卷，它在 Pod 分配到节点时创建，并且只要 Pod 在节点上运行就会一直存在。emptyDir 存储卷提供了一个空目录，可由 Pod 中的容器读写。取决于您的部署环境，emptyDir 存储卷可以存放在节点所使用的任何介质上，例如机械硬盘或 SSD。当 Pod 由于某些原因从节点上移除时，emptyDir 存储卷中的数据也会被永久删除。

  - **HostPath**：用 hostPath 存储卷挂载。

    hostPath 存储卷将主机节点文件系统中的文件或目录挂载至 Pod。大多数 Pod 可能不需要这类存储卷，但它可以为一些应用提供了强大的逃生舱 (Escape Hatch)。有关更多信息，请参阅 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/storage/volumes/#hostpath)。

- **挂载配置文件或密钥**：支持 [ConfigMap](../../../project-user-guide/configuration/configmaps/) 或[密钥 (Secret)](../../../project-user-guide/configuration/secrets/) 键值对。

  [密钥](https://kubernetes.io/zh/docs/concepts/storage/volumes/#secret)存储卷用于为 Pod 提供密码、OAuth 凭证、SSH 密钥等敏感信息。密钥存储卷由 tmpfs（基于 RAM 的文件系统）支持，所以数据不会写入非易失性存储中。

  [ConfigMap](https://kubernetes.io/zh/docs/concepts/storage/volumes/#configmap) 存储卷以键值对的形式存放配置数据。ConfigMap 资源可用于向 Pod  中注入配置数据。存放在 ConfigMap 对象中的数据可以由 `configMap` 类型的存储卷引用，并由 Pod 中运行的容器化应用使用。ConfigMap 通常用于以下场景：

  - 设置环境变量。
  - 设置容器中的命令参数。
  - 创建存储卷中的配置文件。

## 查看存储卷详情

存储卷创建后，您可以查看存储卷的详情、编辑存储卷和使用存储卷功能。在**存储卷**页面，点击一个存储卷名称可打开存储卷详情页面。

### 编辑存储卷

在存储卷详情页面，您可以点击**编辑信息**修改存储卷的基本信息。点击**更多操作**可编辑 YAML 文件或删除存储卷。

如需删除存储卷，请确保存储卷未挂载至任何工作负载。如需卸载存储卷，请进入工作负载的详情页面，点击**更多操作**，从下拉菜单中选择**编辑配置模板**，在弹出的对话框中选择**存储卷**，然后点击垃圾桶图标将存储卷卸载。

![delete-volume](/images/docs/zh-cn/project-user-guide/volume-management/volumes/delete-volume.jpg)

在您点击**删除**后，如果存储卷的状态长时间保持为**删除中**，请使用以下命令手动删除：

```bash
kubectl patch pvc <pvc-name> -p '{"metadata":{"finalizers":null}}'
```

### 使用存储卷功能

**更多操作**下拉菜单提供了三个额外功能，这些功能基于 KubeSphere 的底层存储插件 `Storage Capability`。具体如下：

- **存储卷克隆**：创建一个相同的存储卷。
- **创建快照**：创建一个存储卷快照，可用于创建其他存储卷。有关更多信息，请参阅[存储卷快照](../volume-snapshots/)。
- **存储卷扩容**：增加存储卷的容量。请注意，您无法在控制台上减少存储卷的容量，因为数据可能会因此丢失。

![volume-detail-page](/images/docs/zh-cn/project-user-guide/volume-management/volumes/volume-detail-page.jpg)

有关 `Storage Capability` 的更多信息，请参阅[设计文档](https://github.com/kubesphere/community/blob/master/sig-storage/concepts-and-designs/storage-capability-interface.md)。

{{< notice note >}}

`Storage Capability` 可能尚未覆盖一些树内 (in-tree) 或特殊的 CSI 插件。如果某些功能在 KubeSphere 集群中没有正确显示，您可以按照[此文档](https://github.com/kubesphere/kubesphere/issues/2986)修改设置。

{{</ notice >}} 

### 监控存储卷

KubeSphere 从 Kubelet 获取 `Filesystem` 模式的 PVC 的指标数据（包括容量使用情况和 inode 使用情况），从而对存储卷进行监控。

![volume-monitoring](/images/docs/zh-cn/project-user-guide/volume-management/volumes/volume-monitoring.jpg)

有关存储卷监控的更多信息，请参阅 [Research on Volume Monitoring](https://github.com/kubesphere/kubesphere/issues/2921)。
