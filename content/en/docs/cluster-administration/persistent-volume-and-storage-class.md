---
title: "Persistent Volumes and Storage Classes"
keywords: "storage, volume, pv, pvc, storage class, csi, Ceph RBD, GlusterFS, QingCloud, "
description: "Learn basic concepts of PVs, PVCs and storage classes, and demonstrate how to manage storage classes and PVCs in KubeSphere."
linkTitle: "Persistent Volumes and Storage Classes"
weight: 8400
---

This tutorial describes the basic concepts of PVs, PVCs, and storage classes and demonstrates how a cluster administrator can manage storage classes and persistent volumes in KubeSphere.

## Introduction

A PersistentVolume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using storage classes. PVs are volume plugins like volumes, but have a lifecycle independent of any individual Pod that uses the PV. PVs can be provisioned either [statically](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#static) or [dynamically](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#dynamic).

A PersistentVolumeClaim (PVC) is a request for storage by a user. It is similar to a Pod. Pods consume node resources and PVCs consume PV resources.

KubeSphere supports [dynamic volume provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) based on storage classes to create PVs.

A [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes) provides a way for administrators to describe the classes of storage they offer. Different classes might map to quality-of-service levels, or to backup policies, or to arbitrary policies determined by the cluster administrators. Each storage class has a provisioner that determines what volume plugin is used for provisioning PVs. This field must be specified. For which value to use, please read [the official Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner) or check with your storage administrator.

The table below summarizes common volume plugins for various provisioners (storage systems).

| Type                 | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| In-tree              | Built-in and run as part of Kubernetes, such as [RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) and [GlusterFS](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs). For more plugins of this kind, see [Provisioner](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner). |
| External-provisioner | Deployed independently from Kubernetes, but works like an in-tree plugin, such as [nfs-client](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client). For more plugins of this kind, see [External Storage](https://github.com/kubernetes-retired/external-storage). |
| CSI                  | Container Storage Interface, a standard for exposing storage resources to workloads on COs (for example, Kubernetes), such as [QingCloud-csi](https://github.com/yunify/qingcloud-csi) and [Ceph-CSI](https://github.com/ceph/ceph-csi). For more plugins of this kind, see [Drivers](https://kubernetes-csi.github.io/docs/drivers.html). |

## Prerequisites

You need a user granted a role including the authorization of **Cluster Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to a user.

## Manage Storage Classes

1. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. If you have enabled the [multi-cluster feature](../../multicluster-management/) with member clusters imported, you can select a specific cluster. If you have not enabled the feature, refer to the next step directly.

3. On the **Cluster Management** page, go to **Storage Classes** under **Storage**, where you can create, update, and delete a storage class.

4. To create a storage class, click **Create** and enter the basic information in the displayed dialog box. When you finish, click **Next**.

5. In KubeSphere, you can create storage classes for `QingCloud-CSI`, `GlusterFS`, and `Ceph RBD`. Alternatively, you can also create customized storage classes for other storage systems based on your needs. Select a type and click **Next**.

### Common settings

Some settings are commonly used and shared among storage classes. You can find them as dashboard parameters on the console, which are also indicated by fields or annotations in the StorageClass manifest. You can see the manifest file in YAML format by clicking **Edit YAML** in the upper-right corner.

Here are parameter descriptions of some commonly used fields in KubeSphere.

| Parameter | Description |
| :---- | :---- |
| Volume Expansion Allowed | Specified by `allowVolumeExpansion` in the manifest. When it is set to `true`, PVs can be configured to be expandable. For more information, see [Allow Volume Expansion](https://kubernetes.io/docs/concepts/storage/storage-classes/#allow-volume-expansion). |
| Reclaim Policy | Specified by `reclaimPolicy` in the manifest. For more information, see [Reclaim Policy](https://kubernetes.io/docs/concepts/storage/storage-classes/#reclaim-policy). |
| Storage System | Specified by `provisioner` in the manifest. It determines what volume plugin is used for provisioning PVs. For more information, see [Provisioner](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner). |
| Supported Access Mode | Specified by `metadata.annotations[storageclass.kubesphere.io/supported-access-modes]` in the manifest. It tells KubeSphere which [access mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) is supported. |

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
| REST URL  | Heketi REST URL that provisions volumes, for example, <Heketi Service cluster IP Address>:<Heketi Service port number>. |
| Cluster ID | Gluster cluster ID. |
| REST Authentication | Gluster enables authentication to the REST server. |
| REST User | Username of Gluster REST service or Heketi service. |
| Secret Namespace/Secret Name | Namespace of the Heketi user secret. |
| Secret Name | Name of the Heketi user secret. |
| Minimum GID | Minimum GID of the volume. |
| Maximum GID | Maximum GID of the volume. |
| Volume Type | Type of volume. The value can be none, replicate:<Replicate count>, or disperse:<Data>:<Redundancy count>. If the volume type is not set, the default volume type is replicate:3. |

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

### Custom storage classes

You can create custom storage classes for your storage systems if they are not directly supported by KubeSphere. The following example shows you how to create a storage class for NFS on the KubeSphere console.

#### NFS Introduction

NFS (Net File System) is widely used on Kubernetes with the external-provisioner volume plugin
[nfs-client](https://github.com/kubernetes-retired/external-storage/tree/master/nfs-client). You can create the storage class of nfs-client by clicking **Custom**.

{{< notice note >}}

It is not recommended that you use NFS storage for production (especially on Kubernetes version 1.20 or later) as some issues may occur, such as `failed to obtain lock` and `input/output error`, resulting in Pod `CrashLoopBackOff`. Besides, some apps may not be compatible with NFS, including [Prometheus](https://github.com/prometheus/prometheus/blob/03b354d4d9386e4b3bfbcd45da4bb58b182051a5/docs/storage.md#operational-aspects).

{{</ notice >}} 

#### Prerequisites

- An available NFS server.
- The volume plugin nfs-client has already been installed. Community developers provide [charts for nfs-client](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner) that you can use to install nfs-client by helm.

#### Common Settings

| Parameter | Description |
| :---- | :---- |
| Storage System | Specified by `provisioner` in the manifest. If you install the storage class by [charts for nfs-client](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner), it can be `cluster.local/nfs-client-nfs-client-provisioner`. |
| Volume Expansion Allowed | Specified by `allowVolumeExpansion` in the manifest. Select `No`. |
| Reclaim Policy | Specified by `reclaimPolicy` in the manifest. The value is `Delete` by default. |
| Supported Access Mode | Specified by `.metadata.annotations.storageclass.kubesphere.io/supported-access-modes` in the manifest. `ReadWriteOnce`, `ReadOnlyMany` and `ReadWriteMany` all are selected by default. |

#### Parameters

| Key| Description | Value |
| :---- | :---- |  :----|
| archiveOnDelete | Archive pvc when deleting | `true` |

## Manage Volumes

Once the storage class is created, you can create volumes with it. You can list, create, update and delete volumes in **Volumes** under **Storage** on the KubeSphere console. For more details, please see [Volume Management](../../project-user-guide/storage/volumes/).

## Manage Volume Instances

A volume in KubeSphere is a [persistent volume claim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) in Kubernetes, and a  volume instance is a [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) in Kubernetes. 

### Volume instance list page

1. Log in to KubeSphere console as `admin`. Click **Platform** in the upper-left corner, select **Cluster Management**, and click **Volumes** under **Storage**.
2. Click the **Volume Instances** tab on the **Volumes** page to view the volume instance list page that provides the following information:
   - **Name**: Name of the volume instance. It is specified by the field `.metadata.name` in the manifest file of the volume instance.
   - **Status**: Current status of the volume instance. It is specified by the field `.status.phase` in the manifest file of the volume instance, including:
     - **Available**: The volume instance is available and not yet bound to a volume.
     - **Bound**: The volume instance is bound to a volume.
     - **Terminating**: The volume instance is being deleted.
     - **Failed**: The volume instance is unavailable.
   - **Capacity**: Capacity of the volume instance. It is specified by the field `.spec.capacity.storage` in the manifest file of the volume instance.
   - **Access Mode**: Access mode of the volume instance. It is specified by the field `.spec.accessModes` in the manifest file of the volume instance, including:
     - **RWO**: The volume instance can be mounted as read-write by a single node.
     - **ROX**: The volume instance can be mounted as read-only by multiple nodes.
     - **RWX**: The volume instance can be mounted as read-write by multiple nodes.
   - **Recycling Strategy**: Recycling strategy of the volume instance. It is specified by the field `.spec.persistentVolumeReclaimPolicy` in the manifest file of the volume instance, including:
     - **Retain**: When a volume is deleted, the volume instance still exists and requires manual reclamation.
     - **Delete**: Remove both the volume instance and the associated storage assets in the volume plugin infrastructure.
     - **Recycle**: Erase the data on the volume instance and make it available again for a new volume.
   - **Creation Time**: Time when the volume instance was created.
3. Click <img src="/images/docs/common-icons/three-dots.png" width="15" /> on the right of a volume instance and select an operation from the drop-down menu:
   - **Edit**: Edit the YAML file of a volume instance.
   - **View YAML**: View the YAML file of the volume instance.
   - **Delete**: Delete the volume instance. A volume instance in the **Bound** status cannot be deleted.

### Volume instance details page

1. Click the name of a volume instance to go to its details page.
2. On the details page, click **Edit Information** to edit the basic information of the volume instance. By clicking **More**, select an operation from the drop-down menu:
   - **View YAML**: View the YAML file of the volume instance.
   - **Delete**: Delete the volume instance and return to the list page. A volume instance in the **Bound** status cannot be deleted.
3. Click the **Resource Status** tab to view the volumes to which the volume instance is bound.
4. Click the **Metadata** tab to view the labels and annotations of the volume instance.
5. Click the **Events** tab to view the events of the volume instance.
