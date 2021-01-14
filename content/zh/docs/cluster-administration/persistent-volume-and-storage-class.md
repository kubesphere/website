---
title: "持久卷和存储类型"
keywords: "存储, 存储卷, PV, PVC, 存储类型, CSI, Ceph RBD, Glusterfs, 青云QingCloud, "
description: "持久卷和存储类型管理"
linkTitle: "持久卷和存储类型"
weight: 8400
---

本教程对 PV、PVC 以及存储类型 (Storage Class) 的基本概念进行了说明，并演示了集群管理员如何管理 KubeSphere 中的存储类型和持久化存储卷。

## 介绍

PersistentVolume (PV) 是集群中的一块存储，可以由管理员事先供应，或者使用存储类型来动态供应。PV 是像存储卷 (Volume) 一样的存储卷插件，但是它的生命周期独立于任何使用 PV 的 Pod。PV 可以[静态](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#static)供应或[动态](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#dynamic)供应。

PersistentVolumeClaim (PVC) 是用户对存储的请求。它与 Pod 类似，Pod 会消耗节点资源，而 PVC 消耗 PV 资源。

KubeSphere 支持基于存储类型的[动态卷供应](https://kubernetes.io/zh/docs/concepts/storage/dynamic-provisioning/)，以创建 PV。

[StorageClass](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/) 是管理员描述其提供的存储类型的一种方式。不同的类型可能会映射到不同的服务质量等级或备份策略，或由集群管理员制定的任意策略。每个 StorageClass 都有一个 Provisioner，用于决定使用哪个存储卷插件来供应 PV。该字段必须指定。有关使用哪一个值，请参阅 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#provisioner)或与您的存储管理员确认。

下表总结了各种 Provisioner（存储系统）常用的存储卷插件。

| 类型                 | 描述信息                                                     |
| -------------------- | ------------------------------------------------------------ |
| In-tree              | 内置并作为 Kubernetes 的一部分运行，例如 [RBD](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#ceph-rbd) 和 [Glusterfs](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#glusterfs)。有关此类插件的更多信息，请参见 [Provisioner](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#provisioner)。 |
| External-provisioner | 独立于 Kubernetes 部署，但运行上类似于树内 (in-tree) 插件，例如 [NFS 客户端](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client)。有关此类插件的更多信息，请参见 [External Storage](https://github.com/kubernetes-retired/external-storage)。 |
| CSI                  | 容器存储接口，一种将存储资源暴露给 CO（例如 Kubernetes）上的工作负载的标准，例如[QingCloud-CSI](https://github.com/yunify/qingcloud-csi) 和 [Ceph-CSI](https://github.com/ceph/ceph-csi)。有关此类插件的更多信息，请参见 [Drivers](https://kubernetes-csi.github.io/docs/drivers.html)。 |

## 准备工作

您需要一个拥有**集群管理**权限的帐户。例如，您可以直接以 `admin` 身份登录控制台，或者创建一个拥有该权限的新角色并将它分配至一个帐户。

## 管理存储类型

1. 点击左上角的**平台管理**，然后选择**集群管理**。
   
    ![选择集群管理](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/cluster-management-select.PNG)
    
2. 如果您启用了[多集群功能](../../multicluster-management/)并导入了 Member 集群，可以选择一个特定集群。如果您未启用该功能，请直接参考下一步。

3. 在**集群管理**页面，搜寻至**存储管理**下面的**存储类型**，您可以在这里创建、更新和删除存储类型。

    ![存储类型](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/storage-class.PNG)

4. 要创建一个存储类型，请点击**创建**，在弹出窗口中输入基本信息。完成后，点击**下一步**。

    ![存储类型基本信息](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/create-storage-class-basic-info.PNG)

5. 在 KubeSphere 中，您可以直接为 `QingCloud-CSI`、`Glusterfs` 和 `Ceph RBD` 创建存储类型。或者，您也可以根据需求为其他存储系统创建自定义存储类型。请选择一个类型，然后点击**下一步**。

    ![存储系统](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/create-storage-class-storage-system.PNG)

    ![存储类型设置](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/create-storage-class-settings.PNG)

### 常用设置

有些设置在存储类型之间常用且共享。您可以在控制台上的仪表板属性中找到这些设置，StorageClass 清单文件中也通过字段或注解加以显示。您可以在右上角启用**编辑模式**，查看 YAML 格式的清单文件。下表是对 KubeSphere 中一些常用字段的属性说明。

| 属性 | 描述信息 |
| :---- | :---- |
| 允许存储卷扩容 | 在清单文件中由 `allowVolumeExpansion` 指定。若设置为 `true`，PV 则被配置为可扩容。有关更多信息，请参见[允许卷扩展](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#允许卷扩展)。 |
| 回收机制 | 在清单文件中由 `reclaimPolicy` 指定。可设置为 `Delete` 或 `Retain`（默认）。有关更多信息，请参见[回收策略](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#回收策略)。 |
| 存储系统 | 在清单文件中由 `provisioner` 指定。它决定使用什么存储卷插件来供应 PV。有关更多信息，请参见 [Provisioner](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#provisioner)。 |
| 支持的访问模式 | 在清单文件中由 `metadata.annotations[storageclass.kubesphere.io/supported-access-modes]` 指定。它会向 KubeSphere 说明支持的[访问模式](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#access-modes)。 |

对于其他设置，您需要为不同的存储插件提供不同的信息，它们都显示在清单文件的 `parameters` 字段下。下面将进行详细说明，您也可以参考 Kubernetes 官方文档的[参数](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#参数)部分。

### QingCloud CSI

QingCloud CSI 是 Kubernetes 上的 CSI 插件，供青云QingCloud 存储卷使用。KubeSphere 控制台上可以创建 QingCloud CSI 的存储类型。

#### 准备工作

- QingCloud CSI 在青云QingCloud 的公有云和私有云上均可使用。因此，请确保将 KubeSphere 安装至二者之一，以便可以使用云存储卷。
- KubeSphere 集群上已经安装 QingCloud CSI 插件。有关更多信息，请参见[安装 QingCloud CSI](https://github.com/yunify/qingcloud-csi#installation)。

#### 设置

![青云存储卷](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/storage-volume-qingcloud.PNG)

| 属性 | 描述信息 |
| :---- | :---- |
| type     | 在青云QingCloud 平台上，0 代表高性能型存储卷。2 代表大容量型存储卷。3 代表超高性能型存储卷。5 代表企业级服务器 SAN。6 代表 NeonSan HDD。100 代表基础型存储卷。200 代表企业级 SSD。 |
| maxSize  | 存储卷容量上限。 |
| stepSize | 存储卷容量增量。 |
| minSize  | 存储卷容量下限。 |
| fsType   | 存储卷的文件系统类型：ext3、ext4（默认）、xfs。 |
| tags     | QingCloud Tag 资源的 ID，用逗号隔开。 |

有关存储类型参数的更多信息，请参见 [QingCloud CSI 用户指南](https://github.com/yunify/qingcloud-csi/blob/master/docs/user-guide.md#set-storage-class)。

### Glusterfs

Glusterfs 是 Kubernetes 上的一种树内存储插件，即您不需要额外安装存储卷插件。

#### 准备工作

已经安装 Glusterfs 存储系统。有关更多信息，请参见 [GlusterFS 安装文档](https://www.gluster.org/install/)。

#### 设置

| 属性 | 描述信息 |
| :---- | :---- |
| resturl  | Gluster REST 服务/Heketi 服务 URL，按需供应 Gluster 存储卷。 |
| clusterid | Heketi 在供应存储卷时使用的集群的 ID。 |
| restauthenabled | Gluster REST 服务认证 Boolean，对 REST 服务器进行认证。 |
| restuser | 在 Glusterfs 受信池中有权限创建存储卷的 Glusterfs REST 服务/Heketi 用户。 |
| secretNamespace, secretName | 识别 Secret 实例，包含与 Gluster REST 服务通信时使用的用户密码。 |
| gidMin, gidMax | StorageClass GID 范围的最大值和最小值。 |
| volumetype | 该可选值可以配置存储卷类型和其参数。 |

有关 StorageClass 参数的更多信息，请参见 [Kubernetes 文档中的 Glusterfs](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#glusterfs)。

### Ceph RBD

Ceph RBD 也是 Kubernetes 上的一种树内存储插件。Kubernetes 中已经安装存储卷插件，但您必须在创建 Ceph RBD 的存储类型之前安装存储服务器。

由于 **hyperkube** 镜像[自 1.17 版本开始已被弃用](https://github.com/kubernetes/kubernetes/pull/85094)，树内 Ceph RBD 可能无法在不使用 **hyperkube** 的 Kubernetes 上运行。不过，您可以使用 [RBD Provisioner](https://github.com/kubernetes-retired/external-storage/tree/master/ceph/rbd) 作为替代，它的格式与树内 Ceph RBD 相同。唯一不同的参数是 `provisioner`（即 KubeSphere 控制台上的**存储系统**）。如果您想使用 RBD Provisioner，`provisioner` 的值必须为 `ceph.com/rbd`（在**存储系统**中输入该值，如下图所示）。如果您使用树内 Ceph RBD，该值必须为 `kubernetes.io/rbd`。

![存储系统](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/storage-system.PNG)

#### 准备工作

- 已经安装 Ceph 服务器。有关更多信息，请参见 [Ceph 安装文档](https://docs.ceph.com/en/latest/install/)。
- 如果您选择使用 RBD Provisioner，请安装插件。社区开发者提供了 [RBD Provisioner 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/test/rbd-provisioner)，您可以通过 Helm 用这些 Chart 安装 RBD Provisioner。

#### 设置

| 属性 | 描述信息 |
| :---- | :---- |
| monitors| Ceph 监控器，用逗号隔开。 |
| adminId| 能够在该池中创建镜像的 Ceph 客户端 ID。 |
| adminSecretName| `adminId` 的 Secret 名称。 |
| adminSecretNamespace| `adminSecretName` 的命名空间。 |
| pool | Ceph RBD 池。 |
| userId | 用于映射 RBD 镜像的 Ceph 客户端 ID。 |
| userSecretName | `userId` 的 Ceph Secret 名称，用于映射 RBD 镜像。 |
| userSecretNamespace | `userSecretName` 的命名空间。 |
| fsType | Kubernetes 支持的文件系统类型。 |
| imageFormat | Ceph RBD 镜像格式，可设为 `1` 或 `2`。 |
| imageFeatures| 该参数为可选，仅在 `imageFormat` 设为 `2` 时使用。 |

有关 StorageClass 参数的更多信息，请参见 [Kubernetes 文档中的 Ceph RBD](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#ceph-rbd)。

### 自定义存储类型

如果 KubeSphere 不直接支持您的存储系统，您可以为存储系统创建自定义存储类型。下面的示例向您演示了如何在 KubeSphere 控制台上为 NFS 创建存储类型。

#### NFS 介绍

NFS（网络文件系统）广泛用于带有 [NFS-Client](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client)（External-Provisioner 存储卷插件）的 Kubernetes。您可以点击**自定义**来创建 NFS-Client 的存储类型，如下图所示。

![创建自定义存储类型](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/create-custom-storage-class.PNG)

#### 准备工作

- 有一个可用的 NFS 服务器。
- 已经安装存储卷插件 NFS-Client。社区开发者提供了 [NFS-Client 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner)，您可以通过 Helm 用这些 Chart 安装 NFS-Client。

#### 常用设置

![自定义存储类型](/images/docs/zh-cn/cluster-administration/persistent-volumes-and-storage-classes/custom-storage-class.PNG)

| 属性 | 描述信息 |
| :---- | :---- |
| 存储系统 | 在清单文件中由 `provisioner` 指定。如果您使用 [NFS-Client 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner) 来安装存储类型，可以设为 `cluster.local/nfs-client-nfs-client-provisioner`。 |
| 允许存储卷扩容 | 在清单文件中由 `allowVolumeExpansion` 指定。选择 `No`。 |
| 回收机制 | 在清单文件中由 `reclaimPolicy` 指定。默认值为 Delete。 |
| 支持的访问模式 | 在清单文件中由 `.metadata.annotations.storageclass.kubesphere.io/supported-access-modes` 指定。默认 `ReadWriteOnce`、`ReadOnlyMany` 和 `ReadWriteMany` 全选。 |

#### 参数

| 键 | 描述信息 | 值 |
| :---- | :---- |  :----|
| archiveOnDelete | 删除时存档 PVC | `true` |

## 管理存储卷

存储类型创建后，您可以使用它来创建存储卷。您可以在 KubeSphere 控制台上的**存储管理**下面的**存储卷**中列示、创建、更新和删除存储卷。有关更多详细信息，请参见[存储卷管理](../../project-user-guide/storage/volumes/)。
