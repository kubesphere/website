---
title: "存储类"
keywords: "存储, 持久卷声明, PV, PVC, 存储类, CSI, Ceph RBD, GlusterFS, 青云QingCloud, "
description: "了解 PV、PVC 和存储类的基本概念，并演示如何在 KubeSphere 中管理存储类和 PVC。"
linkTitle: "存储类"
weight: 8800
---

本教程演示集群管理员如何管理 KubeSphere 中的存储类。

## 介绍

PV 是集群中的一块存储，可以由管理员事先供应，或者使用存储类来动态供应。和卷 (Volume) 一样，PV 通过卷插件实现，但是它的生命周期独立于任何使用该 PV 的容器组。PV 可以[静态](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#static)供应或[动态](https://kubernetes.io/zh/docs/concepts/storage/persistent-volumes/#dynamic)供应。

PVC 是用户对存储的请求。它与容器组类似，容器组会消耗节点资源，而 PVC 消耗 PV 资源。

KubeSphere 支持基于存储类的[动态卷供应](https://kubernetes.io/zh/docs/concepts/storage/dynamic-provisioning/)，以创建 PV。

[存储类](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/)是管理员描述其提供的存储类型的一种方式。不同的类型可能会映射到不同的服务质量等级或备份策略，或由集群管理员制定的任意策略。每个存储类都有一个 Provisioner，用于决定使用哪个卷插件来供应 PV。该字段必须指定。有关使用哪一个值，请参阅 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#provisioner)或与您的存储管理员确认。

下表总结了各种 Provisioner（存储系统）常用的卷插件。

| 类型                 | 描述信息                                                     |
| -------------------- | ------------------------------------------------------------ |
| In-tree              | 内置并作为 Kubernetes 的一部分运行，例如 [RBD](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#ceph-rbd) 和 [GlusterFS](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#glusterfs)。有关此类插件的更多信息，请参见 [Provisioner](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#provisioner)。 |
| External-provisioner | 独立于 Kubernetes 部署，但运行上类似于树内 (in-tree) 插件，例如 [NFS 客户端](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client)。有关此类插件的更多信息，请参见 [External Storage](https://github.com/kubernetes-retired/external-storage)。 |
| CSI                  | 容器存储接口，一种将存储资源暴露给 CO（例如 Kubernetes）上的工作负载的标准，例如 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi) 和 [Ceph-CSI](https://github.com/ceph/ceph-csi)。有关此类插件的更多信息，请参见 [Drivers](https://kubernetes-csi.github.io/docs/drivers.html)。 |

## 准备工作

您需要一个拥有**集群管理**权限的帐户。例如，您可以直接以 `admin` 身份登录控制台，或者创建一个拥有该权限的新角色并将它分配至一个用户。

## 创建存储类

1. 点击左上角的**平台管理**，然后选择**集群管理**。
   
2. 如果您启用了[多集群功能](../../multicluster-management/)并导入了成员集群，可以选择一个特定集群。如果您未启用该功能，请直接参考下一步。

3. 在**集群管理**页面，点击**存储 > 存储类**。

4. 在右侧的**存储类**页面，点击**创建**。

5. 在弹出**创建存储类**对话框，输入存储类名称，点击**下一步**。您也可以设置别名和添加描述信息。

6. 在**存储系统**页签，选择一个存储系统，点击**下一步**。

   在 KubeSphere 中，您可以直接为 `QingCloud-CSI`、`GlusterFS` 和 `Ceph RBD` 创建存储类。您也可以为其他存储系统创建自定义存储类。

7. 在**存储类设置**页签，设置相关参数，点击**创建**以创建存储类。参数设置项随您选择的存储系统而异。

## 设置存储类

下表列举了几个通用存储类设置项。
<style>
table th:first-of-type {
    width: 20%;
}
table th:nth-of-type(2) {
    width: 80%;
}
</style>

| 参数 | 描述信息 |
| :---- | :---- |
| 卷扩展 | 在 YAML 文件中由 `allowVolumeExpansion` 指定。 |
| 回收机制 | 在 YAML 文件中由 `reclaimPolicy` 指定。 |
| 访问模式 | 在 YAML 文件中由 `.metadata.annotations.storageclass.kubesphere.io/supported-access-modes` 指定。默认 `ReadWriteOnce`、`ReadOnlyMany` 和 `ReadWriteMany` 全选。 |
| 供应者 | 在 YAML 文件中由 `provisioner` 指定。如果您使用 [NFS-Client 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner) 来安装存储类型，可以设为 `cluster.local/nfs-client-nfs-client-provisioner`。 |
| 卷绑定模式 | 在 YAML 文件中由 `volumeBindingMode` 指定。它决定使用何种绑定模式。**延迟绑定**即持久性声明创建后，当使用此持久性声明的容器组被创建时，此持久性声明才绑定到一个持久卷。**立即绑定**即持久卷声明创建后，立即绑定到一个持久卷。 |
### QingCloud CSI

QingCloud CSI 是 Kubernetes 上的 CSI 插件，供青云QingCloud 存储服务使用。KubeSphere 控制台上可以创建 QingCloud CSI 的存储类。

#### 准备工作

- QingCloud CSI 在青云QingCloud 的公有云和私有云上均可使用。因此，请确保将 KubeSphere 安装至二者之一，以便可以使用云存储服务。
- KubeSphere 集群上已经安装 QingCloud CSI 插件。有关更多信息，请参见[安装 QingCloud CSI](https://github.com/yunify/qingcloud-csi#installation)。

#### 参数设置项
<style>
table th:first-of-type {
    width: 20%;
}
table th:nth-of-type(2) {
    width: 80%;
}
</style>

| 参数 | 描述信息 |
| :---- | :---- |
| 类型     | 在青云云平台中，0 代表性能型硬盘；2 代表容量型硬盘；3 代表超高性能型硬盘；5 代表企业级分布式 SAN（NeonSAN）型硬盘；100 代表基础型硬盘；200 代表 SSD 企业型硬盘。 |
| 容量上限  | 卷容量上限。 |
| 步长 | 卷的增量值。 |
| 容量下限  | 卷容量下限。 |
| 文件系统类型   | 支持 ext3、ext4 和 XFS。默认类型为 ext4。 |
| 标签     | 为卷添加标签。使用半角逗号（,）分隔多个标签。 |

有关存储类参数的更多信息，请参见 [QingCloud CSI 用户指南](https://github.com/yunify/qingcloud-csi/blob/master/docs/user-guide.md#set-storage-class)。

### GlusterFS

GlusterFS 是 Kubernetes 上的一种树内存储插件，即您不需要额外安装卷插件。

#### 准备工作

已经安装 GlusterFS 存储系统。有关更多信息，请参见 [GlusterFS 安装文档](https://www.gluster.org/install/)。

#### 参数设置项
<style>
table th:first-of-type {
    width: 20%;
}
table th:nth-of-type(2) {
    width: 80%;
}
</style>

| 参数 | 描述 |
| :---- | :---- |
| REST URL  | 供应卷的 Heketi REST URL，例如，&lt;Heketi 服务集群 IP 地址&gt;:&lt;Heketi 服务端口号&gt;。 |
| 集群 ID | Gluster 集群 ID。 |
| 开启 REST 认证 | Gluster 启用对 REST 服务器的认证。 |
| REST 用户 | Gluster REST 服务或 Heketi 服务的用户名。 |
| 密钥所属项目 | Heketi 用户密钥的所属项目。 |
| 密钥名称 | Heketi 用户密钥的名称。 |
| GID 最小值 | 卷的 GID 最小值。 |
| GID 最大值 | 卷的 GID 最大值。 |
| 卷类型 | 卷的类型。该值可为 none，replicate:&lt;副本数&gt;，或 disperse:&lt;数据&gt;:&lt;冗余数&gt;。如果未设置该值，则默认卷类型为 replicate:3。 |

有关存储类参数的更多信息，请参见 [Kubernetes 文档中的 GlusterFS](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#glusterfs)。

### Ceph RBD

Ceph RBD 也是 Kubernetes 上的一种树内存储插件，即 Kubernetes 中已经安装该卷插件，但您必须在创建 Ceph RBD 的存储类之前安装其存储服务器。

由于 **hyperkube** 镜像[自 1.17 版本开始已被弃用](https://github.com/kubernetes/kubernetes/pull/85094)，树内 Ceph RBD 可能无法在不使用 **hyperkube** 的 Kubernetes 上运行。不过，您可以使用 [RBD Provisioner](https://github.com/kubernetes-retired/external-storage/tree/master/ceph/rbd) 作为替代，它的格式与树内 Ceph RBD 相同。唯一不同的参数是 `provisioner`（即 KubeSphere 控制台上的**存储系统**）。如果您想使用 RBD Provisioner，`provisioner` 的值必须为 `ceph.com/rbd`（在**存储系统**中输入该值，如下图所示）。如果您使用树内 Ceph RBD，该值必须为 `kubernetes.io/rbd`。

#### 准备工作

- 已经安装 Ceph 服务器。有关更多信息，请参见 [Ceph 安装文档](https://docs.ceph.com/en/latest/install/)。
- 如果您选择使用 RBD Provisioner，请安装插件。社区开发者提供了 [RBD Provisioner 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/test/rbd-provisioner)，您可以通过 Helm 用这些 Chart 安装 RBD Provisioner。

#### 参数设置项

| 参数 | 描述 |
| :---- | :---- |
| MONITORS| Ceph 集群 Monitors 的 IP 地址。 |
| ADMINID| Ceph 集群能够创建卷的用户 ID。 |
| ADMINSECRETNAME| `adminId` 的密钥名称。 |
| ADMINSECRETNAMESPACE| `adminSecret` 所在的项目。 |
| POOL | Ceph RBD 的 Pool 名称。 |
| USERID | Ceph 集群能够挂载卷的用户 ID。 |
| USERSECRETNAME | `userId` 的密钥名称。 |
| USERSECRETNAMESPACE | `userSecret` 所在的项目。 |
| 文件系统类型 | 卷的文件系统类型。 |
| IMAGEFORMAT | Ceph 卷的选项。该值可为 `1` 或 `2`，选择 `2` 后需要填写 `imageFeatures`。 |
| IMAGEFEATURES| Ceph 集群的额外功能。仅当设置 `imageFormat` 为 `2` 时，才需要填写该值。 |

有关存储类参数的更多信息，请参见 [Kubernetes 文档中的 Ceph RBD](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#ceph-rbd)。

### 自定义存储类

如果 KubeSphere 不直接支持您的存储系统，您可以为存储系统创建自定义存储类型。下面的示例向您演示了如何在 KubeSphere 控制台上为 NFS 创建存储类。

#### NFS 介绍

NFS（网络文件系统）广泛用于带有 [NFS-Client](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client)（External-Provisioner 卷插件）的 Kubernetes。您可以点击**自定义**来创建 NFS-Client 的存储类型。

{{< notice note >}}

不建议您在生产环境中使用 NFS 存储（尤其是在 Kubernetes 1.20 或以上版本），这可能会引起 `failed to obtain lock` 和 `input/output error` 等问题，从而导致容器组 `CrashLoopBackOff`。此外，部分应用不兼容 NFS，例如 [Prometheus](https://github.com/prometheus/prometheus/blob/03b354d4d9386e4b3bfbcd45da4bb58b182051a5/docs/storage.md#operational-aspects) 等。

{{</ notice >}}

#### 准备工作

- 有一个可用的 NFS 服务器。
- 已经安装卷插件 NFS-Client。社区开发者提供了 [NFS-Client 的 Chart](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner)，您可以通过 Helm 用这些 Chart 安装 NFS-Client。
#### 参数设置项

| 键 | 描述信息 | 值 |
| :---- | :---- |  :----|
| archiveOnDelete | 删除时存档 PVC | `true` |

## 管理存储类

创建存储类型后，点击此存储类型的名称前往其详情页。在详情页点击**编辑 YAML** 来编辑此存储类型的清单文件。您也可以点击**更多操作**并在下拉菜单中选择一项操作：

- **设为默认存储类**：将此存储类设为集群的默认存储类。一个 KubeSphere 集群中仅允许设置一个默认存储类。
- **设置授权规则**：只允许特定项目和企业空间使用该存储类。
- **设置卷操作**：管理持久卷声明，包括**卷克隆**、**卷快照创建**、**卷扩容**。开启任意功能前，请联系系统管理员确认存储系统是否支持这些功能。
- **设置自动扩展**：设置系统在卷剩余空间低于阈值时自动扩容卷。您也可以开启是否自动重启工作负载。
- **删除**：删除此存储类。

在**持久卷声明**页签上，查看与此存储类相关联的持久卷声明。