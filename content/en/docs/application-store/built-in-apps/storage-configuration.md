---
title: "StorageClass Configuration"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Instructions for Setting up StorageClass for KubeSphere'

weight: 2250
---

Currently, Installer supports the following [Storage Class](https://kubernetes.io/docs/concepts/storage/storage-classes/), providing persistent storage service for KubeSphere (more storage classes will be supported soon).

- NFS
- Ceph RBD
- GlusterFS
- QingCloud Block Storage
- QingStor NeonSAN
- Local Volume (for development and test only)

The versions of storage systems and corresponding CSI plugins in the table listed below have been well tested.

| **Name** | **Version** | **Reference** |
| ----------- | --- |---|
Ceph RBD Server | v0.94.10 | For development and testing, refer to [Install Ceph Storage Server](/zh-CN/appendix/ceph-ks-install/) for details.  Please refer to [Ceph Documentation](http://docs.ceph.com/docs/master/) for production. |
Ceph RBD Client | v12.2.5 | Before installing KubeSphere, you need to configure the corresponding parameters in `common.yaml`. Please refer to [Ceph RBD](../storage-configuration/#ceph-rbd) |
GlusterFS Server | v3.7.6 | For development and testing, refer to [Deploying GlusterFS Storage Server](/zh-CN/appendix/glusterfs-ks-install/) for details. Please refer to [Gluster Documentation](https://www.gluster.org/install/) or [Gluster Documentation](http://gluster.readthedocs.io/en/latest/Install-Guide/Install/) for production. Note you need to install [Heketi Manager (V3.0.0)](https://github.com/heketi/heketi/tree/master/docs/admin). |
|GlusterFS Client |v3.12.10|Before installing KubeSphere, you need to configure the corresponding parameters in `common.yaml`. Please refer to [GlusterFS](../storage-configuration/#glusterfs)|
|NFS Client | v3.1.0 | Before installing KubeSphere, you need to configure the corresponding parameters in `common.yaml`. Make sure you have prepared NFS storage server. Please see [NFS Client](../storage-configuration/#nfs) |
QingCloud-CSI|v0.2.0.1|You need to configure the corresponding parameters in `common.yaml` before installing KubeSphere. Please refer to [QingCloud CSI](../storage-configuration/#qingcloud-csi) for details|
NeonSAN-CSI|v0.3.0| Before installing KubeSphere, you need to configure the corresponding parameters in `common.yaml`. Make sure you have prepared QingStor NeonSAN storage server. Please see [Neonsan-CSI](../storage-configuration/#neonsan-csi) |

> Note: You are only allowed to set ONE default storage classes in the cluster. To specify a default storage class, make sure there is no default storage class already exited in the cluster.

## Storage Configuration

After preparing the storage server, you need to refer to the parameters description in the following table. Then modify the corresponding configurations in `conf/common.yaml` accordingly.

The following describes the storage configuration in `common.yaml`.

> Note: Local Volume is configured as the default storage class in `common.yaml` by default. If you are going to set other storage class as the default, disable the Local Volume and modify the configuration for other storage class.

### Local Volume (For developing or testing only)

A [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) represents a mounted local storage device such as a disk, partition or directory. Local volumes can only be used as a statically created PersistentVolume. We recommend you to use Local volume in testing or development only since it is quick and easy to install KubeSphere without the struggle to set up persistent storage server. Refer to following table for the definition in `conf/common.yaml`.

| **Local volume** | **Description** |
| --- | --- |
| local\_volume\_provisioner\_enabled | Whether to use Local as the persistent storage, defaults to true |
| local\_volume\_provisioner\_storage\_class | Storage class name, default value：local |
| local\_volume\_is\_default\_class | Whether to set Local as the default storage class, defaults to true.|

### NFS

An NFS volume allows an existing NFS (Network File System) share to be mounted into your Pod. NFS can be configured in `conf/common.yaml`. Note you need to prepare NFS server in advance.

| **NFS** | **Description** |
| --- | --- |
| nfs\_client\_enable | Whether to use NFS as the persistent storage, defaults to false |
| nfs\_client\_is\_default\_class | Whether to set NFS as default storage class, defaults to false. |
| nfs\_server | The NFS server address, either IP or Hostname |
| nfs\_path | NFS shared directory, which is the file directory shared on the server, see [Kubernetes Documentation](https://kubernetes.io/docs/concepts/storage/volumes/#nfs) |
|nfs\_vers3\_enabled | Specifies which version of the NFS protocol to use, defaults to false which means v4. True means v4 |
|nfs_archiveOnDelete | Archive PVC when deleting. It will automatically remove data from `oldPath` when it sets to false |

### Ceph RBD

The open source [Ceph RBD](https://ceph.com/) distributed storage system can be configured to use in `conf/common.yaml`. You need to prepare Ceph storage server in advance. Please refer to [Kubernetes Documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) for more details.

| **Ceph\_RBD** | **Description** |
| --- | --- |
| ceph\_rbd\_enabled | Whether to use Ceph RBD as the persistent storage, defaults to false |
| ceph\_rbd\_storage\_class | Storage class name |
| ceph\_rbd\_is\_default\_class | Whether to set Ceph RBD as default storage class, defaults to false |
| ceph\_rbd\_monitors | Ceph monitors, comma delimited. This parameter is required, which depends on Ceph RBD server parameters |
| ceph\_rbd\_admin\_id | Ceph client ID that is capable of creating images in the pool. Defaults to “admin” |
| ceph\_rbd\_admin\_secret | Admin_id's secret, secret name for "adminId". This parameter is required. The provided secret must have type “kubernetes.io/rbd” |
| ceph\_rbd\_pool | Ceph RBD pool. Default is “rbd” |
| ceph\_rbd\_user\_id | Ceph client ID that is used to map the RBD image. Default is the same as adminId |
| ceph\_rbd\_user\_secret | Secret for User_id, it is required to create this secret in namespace which used rbd image |
| ceph\_rbd\_fsType | fsType that is supported by Kubernetes. Default: "ext4"|
| ceph\_rbd\_imageFormat | Ceph RBD image format, “1” or “2”. Default is “1” |
|ceph\_rbd\_imageFeatures| This parameter is optional and should only be used if you set imageFormat to “2”. Currently supported features are layering only. Default is “”, and no features are turned on|

> Note:
>
> The ceph secret, which is created in storage class, like "ceph_rbd_admin_secret" and "ceph_rbd_user_secret", is retrieved using following command in Ceph storage server.

```bash
ceph auth get-key client.admin
```

### GlusterFS

[GlusterFS](https://docs.gluster.org/en/latest/) is a scalable network filesystem suitable for data-intensive tasks such as cloud storage and media streaming. You need to prepare GlusterFS storage server in advance. Please refer to [Kubernetes Documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) for further information.

| **GlusterFS（It requires glusterfs cluster which is managed by heketi）**|**Description** |
| --- | --- |
| glusterfs\_provisioner\_enabled | Whether to use GlusterFS as the persistent storage, defaults to false |
| glusterfs\_provisioner\_storage\_class | Storage class name |
| glusterfs\_is\_default\_class | Whether to set GlusterFS as default storage class, defaults to false |
| glusterfs\_provisioner\_restauthenabled | Gluster REST service authentication boolean that enables authentication to the REST server |
| glusterfs\_provisioner\_resturl | Gluster REST service/Heketi service url which provision gluster volumes on demand. The general format should be "IP address:Port" and this is a mandatory parameter for GlusterFS dynamic provisioner|
| glusterfs\_provisioner\_clusterid | Optional, for example, 630372ccdc720a92c681fb928f27b53f is the ID of the cluster which will be used by Heketi when provisioning the volume. It can also be a list of clusterids |
| glusterfs\_provisioner\_restuser | Gluster REST service/Heketi user who has access to create volumes in the Gluster Trusted Pool |
| glusterfs\_provisioner\_secretName | Optional, identification of Secret instance that contains user password to use when talking to Gluster REST service, Installer will automatically create this secret in kube-system |
| glusterfs\_provisioner\_gidMin | The minimum value of GID range for the storage class |
| glusterfs\_provisioner\_gidMax |The maximum value of GID range for the storage class |
| glusterfs\_provisioner\_volumetype | The volume type and its parameters can be configured with this optional value, for example: ‘Replica volume’: volumetype: replicate:3 |
| jwt\_admin\_key | "jwt.admin.key" field is from "/etc/heketi/heketi.json" in Heketi server |

**Attention：**

 > Please note: `"glusterfs_provisioner_clusterid"` could be returned from glusterfs server by running the following command:

 ```bash
 export HEKETI_CLI_SERVER=http://localhost:8080
 heketi-cli cluster list
 ```

### QingCloud Block Storage

[QingCloud Block Storage](https://docs.qingcloud.com/product/Storage/volume/) is supported in KubeSphere as the persistent storage service. If you would like to experience dynamic provisioning when creating volume, we recommend you to use it as your persistent storage solution. KubeSphere integrates [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md), and allows you to use various block storage services of QingCloud. With simple configuration, you can quickly expand, clone PVCs and view the topology of PVCs, create/delete snapshot, as well as restore volume from snapshot.

QingCloud-CSI plugin has implemented the standard CSI. You can easily create and manage different types of volumes in KubeSphere, which are provided by QingCloud. The corresponding PVCs will created with ReadWriteOnce access mode and mounted to running Pods.

QingCloud-CSI supports create the following five types of volume in QingCloud:

- High capacity
- Standard
- SSD Enterprise
- Super high performance
- High performance

|**QingCloud-CSI** | **Description**|
| --- | ---|
| qingcloud\_csi\_enabled|Whether to use QingCloud-CSI as the persistent storage volume, defaults to false |
| qingcloud\_csi\_is\_default\_class| Whether to set QingCloud-CSI as default storage class, defaults to false |
qingcloud\_access\_key\_id , <br> qingcloud\_secret\_access\_key| Please obtain it from [QingCloud Console](https://console.qingcloud.com/login) |
|qingcloud\_zone| Zone should be the same as the zone where the Kubernetes cluster is installed, and the CSI plugin will operate on the storage volumes for this zone. For example: zone can be set to these values, such as sh1a (Shanghai 1-A), sh1b (Shanghai 1-B), pek2 (Beijing 2), pek3a (Beijing 3-A), pek3b (Beijing 3-B), pek3c (Beijing 3-C), gd1 (Guangdong 1), gd2a (Guangdong 2-A), ap1 (Asia Pacific 1), ap2a (Asia Pacific 2-A) |
| type | The type of volume in QingCloud platform. In QingCloud platform, 0 represents high performance volume. 3 represents super high performance volume. 1 or 2 represents high capacity volume depending on cluster‘s zone, see [QingCloud Documentation](https://docs.qingcloud.com/product/api/action/volume/create_volumes.html)|
| maxSize, minSize | Limit the range of volume size in GiB|
| stepSize | Set the increment of volumes size in GiB|
| fsType | The file system of the storage volume, which supports ext3, ext4, xfs. The default is ext4|

### QingStor NeonSAN

The NeonSAN-CSI plugin supports the enterprise-level distributed storage [QingStor NeonSAN](https://www.qingcloud.com/products/qingstor-neonsan/) as the persistent storage solution. You need prepare the NeonSAN server, then configure the NeonSAN-CSI plugin to connect to its storage server in `conf/common.yaml`. Please refer to [NeonSAN-CSI Reference](https://github.com/wnxn/qingstor-csi/blob/master/docs/reference_zh.md#storageclass-%E5%8F%82%E6%95%B0) for further information.

| **NeonSAN** | **Description** |
| --- | --- |
| neonsan\_csi\_enabled | Whether to use NeonSAN as the persistent storage, defaults to false |
| neonsan\_csi\_is\_default\_class | Whether to set NeonSAN-CSI as the default storage class, defaults to false|
Neonsan\_csi\_protocol | transportation protocol, user must set the option, such as TCP or RDMA|
| neonsan\_server\_address | NeonSAN server address |
| neonsan\_cluster\_name| NeonSAN server cluster name|
| neonsan\_server\_pool|A comma separated list of pools. Tell plugin to manager these pools. User must set the option, the default value is kube|
| neonsan\_server\_replicas|NeonSAN image replica count. Default: 1|
| neonsan\_server\_stepSize|set the increment of volumes size in GiB. Default: 1|
| neonsan\_server\_fsType|The file system to use for the volume. Default: ext4|
