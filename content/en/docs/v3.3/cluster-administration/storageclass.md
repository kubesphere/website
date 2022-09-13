---
title: "Storage Classes"
keywords: "Storage, Volume, PV, PVC, storage class, csi, Ceph RBD, GlusterFS, QingCloud"
description: "Learn basic concepts of PVs, PVCs,and storage classes, and demonstrate how to manage storage classes on KubeSphere."
linkTitle: "Storage Classes"
weight: 8800
---

This tutorial demonstrates how a cluster administrator can manage storage classes and persistent volumes in KubeSphere.

## Introduction

A Persistent Volume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using storage classes. PVs are volume plugins like volumes, but have a lifecycle independent of any individual Pod that uses the PV. PVs can be provisioned either [statically](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#static) or [dynamically](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#dynamic).

A Persistent Volume Claim (PVC) is a request for storage by a user. It is similar to a Pod. Pods consume node resources and PVCs consume PV resources.

KubeSphere supports [dynamic volume provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) based on storage classes to create PVs.

A [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes) provides a way for administrators to describe the classes of storage they offer. Different classes might map to quality-of-service levels, or to backup policies, or to arbitrary policies determined by the cluster administrators. Each storage class has a provisioner that determines what volume plugin is used for provisioning PVs. This field must be specified. For which value to use, please read [the official Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner) or check with your storage administrator.

The table below summarizes common volume plugins for various provisioners (storage systems).

| Type                 | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| In-tree              | Built-in and run as part of Kubernetes, such as [RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) and [GlusterFS](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs). For more plugins of this kind, see [Provisioner](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner). |
| External-provisioner | Deployed independently from Kubernetes, but works like an in-tree plugin, such as [nfs-client](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client). For more plugins of this kind, see [External Storage](https://github.com/kubernetes-retired/external-storage). |
| CSI                  | Container Storage Interface, a standard for exposing storage resources to workloads on COs (for example, Kubernetes), such as [QingCloud-csi](https://github.com/yunify/qingcloud-csi) and [Ceph-CSI](https://github.com/ceph/ceph-csi). For more plugins of this kind, see [Drivers](https://kubernetes-csi.github.io/docs/drivers.html). |

## Prerequisites

You need a user granted a role including the permission of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the permission and assign it to a user.

## Create Storage Classes

1. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. If you have enabled the [multi-cluster feature](../../multicluster-management/) with member clusters imported, you can select a specific cluster. If you have not enabled the feature, refer to the next step directly.

3. On the **Cluster Management** page, go to **Storage Classes** under **Storage**, where you can create, update, and delete a storage class.

4. To create a storage class, click **Create** and enter the basic information in the displayed dialog box. When you finish, click **Next**.

5. In KubeSphere, you can create storage classes for `QingCloud-CSI`, `GlusterFS`, and `Ceph RBD`. Alternatively, you can also create customized storage classes for other storage systems based on your needs. Select a type and click **Next**.

### Common Settings

Some settings are commonly used and shared among storage classes. You can find them as dashboard parameters on the console, which are also indicated by fields or annotations in the StorageClass manifest. You can see the manifest file in YAML format by clicking **Edit YAML** in the upper-right corner.

Here are parameter descriptions of some commonly used fields in KubeSphere.

| Parameter | Description |
| :---- | :---- |
| Volume Expansion | Specified by `allowVolumeExpansion` in the manifest. When it is set to `true`, PVs can be configured to be expandable. For more information, see [Allow Volume Expansion](https://kubernetes.io/docs/concepts/storage/storage-classes/#allow-volume-expansion). |
| Reclaim Policy | Specified by `reclaimPolicy` in the manifest. For more information, see [Reclaim Policy](https://kubernetes.io/docs/concepts/storage/storage-classes/#reclaim-policy). |
| Storage System | Specified by `provisioner` in the manifest. It determines what volume plugin is used for provisioning PVs. For more information, see [Provisioner](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner). |
| Access Mode | Specified by `metadata.annotations[storageclass.kubesphere.io/supported-access-modes]` in the manifest. It tells KubeSphere which [access mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) is supported. |
| Volume Binding Mode | Specified by `volumeBindingMode` in the manifest. It determines what binding mode is used. **Delayed binding** means that a volume, after it is created, is bound to a volume instance when a Pod using this volume is created. **Immediate binding** means that a volume, after it is created, is immediately bound to a volume instance. |

For other settings, you need to provide different information for different storage plugins, which, in the manifest, are always indicated under the field `parameters`. They will be described in detail in the sections below. You can also refer to [Parameters](https://kubernetes.io/docs/concepts/storage/storage-classes/#parameters) in the official documentation of Kubernetes.

### QingCloud CSI

QingCloud CSI is a CSI plugin on Kubernetes for the storage service of QingCloud. Storage classes of QingCloud CSI can be created on the KubeSphere console.

#### Prerequisites

- QingCloud CSI can be used on both public cloud and private cloud of QingCloud. Therefore, make sure KubeSphere has been installed on either of them so that you can use cloud storage services.
- QingCloud CSI Plugin has been installed on your KubeSphere cluster. See [QingCloud-CSI Installation](https://github.com/yunify/qingcloud-csi#installation) for more information.

#### Settings

| Parameter | Description |
| :---- | :---- |
| Type     | On QingCloud Public Cloud Platform, 0 means high performance volume; 2 high capacity volume; 3 ultra-high performance volume; 5 enterprise server SAN (NeonSAN); 100 standard volume; 200 enterprise SSD. |
| Maximum Size  | Maximum size of the volume. |
| Step Size | Step size of the volume. |
| Minimum Size  | Minimum size of the volume. |
| File System Type   | Supports ext3, ext4, and XFS. The default type is ext4. |
| Tag     | Add tags to the storage volume. Use commas to separate multiple tags. |

For more information about storage class parameters, see [QingCloud-CSI user guide](https://github.com/yunify/qingcloud-csi/blob/master/docs/user-guide.md#set-storage-class).

### GlusterFS

GlusterFS is an in-tree storage plugin on Kubernetes, which means you don't need to install a volume plugin additionally.

#### Prerequisites

The GlusterFS storage system has already been installed. See [GlusterFS Installation Documentation](https://www.gluster.org/install/) for more information.

#### Settings

| Parameter | Description |
| :---- | :---- |
| REST URL  | Heketi REST URL that provisions volumes, for example, &lt;Heketi Service cluster IP Address&gt;:&lt;Heketi Service port number&gt;. |
| Cluster ID | Gluster cluster ID. |
| REST Authentication | Gluster enables authentication to the REST server. |
| REST User | Username of Gluster REST service or Heketi service. |
| Secret Namespace/Secret Name | Namespace of the Heketi user secret. |
| Secret Name | Name of the Heketi user secret. |
| Minimum GID | Minimum GID of the volume. |
| Maximum GID | Maximum GID of the volume. |
| Volume Type | Type of volume. The value can be none, replicate:&lt;Replicate count&gt;, or disperse:&lt;Data&gt;:&lt;Redundancy count&gt;. If the volume type is not set, the default volume type is replicate:3. |

For more information about storage class parameters, see [GlusterFS in Kubernetes Documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs).

### Ceph RBD

Ceph RBD is also an in-tree storage plugin on Kubernetes. The volume plugin is already in Kubernetes, 
but the storage server must be installed before you create the storage class of Ceph RBD.

As **hyperkube** images were [deprecated since 1.17](https://github.com/kubernetes/kubernetes/pull/85094), in-tree Ceph RBD may not work without **hyperkube**.
Nevertheless, you can use [rbd provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/ceph/rbd) as a substitute, whose format is the same as in-tree Ceph RBD. The only different parameter is `provisioner` (i.e **Storage System** on the KubeSphere console). If you want to use rbd-provisioner, the value of `provisioner` must be `ceph.com/rbd` (Enter this value in **Storage System** in the image below). If you use in-tree Ceph RBD, the value must be `kubernetes.io/rbd`. 

#### Prerequisites

- The Ceph server has already been installed. See [Ceph Installation Documentation](https://docs.ceph.com/en/latest/install/) for more information.
- Install the plugin if you choose to use rbd-provisioner. Community developers provide [charts for rbd provisioner](https://github.com/kubesphere/helm-charts/tree/master/src/test/rbd-provisioner) that you can use to install rbd-provisioner by helm.

#### Settings

| Parameter | Description |
| :---- | :---- |
| Monitors| IP address of Ceph monitors. |
| adminId| Ceph client ID that is capable of creating images in the pool. |
| adminSecretName| Secret name of `adminId`. |
| adminSecretNamespace| Namespace of `adminSecretName`. |
| pool | Name of the  Ceph RBD pool. |
| userId | The Ceph client ID that is used to map the RBD image. |
| userSecretName | The name of Ceph Secret for `userId` to map RBD image. |
| userSecretNamespace | The namespace for `userSecretName`. |
| File System Type | File system type of the storage volume. |
| imageFormat | Option of the Ceph volume. The value can be `1` or `2`. `imageFeatures` needs to be filled when you set imageFormat to `2`. |
| imageFeatures| Additional function of the Ceph cluster. The value should only be set when you set imageFormat to `2`. |

For more information about StorageClass parameters, see [Ceph RBD in Kubernetes Documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd).

### Custom Storage Classes

You can create custom storage classes for your storage systems if they are not directly supported by KubeSphere. The following example shows you how to create a storage class for NFS on the KubeSphere console.

#### NFS Introduction

NFS (Net File System) is widely used on Kubernetes with the external-provisioner volume plugin
[nfs-client](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client). You can create the storage class of nfs-client by clicking **Custom**.

{{< notice note >}}

NFS is incompatible with some applications, for example, Prometheus, which may result in pod creation failures. If you need to use NFS in the production environment, ensure that you have understood the risks. For more information, contact support@kubesphere.cloud.

{{</ notice >}} 

#### Prerequisites

- An available NFS server.
- The volume plugin nfs-client has already been installed. Community developers provide [charts for nfs-client](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner) that you can use to install nfs-client by helm.

#### Common Settings

| Parameter | Description |
| :---- | :---- |
| Volume Expansion | Specified by `allowVolumeExpansion` in the manifest. Select `No`. |
| Reclaim Policy | Specified by `reclaimPolicy` in the manifest. The value is `Delete` by default. |
| Storage System | Specified by `provisioner` in the manifest. If you install the storage class by [charts for nfs-client](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner), it can be `cluster.local/nfs-client-nfs-client-provisioner`. |
| Access Mode | Specified by `.metadata.annotations.storageclass.kubesphere.io/supported-access-modes` in the manifest. `ReadWriteOnce`, `ReadOnlyMany` and `ReadWriteMany` are all selected by default. |
| Volume Binding Mode | Specified by `volumeBindingMode` in the manifest. It determines what binding mode is used. **Delayed binding** means that a volume, after it is created, is bound to a volume instance when a Pod using this volume is created. **Immediate binding** means that a volume, after it is created, is immediately bound to a volume instance. |

#### Parameters

| Key| Description | Value |
| :---- | :---- |  :----|
| archiveOnDelete | Archive PVCs during deletion | `true` |

## Manage Storage Classes

After you create a storage class, click the name of the storage class to go to its details page. On the details page, click **Edit YAML** to edit the manifest file of the storage class, or click **More** to select an operation from the drop-down menu:

- **Set as Default Storage Class**: Set the storage class as the default storage class in the cluster. Only one default storage class is allowed in a KubeSphere cluster.
- **Set Authorization Rule**: Set authorization rules so that the storage class can be accessed only in specific projects and workspaces.
- **Set Volume Operations**: Manage volume features, including: **Volume Cloning**, **Volume Snapshot Creation**, and **Volume Expansion**. Before enabling any features, you should contact your system administrator to confirm that the features are supported by the storage system.
- **Set Auto Expansion**: Set the system to automatically expand volumes when the remaining volume space is lower than a threshold. You can also enable **Restart workload automatically**.
- **Delete**: Delete the storage class.

On the **Persistent Volume Claims** tab, you can view the PVCs associated to the storage class.