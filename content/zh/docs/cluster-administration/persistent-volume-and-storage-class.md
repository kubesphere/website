---
title: "持久卷和存储类型"
keywords: "存储, 存储卷, PV, PVC, 存储类型, CSI, Ceph RBD, GlusterFS, 青云QingCloud, "
description: "了解 PV、PVC 和存储类型的基本概念，并演示如何在 KubeSphere 中管理存储类型和 PVC。"
linkTitle: "持久卷和存储类型"
weight: 8400
---

本教程对 PV、PVC 以及存储类型 (Storage Class) 的基本概念进行说明，并演示集群管理员如何管理 KubeSphere 中的存储类型和持久化存储卷。

## 介绍

PersistentVolume (PV) 是集群中的一块存储，可以由管理员事先供应，或者使用存储类型来动态供应。PV 是像存储卷 (Volume) 一样的存储卷插件，但是它的生命周期独立于任何使用该 PV 的容器组。PV 可以[静态](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#static)供应或[动态](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#dynamic)供应。

PersistentVolumeClaim (PVC) 是用户对存储的请求。它与容器组类似，容器组会消耗节点资源，而 PVC 消耗 PV 资源。

KubeSphere 支持基于存储类型的[动态卷供应](https://kubernetes.io/zh/docs/concepts/storage/dynamic-provisioning/)，以创建 PV。

[存储类型](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/)是管理员描述其提供的存储类型的一种方式。不同的类型可能会映射到不同的服务质量等级或备份策略，或由集群管理员制定的任意策略。每个存储类型都有一个 Provisioner，用于决定使用哪个存储卷插件来供应 PV。该字段必须指定。有关使用哪一个值，请参阅 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#provisioner)或与您的存储管理员确认。

下表总结了各种 Provisioner（存储系统）常用的存储卷插件。

| 类型                 | 描述信息                                                     |
| -------------------- | ------------------------------------------------------------ |
| In-tree              | 内置并作为 Kubernetes 的一部分运行，例如 [RBD](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#ceph-rbd) 和 [GlusterFS](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#glusterfs)。有关此类插件的更多信息，请参见 [Provisioner](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#provisioner)。 |
| External-provisioner | 独立于 Kubernetes 部署，但运行上类似于树内 (in-tree) 插件，例如 [NFS 客户端](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client)。有关此类插件的更多信息，请参见 [External Storage](https://github.com/kubernetes-retired/external-storage)。 |
| CSI                  | 容器存储接口，一种将存储资源暴露给 CO（例如 Kubernetes）上的工作负载的标准，例如 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi) 和 [Ceph-CSI](https://github.com/ceph/ceph-csi)。有关此类插件的更多信息，请参见 [Drivers](https://kubernetes-csi.github.io/docs/drivers.html)。 |

## 准备工作

您需要一个拥有**集群管理**权限的帐户。例如，您可以直接以 `admin` 身份登录控制台，或者创建一个拥有该权限的新角色并将它分配至一个用户。

## 管理存储类型

1. 点击左上角的**平台管理**，然后选择**集群管理**。
   
2. 如果您启用了[多集群功能](../../multicluster-management/)并导入了成员集群，可以选择一个特定集群。如果您未启用该功能，请直接参考下一步。

3. 在**集群管理**页面，您可以在**存储**下的**存储类型**中创建、更新和删除存储类型。

4. 要创建一个存储类型，请点击**创建**，在弹出窗口中输入基本信息。完成后，点击**下一步**。

5. 在 KubeSphere 中，您可以直接为 `QingCloud-CSI`、`GlusterFS` 和 `Ceph RBD` 创建存储类型。或者，您也可以根据需求为其他存储系统创建自定义存储类型。请选择一个类型，然后点击**下一步**。

### 常用设置

有些设置在存储类型之间常用且共享。您可以在控制台上的仪表板参数中找到这些设置，存储类型清单文件中也通过字段或注解加以显示。您可以在右上角点击**编辑 YAML**，查看 YAML 格式的配置文件。下表是对 KubeSphere 中一些常用字段的参数说明。

| 参数 | 描述 |
| :---- | :---- |
| 存储卷扩容 | 在清单文件中由 `allowVolumeExpansion` 指定。若设置为 `true`，PV 则被配置为可扩容。有关更多信息，请参见[允许卷扩展](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#允许卷扩展)。 |
| 回收机制 | 在清单文件中由 `reclaimPolicy` 指定。可设置为 `Delete` 或 `Retain`（默认）。有关更多信息，请参见[回收策略](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#回收策略)。 |
| 存储系统 | 在清单文件中由 `provisioner` 指定。它决定使用什么存储卷插件来供应 PV。有关更多信息，请参见 [Provisioner](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#provisioner)。 |
| 访问模式 | 在清单文件中由 `metadata.annotations[storageclass.kubesphere.io/supported-access-modes]` 指定。它会向 KubeSphere 表明支持的[访问模式](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#access-modes)。 |
| 存储卷绑定模式 | 在清单文件中由 `volumeBindingMode` 指定。它决定使用何种绑定模式。**延迟绑定**即存储卷创建后，当使用此存储卷的容器组被创建时，此存储卷绑定到一个存储卷实例。**立即绑定**即存储卷创建后，立即绑定到一个存储卷实例。 |

对于其他设置，您需要为不同的存储插件提供不同的信息，它们都显示在清单文件的 `parameters` 字段下。下面将进行详细说明，您也可以参考 Kubernetes 官方文档的[参数](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#参数)部分。

### QingCloud CSI

QingCloud CSI 是 Kubernetes 上的 CSI 插件，供青云QingCloud 存储服务使用。KubeSphere 控制台上可以创建 QingCloud CSI 的存储类型。

#### 准备工作

- QingCloud CSI 在青云QingCloud 的公有云和私有云上均可使用。因此，请确保将 KubeSphere 安装至二者之一，以便可以使用云存储服务。
- KubeSphere 集群上已经安装 QingCloud CSI 插件。有关更多信息，请参见[安装 QingCloud CSI](https://github.com/yunify/qingcloud-csi#installation)。

#### 设置

| 参数 | 描述信息 |
| :---- | :---- |
| 类型     | 在青云云平台中，0 代表性能型硬盘；2 代表容量型硬盘；3 代表超高性能型硬盘；5 代表企业级分布式 SAN（NeonSAN）型硬盘；100 代表基础型硬盘；200 代表 SSD 企业型硬盘。 |
| 容量上限  | 存储卷容量上限。 |
| 增量值 | 存储卷容量增量。 |
| 容量下限  | 存储卷容量下限。 |
| 文件系统类型   | 支持 ext3、ext4 和 XFS。默认类型为 ext4。 |
| 标签     | 为存储卷添加标签。使用半角逗号（,）分隔多个标签。 |

有关存储类型参数的更多信息，请参见 [QingCloud CSI 用户指南](https://github.com/yunify/qingcloud-csi/blob/master/docs/user-guide.md#set-storage-class)。

### GlusterFS

GlusterFS 是 Kubernetes 上的一种树内存储插件，即您不需要额外安装存储卷插件。

#### 准备工作

已经安装 GlusterFS 存储系统。有关更多信息，请参见 [GlusterFS 安装文档](https://www.gluster.org/install/)。

#### 设置

| 参数 | 描述 |
| :---- | :---- |
| REST URL  | 供应存储卷的 Heketi REST URL，例如，&lt;Heketi 服务集群 IP 地址&gt;:&lt;Heketi 服务端口号&gt;。 |
| 集群 ID | Gluster 集群 ID。 |
| 启用 REST 认证 | Gluster 启用对 REST 服务器的认证。 |
| REST 用户 | Gluster REST 服务或 Heketi 服务的用户名。 |
| 密钥所属项目 | Heketi 用户密钥的所属项目。 |
| 密钥名称 | Heketi 用户密钥的名称。 |
| GID 最小值 | 存储卷的 GID 最小值。 |
| GID 最大值 | 存储卷的 GID 最大值。 |
| 存储卷类型 | 存储卷的类型。该值可为 none，replicate:&lt;副本数&gt;，或 disperse:&lt;数据&gt;:&lt;冗余数&gt;。如果未设置该值，则默认存储卷类型为 replicate:3。 |

有关存储类型参数的更多信息，请参见 [Kubernetes 文档中的 GlusterFS](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#glusterfs)。

### Ceph RBD

Ceph RBD 也是 Kubernetes 上的一种树内存储插件，即 Kubernetes 中已经安装该存储卷插件，但您必须在创建 Ceph RBD 的存储类型之前安装其存储服务器。

由于 **hyperkube** 镜像[自 1.17 版本开始已被弃用](https://github.com/kubernetes/kubernetes/pull/85094)，树内 Ceph RBD 可能无法在不使用 **hyperkube** 的 Kubernetes 上运行。不过，您可以使用 [RBD Provisioner](https://github.com/kubernetes-retired/external-storage/tree/master/ceph/rbd) 作为替代，它的格式与树内 Ceph RBD 相同。唯一不同的参数是 `provisioner`（即 KubeSphere 控制台上的**存储系统**）。如果您想使用 RBD Provisioner，`provisioner` 的值必须为 `ceph.com/rbd`（在**存储系统**中输入该值，如下图所示）。如果您使用树内 Ceph RBD，该值必须为 `kubernetes.io/rbd`。

#### 准备工作

- 已经安装 Ceph 服务器。有关更多信息，请参见 [Ceph 安装文档](https://docs.ceph.com/en/latest/install/)。
- 如果您选择使用 RBD Provisioner，请安装插件。社区开发者提供了 [RBD Provisioner 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/test/rbd-provisioner)，您可以通过 Helm 用这些 Chart 安装 RBD Provisioner。

#### 设置

| 参数 | 描述 |
| :---- | :---- |
| monitors| Ceph 集群 Monitors 的 IP 地址。 |
| adminId| Ceph 集群能够创建卷的用户 ID。 |
| adminSecretName| `adminId` 的密钥名称。 |
| adminSecretNamespace| `adminSecret` 所在的项目。 |
| pool | Ceph RBD 的 Pool 名称。 |
| userId | Ceph 集群能够挂载卷的用户 ID。 |
| userSecretName | `userId` 的密钥名称。 |
| userSecretNamespace | `userSecret` 所在的项目。 |
| 文件系统类型 | 存储卷的文件系统类型。 |
| imageFormat | Ceph 卷的选项。该值可为 `1` 或 `2`，选择 `2` 后需要填写 `imageFeatures`。 |
| imageFeatures| Ceph 集群的额外功能。仅当设置 `imageFormat` 为 `2` 时，才需要填写该值。 |

有关存储类型参数的更多信息，请参见 [Kubernetes 文档中的 Ceph RBD](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#ceph-rbd)。

### 自定义存储类型

如果 KubeSphere 不直接支持您的存储系统，您可以为存储系统创建自定义存储类型。下面的示例向您演示了如何在 KubeSphere 控制台上为 NFS 创建存储类型。

#### NFS 介绍

NFS（网络文件系统）广泛用于带有 [NFS-Client](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client)（External-Provisioner 存储卷插件）的 Kubernetes。您可以点击**自定义**来创建 NFS-Client 的存储类型。

{{< notice note >}}

不建议您在生产环境中使用 NFS 存储（尤其是在 Kubernetes 1.20 或以上版本），这可能会引起 `failed to obtain lock` 和 `input/output error` 等问题，从而导致容器组 `CrashLoopBackOff`。此外，部分应用不兼容 NFS，例如 [Prometheus](https://github.com/prometheus/prometheus/blob/03b354d4d9386e4b3bfbcd45da4bb58b182051a5/docs/storage.md#operational-aspects) 等。

{{</ notice >}}

#### 准备工作

- 有一个可用的 NFS 服务器。
- 已经安装存储卷插件 NFS-Client。社区开发者提供了 [NFS-Client 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner)，您可以通过 Helm 用这些 Chart 安装 NFS-Client。

#### 常用设置

| 参数 | 描述信息 |
| :---- | :---- |
| 存储卷扩容 | 在清单文件中由 `allowVolumeExpansion` 指定。选择`否`。 |
| 回收机制 | 在清单文件中由 `reclaimPolicy` 指定。 |
| 存储系统 | 在清单文件中由 `provisioner` 指定。如果您使用 [NFS-Client 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner) 来安装存储类型，可以设为 `cluster.local/nfs-client-nfs-client-provisioner`。 |
| 访问模式 | 在清单文件中由 `.metadata.annotations.storageclass.kubesphere.io/supported-access-modes` 指定。默认 `ReadWriteOnce`、`ReadOnlyMany` 和 `ReadWriteMany` 全选。 |
| 存储卷绑定模式 | 在清单文件中由 `volumeBindingMode` 指定。它决定使用何种绑定模式。**延迟绑定**即存储卷创建后，当使用此存储卷的容器组被创建时，此存储卷绑定到一个存储卷实例。**立即绑定**即存储卷创建后，立即绑定到一个存储卷实例。 |

#### 参数

| 键 | 描述信息 | 值 |
| :---- | :---- |  :----|
| archiveOnDelete | 删除时存档 PVC | `true` |

### 存储类型详情页

创建存储类型后，点击此存储类型的名称前往其详情页。在详情页点击**编辑 YAML** 来编辑此存储类型的清单文件，或点击**更多操作**并在下拉菜单中选择一项操作：

- **设为默认存储类型**：将此存储类型设为集群的默认存储类型。一个 KubeSphere 集群中仅允许设置一个默认存储类型。
- **存储卷管理**：管理存储卷功能，包括：**存储卷克隆**、**存储卷快照**、**存储卷扩容**。开启任意功能前，请联系系统管理员确认存储系统是否支持这些功能。
- **删除**：删除此存储类型并返回上一页。

在**存储卷**页签上，查看与此存储类型相关联的存储卷。

## 管理存储卷

存储类型创建后，您可以使用它来创建存储卷。您可以在 KubeSphere 控制台上的**存储管理**下面的**存储卷**中列示、创建、更新和删除存储卷。有关更多详细信息，请参见[存储卷管理](../../project-user-guide/storage/volumes/)。

## 管理存储卷实例

KubeSphere 中的存储卷即 Kubernetes 中的[持久卷声明](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)，存储卷实例即 Kubernetes 中的[持久卷](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/)。

### 存储卷实例列表页面

1. 以 `admin` 身份登录 KubeSphere Web 控制台。点击左上角的**平台管理**，选择**集群管理**，然后在左侧导航栏点击**存储**下的**存储卷**。
2. 在**存储卷**页面，点击**存储卷实例**页签，查看存储卷实例列表页面。该页面提供以下信息：
   - **名称**：存储卷实例的名称，在该存储卷实例的清单文件中由 `.metadata.name` 字段指定。
   - **状态**：存储卷实例的当前状态，在该存储卷实例的清单文件中由 `.status.phase` 字段指定，包括：
     - **可用**：存储卷实例可用，尚未绑定至存储卷。
     - **已绑定**：存储卷实例已绑定至存储卷。
     - **删除中**：正在删除存储卷实例。
     - **失败**：存储卷实例不可用。
   - **容量**：存储卷实例的容量，在该存储卷实例的清单文件中由 `.spec.capacity.storage` 字段指定。
   - **访问模式**：存储卷实例的访问模式，在该存储卷实例的清单文件中由 `.spec.accessModes` 字段指定，包括：
     - **RWO**：存储卷实例可挂载为单个节点读写。
     - **ROX**：存储卷实例可挂载为多个节点只读。
     - **RWX**：存储卷实例可挂载为多个节点读写。
   - **回收策略**：存储卷实例的回收策略，在该存储卷实例的清单文件中由 `.spec.persistentVolumeReclaimPolicy` 字段指定，包括：
     - **Retain**：删除存储卷后，保留该存储卷实例，需要手动回收。
     - **Delete**：删除该存储卷实例，同时从存储卷插件的基础设施中删除所关联的存储设备。
     - **Recycle**：清除存储卷实例上的数据，使该存储卷实例可供新的存储卷使用。
   - **创建时间**：存储卷实例的创建时间。
3. 点击存储卷实例右侧的 <img src="/images/docs/common-icons/three-dots.png" width="15" /> 并在下拉菜单中选择一项操作：
   - **编辑**：编辑存储卷实例的 YAML 文件。
   - **查看 YAML**：查看存储卷实例的 YAML 文件。
   - **删除**：删除存储卷实例。处于**已绑定**状态的存储卷实例不可删除。

### 存储卷实例详情页面

1. 点击存储卷实例的名称，进入其详情页面。
2. 在详情页面，点击**编辑信息**以编辑存储卷实例的基本信息。点击**更多操作**，在下拉菜单中选择一项操作：
   - **查看 YAML**：查看存储卷实例的 YAML 文件。
   - **删除**：删除存储卷实例并返回列表页面。处于**已绑定**状态的存储卷实例不可删除。
3. 点击**资源状态**页签，查看存储卷实例所绑定的存储卷。
4. 点击**元数据**页签，查看存储卷实例的标签和注解。
5. 点击**事件**页签，查看存储卷实例的事件。
