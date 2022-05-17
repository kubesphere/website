---
title: "持久卷声明"
keywords: 'Kubernetes, 持久卷, 持久卷申领, 克隆, 快照, 扩容, PV, PVC'
description: '了解如何在 KubeSphere 中创建、编辑和挂载持久卷声明。'
linkTitle: "持久卷声明"
weight: 10310
---

 在项目中创建应用负载时，您可以为应用负载创建[持久卷声明（PVC）](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/)。PVC 可用于创建存储请求，从而进一步为应用提供持久化存储。更具体地说，持久卷（PV）资源可用于管理持久化存储。

集群管理员需要用存储类型 (Storage Class) 配置持久卷。也就是说，要在项目中创建 PVC，您的集群中必须要有可用的存储类型。如果在安装 KubeSphere 时没有配置自定义存储类型，集群中将默认安装 [OpenEBS](https://openebs.io/) 以提供本地持久化存储。然而，OpenEBS 不支持动态为 PVC 动态供应持久卷。在生产环境中，建议您提前配置存储类型从而为应用提供持久化存储服务。

本教程介绍如何创建 PVC、挂载 PVC 和使用 PVC。

## 准备工作

- 您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

- 如需使用动态卷供应，您需要配置一个支持动态供应的[存储类](../../../cluster-administration/persistent-volume-and-storage-class/)。



## 创建持久性声明

KubeSphere 将 PVC 绑定到满足您设定的请求条件（例如容量和访问模式）的 PV。在创建应用负载时，您可以选择所需的 PVC 并将其挂载到负载。

1. 以 `project-regular` 身份登录 KubeSphere Web 控制台并进入项目，在左侧导航栏中点击**存储**下的**持久卷声明**。页面上显示所有已挂载至项目工作负载的持久卷声明。

2. 在**持久卷声明**页面，点击**创建**以创建持久卷声明。

3. 在弹出的对话框设置持久卷声明的名称（例如 `demo-volume`），选择项目，然后点击**下一步**。


   {{< notice note >}}

   您可以在对话框右上角启用**编辑 YAML** 来查看持久卷声明的 YAML 清单文件，并通过直接编辑清单文件来创建持久卷声明。您也可继续执行后续步骤在控制台上创建持久卷声明。

   {{</ notice >}} 

4. 在**存储设置**页面，选择创建持久卷声明的方式。

   - **通过存储类创建**：您可以在 KubeSphere [安装前](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)或[安装后](../../../cluster-administration/persistent-volume-and-storage-class/)配置存储类。
   
   - **通过卷快照创建**：如需通过快照创建持久卷声明，您必须先创建卷快照。
   
   选择**通过存储类创建**。有关通过卷快照创建持久卷声明的更多信息，请参阅[卷快照](../volume-snapshots/)。

5. 从下拉列表中选择存储类。本教程以青云QingCloud 平台提供的 `csi-standard` 标准存储类为例。您可以根据需要选择其他存储类。

6. 选择所需的访问模式。由于一些 PV 只支持特定的访问模式，页面上显示的访问模式会因您选择的存储类而不同。访问模式一共有三种：

   - **ReadWriteOnce**：持久卷声明以单节点读写的形式挂载。
   - **ReadOnlyMany**：持久卷声明以多节点只读的形式挂载。
   - **ReadWriteMany**：持久卷声明以多节点读写的形式挂载。

7. 在**卷容量**区域，设置持久卷声明的大小，然后点击**下一步**。

8. 在**高级设置**页面，您可以为持久卷声明添加元数据，例如**标签**和**注解**。元数据可用作搜索和调度资源的标识符。

9. 点击**创建**。新建的持久卷声明会显示在项目的**持久卷声明**页面。持久卷声明挂载至工作负载后，**挂载状态**列会显示为**已挂载**。

    {{< notice note >}}

- 新建的持久卷声明也会显示在**集群管理**中的**持久卷声明**页面。集群管理员需要查看和跟踪项目中创建的持久卷声明。另一方面，集群管理员在**集群管理**中为项目创建的持久卷声明也会显示在项目的**持久卷声明**页面。

- 一些持久卷声明是动态供应的持久卷声明，它们的状态会在创建后立刻从**等待中**变为**已绑定**。其他仍处于**等待中**的持久卷声明会在挂载至工作负载后变为**已绑定**。持久卷声明是否支持动态供应取决于其存储类。例如，如果您使用默认的存储类型 (OpenEBS) 安装 KubeSphere，您只能创建不支持动态供应的本地持久卷声明。这类持久卷声明的绑定模式由 YAML 文件中的 `VolumeBindingMode: WaitForFirstConsumer` 字段指定。

- 一些持久卷声明是动态供应的持久卷声明，它们的状态会在创建后立刻从**等待中**变为**已绑定**。其他仍处于**等待中**的持久卷声明会在挂载至工作负载后变为**已绑定**。持久卷声明是否支持动态供应取决于其存储类。例如，如果您使用默认的存储类型 (OpenEBS) 安装 KubeSphere，您只能创建不支持动态供应的本地持久卷声明。这类持久卷声明的绑定模式由 YAML 文件中的 `VolumeBindingMode: WaitForFirstConsumer` 字段指定。

    {{</ notice >}}

## 挂载持久卷

创建[部署](../../../project-user-guide/application-workloads/deployments/)、[有状态副本集](../../../project-user-guide/application-workloads/statefulsets/)和[守护进程集](../../../project-user-guide/application-workloads/daemonsets/)等应用负载时，您可以为它们挂载持久卷声明。

{{< notice note >}}

关于如何创建应用负载，请参阅[应用负载](../../application-workloads/deployments/)中的相关指南。

{{</ notice >}}

在**存储**页面，您可以为工作负载挂载不同的持久卷声明。

- **添加持久卷声明模板**（仅对[有状态副本集](../../../project-user-guide/application-workloads/statefulsets/)可用）：持久卷声明模板用于动态创建 PVC。您需要设置 PVC 名称前缀、存储类、访问模式、卷容量和挂载路径（以上参数都由 `volumeClaimTemplates` 字段指定），以便将对应 StorageClass 的 PVC 挂载至容器组。

- **挂载卷**：支持 emptyDir 卷和 PVC。

  **挂载卷**页面支持以下三种模式：

  - **持久卷**：使用 PVC 挂载。

    持久卷可用于保存用户的持久数据。您需要提前创建持久卷声明（PVC），持久卷声明创建后会显示在列表中供选择。

  - **临时卷**：用 emptyDir 卷挂载。

    临时卷即 [emptyDir](https://kubernetes.io/zh/docs/concepts/storage/volumes/#emptydir) 卷，它在容器组分配到节点时创建，并且只要容器组在节点上运行就会一直存在。emptyDir 卷提供了一个空目录，可由容器组中的容器读写。取决于您的部署环境，emptyDir 卷可以存放在节点所使用的任何介质上，例如机械硬盘或 SSD。当容器组由于某些原因从节点上移除时，emptyDir 卷中的数据也会被永久删除。

  - **HostPath 卷**：用 `hostPath` 卷挂载。

    `hostPath` 卷将主机节点文件系统中的文件或目录挂载至容器组。大多数容器组可能不需要这类卷，但它可以为一些应用提供了强大的逃生舱 (Escape Hatch)。有关更多信息，请参阅 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/storage/volumes/#hostpath)。

- **挂载配置字典或保密字典**：支持[配置字典](../../../project-user-guide/configuration/configmaps/)或[保密字典](../../../project-user-guide/configuration/secrets/)键值对。

  [保密字典](https://kubernetes.io/zh/docs/concepts/storage/volumes/#secret)卷用于为容器组提供密码、OAuth 凭证、SSH 密钥等敏感信息。该卷由 tmpfs（基于 RAM 的文件系统）支持，所以数据不会写入非易失性存储中。

  [配置字典](https://kubernetes.io/zh/docs/concepts/storage/volumes/#configmap)卷以键值对的形式存放配置数据。ConfigMap 资源可用于向容器组中注入配置数据。存放在 ConfigMap 对象中的数据可以由 `configMap` 类型的卷引用，并由容器组中运行的容器化应用使用。ConfigMap 通常用于以下场景：

  - 设置环境变量。
  - 设置容器中的命令参数。
  - 创建卷中的配置文件。

## 查看和管理持久性声明

持久性声明创建后，您可以查看持久性声明的详情、编辑持久性声明和使用持久性声明功能。
### 查看持久性声明详情

在**持久性声明**页面，点击一个持久性声明名称可打开持久性声明详情页面。

1. 点击**资源状态**页签，查看持久卷用量和挂载的容器组。

2. 点击**元数据**页签，查看持久卷声明的标签和注解。

3. 点击**事件**页签，查看持久卷声明的事件。

4. 点击**快照**页签，查看卷快照。
### 编辑持久性声明


持久性声明创建后，您可以查看持久性声明的详情、编辑持久性声明和使用持久性声明功能。

### 查看持久性声明详情

在**持久性声明**页面，点击一个持久性声明名称可打开持久性声明详情页面。

1. 点击**资源状态**页签，查看持久卷用量和挂载的容器组。

2. 点击**元数据**页签，查看持久卷声明的标签和注解。

3. 点击**事件**页签，查看持久卷声明的事件。

4. 点击**快照**页签，查看卷快照。
### 编辑持久性声明

在持久性声明详情页面，您可以点击**编辑信息**修改持久性声明的基本信息。点击**更多操作**可编辑 YAML 文件或删除持久性声明。

如需删除持久性声明，请确保该持久性声明未挂载至任何工作负载。如需卸载工作负载的持久性声明，请进入该工作负载的详情页面，点击**更多操作**，从下拉菜单中选择**编辑设置**，在弹出的对话框中选择**存储**，然后点击垃圾桶图标卸载该持久性声明。

在您点击**删除**后，如果持久性声明长时间处于**删除中**状态，请使用以下命令手动删除：

```bash
kubectl patch pvc <pvc-name> -p '{"metadata":{"finalizers":null}}'
```

### 使用持久性声明功能

**更多操作**下拉菜单提供了其它额外功能，这些功能基于 KubeSphere 的底层存储插件 `Storage Capability`。具体如下：

- **克隆**：创建一个相同的持久性声明。
- **创建快照**：创建一个持久性声明快照，可用于创建其他持久性声明。有关更多信息，请参阅[卷快照](../volume-snapshots/)。
- **扩容**：增加持久性声明的容量。请注意，您无法在控制台上减少持久性声明的容量，因为数据可能会因此丢失。

有关 `Storage Capability` 的更多信息，请参阅[设计文档](https://github.com/kubesphere/community/blob/master/sig-storage/concepts-and-designs/storage-capability-interface.md)。

{{< notice note >}}

`Storage Capability` 可能尚未覆盖一些树内 (in-tree) 或特殊的 CSI 插件。如果某些功能在 KubeSphere 集群中没有正确显示，您可以按照[此文档](https://github.com/kubesphere/kubesphere/issues/2986)修改设置。

{{</ notice >}} 

### 监控持久性声明

KubeSphere 从 Kubelet 获取 `Filesystem` 模式的 PVC 的指标数据（包括容量使用情况和 inode 使用情况），从而对持久性声明进行监控。

有关持久性声明监控的更多信息，请参阅 [Research on Volume Monitoring](https://github.com/kubesphere/kubesphere/issues/2921)。

## 查看持久卷列表并管理持久卷

### 查看持久卷列表

1. 在**持久卷声明**页面，点击**持久卷**页签，可以查看以下信息：

   <table border="1">
     <tbody>
     	<tr>
       	<th width="20%">参数</th>
         <th>描述</th>
       </tr>
       <tr>
       	<td>Name</td>
         <td> 持久卷名称，在该持久卷的清单文件中由 <b>.metadata.name</b> 字段指定。</td>
       </tr>
       <tr>
       	<td>状态</td>
         <td>
         	持久卷的当前状态，在该持久卷的清单文件中由 <b>.status.phase</b> 字段指定，包括：
           <ul>
             <li><b>可用</b>：持久卷可用，尚未绑定至持久卷声明。</li>
             <li><b>已绑定</b>：持久卷已绑定至持久卷声明。</li>
             <li><b>删除中</b>：正在删除持久卷。</li>
             <li><b>失败</b>：持久卷不可用。</li>
           </ul>
         </td>
       </tr>
       <tr>
       	<td>容量</td>
         <td>持久卷的容量，在该持久卷的清单文件中由 <b>.spec.capacity.storage</b> 字段指定。</td>
       </tr>
       <tr>
       	<td>访问模式</td>
         <td>
         	持久卷的访问模式，在该持久卷的清单文件中由 <b>.spec.accessModes</b> 字段指定，包括：
           <ul>
             <li><b>RWO</b>：持久卷可挂载为单个节点读写。</li>
             <li><b>ROX</b>：持久卷可挂载为多个节点只读。</li>
             <li><b>RWX</b>：持久卷实例可挂载为多个节点读写。</li>
           </ul>
         </td>
       </tr>
       <tr>
       	<td>回收策略</td>
         <td>
         	持久卷实例的回收策略，在该持久卷实例的清单文件中由 <b>.spec.persistentVolumeReclaimPolicy</b> 字段指定，包括：
           <ul>
             <li><b>Retain</b>：删除持久卷声明后，保留该持久卷，需要手动回收。</li>
             <li><b>Delete</b>：删除该持久卷，同时从卷插件的基础设施中删除所关联的存储设备。</li>
             <li><b>Recycle</b>：清除持久卷的数据，使该持久卷可供新的持久卷声明使用。</li>
           </ul>
         </td>
       </tr>
       <tr>
       	<td>创建时间</td>
         <td>持久卷的创建时间。</td>
       </tr>
     </tbody>
   </table>

2. 点击持久卷实例右侧的  并在下拉菜单中选择一项操作：
   - **编辑信息**：编辑持久卷信息。
   - **编辑 YAML**：编辑持久卷的 YAML 文件。
   - **删除**：删除持久卷。处于已绑定状态的持久卷不可删除。

### 查看持久卷实例详情页面

1. 点击持久卷的名称，进入其详情页面。

2. 在详情页面，点击**编辑信息**以编辑持久卷的基本信息。

3. 点击**更多操作**，在下拉菜单中选择一项操作：

   - **查看 YAML**：查看持久卷的 YAML 文件。
   - **删除**：删除持久卷并返回列表页面。处于已绑定状态的持久卷不可删除。

4. 点击**资源状态**页签，查看持久卷所绑定的持久卷声明。

5. 点击**元数据**页签，查看持久卷的标签和注解。

6. 点击**事件**页签，查看持久卷的事件。
