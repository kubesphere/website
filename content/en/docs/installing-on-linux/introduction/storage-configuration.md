---
title: "Persistent Storage Configurations"
keywords: 'Kubernetes, docker, KubeSphere, storage, volume, PVC, KubeKey, add-on'
description: 'Persistent Storage Configuration'

linkTitle: "Persistent Storage Configurations"
weight: 3170
---

## Overview
Persistent volumes are a **Must** for installing KubeSphere. [KubeKey](https://github.com/kubesphere/kubekey) lets KubeSphere be installed on different storage systems by the [add-on mechanism](https://github.com/kubesphere/kubekey/blob/v1.0.0/docs/addons.md). General steps of installing KubeSphere by KubeKey on Linux are:

1. Install Kubernetes.
2. Install the **add-on** plugin for KubeSphere.
3. Install Kubesphere by [ks-installer](https://github.com/kubesphere/ks-installer).

In KubeKey configurations, `spec.persistence.storageClass` of `ClusterConfiguration` needs to be set for ks-installer to create a PersistentVolumeClaim (PVC) for KubeSphere. If it is empty, the **default StorageClass** (annotation `storageclass.kubernetes.io/is-default-class` equals to `true`) will be used.
``` yaml
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
spec:
  persistence:
    storageClass: ""
...    
```

Therefore, an available StorageClass **must** be installed in Step 2 above. It includes:
- StorageClass itself
- Storage Plugin for the StorageClass if necessary 

This tutorial introduces **KubeKey add-on configurations** for some mainly used storage plugins. If `spec.persistence.storageClass` is empty, the default StorageClass will be installed. Refer to the following sections if you want to configure other storage systems.

## QingCloud CSI
If you plan to install KubeSphere on [QingCloud](https://www.qingcloud.com/), [QingCloud CSI](https://github.com/yunify/qingcloud-csi) can be chosen as the underlying storage plugin. The following is an example of KubeKey add-on configurations for QingCloud CSI installed by **Helm Charts including a StorageClass**.

### Chart Config
```yaml
config:
  qy_access_key_id: "MBKTPXWCIRIEDQYQKXYL"    # Replace it with your own key id.
  qy_secret_access_key: "cqEnHYZhdVCVif9qCUge3LNUXG1Cb9VzKY2RnBdX"  # Replace it with your own access key.
  zone: "pek3a"  # Lowercase letters only.
sc:
  isDefaultClass: true # Set it as the default storage class.
```
You need to create this file of chart configurations and input the values above manually.

#### Key

To get values for `qy_access_key_id` and `qy_secret_access_key`, log in to the web console of [QingCloud](https://console.qingcloud.com/login) and refer to the image below to create a key first. Download the key after it is created, which is stored in a csv file.

![access-key](/images/docs/installing-on-linux/introduction/persistent-storage-configuration/access-key.jpg)

#### Zone

The field `zone` specifies where your cloud volumes are deployed. On QingCloud Platform, you must select a zone before you create volumes.

![storage-zone](/images/docs/installing-on-linux/introduction/persistent-storage-configuration/storage-zone.jpg)

Make sure the value you specify for `zone` matches the region ID below:

| Zone                                        | Region ID               |
| ------------------------------------------- | ----------------------- |
| Shanghai1-A/Shanghai1-B                     | sh1a/sh1b               |
| Beijing3-A/Beijing3-B/Beijing3-C/Beijing3-D | pek3a/pek3b/pek3c/pek3d |
| Guangdong2-A/Guangdong2-B                   | gd2a/gd2b               |
| Asia-Pacific 2-A                            | ap2a                    |

If you want to configure more values, see [chart configuration for QingCloud CSI](https://github.com/kubesphere/helm-charts/tree/master/src/test/csi-qingcloud#configuration).

### Add-on Config
Save the above chart config locally (e.g. `/root/csi-qingcloud.yaml`). The add-on config for QingCloud CSI could be like:
```yaml
addons:
- name: csi-qingcloud
  namespace: kube-system
  sources:
    chart:
      name: csi-qingcloud
      repo: https://charts.kubesphere.io/test
      values: /root/csi-qingcloud.yaml
```

## NFS Client
With a NFS server, you can choose [NFS-client Provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client) as the storage plugin. NFS-client Provisioner creates the PersistentVolume dynamically. The following is an example of KubeKey add-on configurations for NFS-client Provisioner installed by **Helm Charts including a StorageClass** .

### Chart Config
```yaml
nfs:
  server: "192.168.0.27"    # <--ToBeReplaced->
  path: "/mnt/csi/"    # <--ToBeReplaced-> 
storageClass:
  defaultClass: false    
```
If you want to configure more values, see [chart configuration for nfs-client](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner#configuration).

### Add-on Config
Save the above chart config locally (e.g. `/root/nfs-client.yaml`). The add-on config for NFS-Client Provisioner cloud be like:
```yaml
addons:
- name: nfs-client
  namespace: kube-system
  sources:
    chart:
      name: nfs-client-provisioner
      repo: https://charts.kubesphere.io/main
      values: /root/nfs-client.yaml
```

## Ceph 
With a Ceph server, you can choose [Ceph RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) or [Ceph CSI](https://github.com/ceph/ceph-csi) as the underlying storage plugin. Ceph RBD is an in-tree storage plugin on Kubernetes, and Ceph CSI is a Container Storage Interface (CSI) driver for RBD, CephFS. 

###  Which Plugin to Select for Ceph 
Ceph CSI RBD is the preferred choice if you work with **14.0.0 (Nautilus)+** Ceph cluster. Here are some reasons:
- The in-tree plugin will be deprecated in the future.
- Ceph RBD only works on Kubernetes with **hyperkube** images, and **hyperkube** images were 
[deprecated since Kubernetes 1.17](https://github.com/kubernetes/kubernetes/pull/85094).
- Ceph CSI has more features such as cloning, expanding and snapshots.

### Ceph CSI RBD
Ceph-CSI needs to be installed on v1.14.0+ Kubernetes, and work with 14.0.0 (Nautilus)+ Ceph Cluster. 
For details about compatibility, see [Ceph CSI Support Matrix](https://github.com/ceph/ceph-csi#support-matrix). 

The following is an example of KubeKey add-on configurations for Ceph CSI RBD installed by **Helm Charts**.
As the StorageClass is not included in the chart, a StorageClass needs to be configured in the add-on config. 

####  Chart Config

```yaml
csiConfig:
  - clusterID: "cluster1"
    monitors:
      - "192.168.0.8:6789"     # <--TobeReplaced-->
      - "192.168.0.9:6789"     # <--TobeReplaced-->
      - "192.168.0.10:6789"    # <--TobeReplaced-->
```
If you want to configure more values, see [chart configuration for ceph-csi-rbd](https://github.com/ceph/ceph-csi/tree/master/charts/ceph-csi-rbd).

#### StorageClass (including secret)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: csi-rbd-secret
  namespace: kube-system
stringData:
  userID: admin
  userKey: "AQDoECFfYD3DGBAAm6CPhFS8TQ0Hn0aslTlovw=="    # <--ToBeReplaced-->
  encryptionPassphrase: test_passphrase
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
   name: csi-rbd-sc
   annotations:
     storageclass.beta.kubernetes.io/is-default-class: "true"
     storageclass.kubesphere.io/supported-access-modes: '["ReadWriteOnce","ReadOnlyMany","ReadWriteMany"]'
provisioner: rbd.csi.ceph.com
parameters:
   clusterID: "cluster1"
   pool: "rbd"    # <--ToBeReplaced-->
   imageFeatures: layering
   csi.storage.k8s.io/provisioner-secret-name: csi-rbd-secret
   csi.storage.k8s.io/provisioner-secret-namespace: kube-system
   csi.storage.k8s.io/controller-expand-secret-name: csi-rbd-secret
   csi.storage.k8s.io/controller-expand-secret-namespace: kube-system
   csi.storage.k8s.io/node-stage-secret-name: csi-rbd-secret
   csi.storage.k8s.io/node-stage-secret-namespace: kube-system
   csi.storage.k8s.io/fstype: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
mountOptions:
   - discard
```

#### Add-On Config
Save the above chart config and StorageClass locally (e.g. `/root/ceph-csi-rbd.yaml` and `/root/ceph-csi-rbd-sc.yaml`). The add-on configuration can be set like:
```yaml
addons: 
- name: ceph-csi-rbd
  namespace: kube-system
  sources:
    chart:
      name: ceph-csi-rbd
      repo: https://ceph.github.io/csi-charts
      values: /root/ceph-csi-rbd.yaml
- name: ceph-csi-rbd-sc
  sources:
    yaml:
      path:
      - /root/ceph-csi-rbd-sc.yaml
```

### Ceph RBD
KubeKey will never use **hyperkube** images. Hence, in-tree Ceph RBD may not work on Kubernetes installed by KubeKey. However, if your Ceph cluster is lower than 14.0.0 which means Ceph CSI can't be used, [rbd provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/ceph/rbd) can be used as a substitute for Ceph RBD. Its format is the same with [in-tree Ceph RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd). 
The following is an example of KubeKey add-on configurations for rbd provisioner installed by **Helm Charts including a StorageClass**.

#### Chart Config
```yaml
ceph:
  mon: "192.168.0.12:6789"    # <--ToBeReplaced-->
  adminKey: "QVFBS1JkdGRvV0lySUJBQW5LaVpSKzBRY2tjWmd6UzRJdndmQ2c9PQ=="   # <--ToBeReplaced-->
  userKey: "QVFBS1JkdGRvV0lySUJBQW5LaVpSKzBRY2tjWmd6UzRJdndmQ2c9PQ=="    # <--ToBeReplaced-->
sc:
  isDefault: false
```
If you want to configure more values, see [chart configuration for rbd-provisioner](https://github.com/kubesphere/helm-charts/tree/master/src/test/rbd-provisioner#configuration).

#### Add-on Config
Save the above chart config locally (e.g. `/root/rbd-provisioner.yaml`). The add-on config for rbd provisioner cloud be like: 
```yaml
- name: rbd-provisioner
  namespace: kube-system
  sources:
    chart:
      name: rbd-provisioner
      repo: https://charts.kubesphere.io/test
      values: /root/rbd-provisioner.yaml
```

## Glusterfs
[Glusterfs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) is an in-tree storage plugin in Kubernetes. Hence, **only StorageClass** needs to be installed. 
The following is an example of KubeKey add-on configurations for glusterfs.

### StorageClass (including secret)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: heketi-secret
  namespace: kube-system
type: kubernetes.io/glusterfs
data:
  key: "MTIzNDU2"    # <--ToBeReplaced-->  
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.beta.kubernetes.io/is-default-class: "true"
    storageclass.kubesphere.io/supported-access-modes: '["ReadWriteOnce","ReadOnlyMany","ReadWriteMany"]'
  name: glusterfs
parameters:
  clusterid: "21240a91145aee4d801661689383dcd1"    # <--ToBeReplaced--> 
  gidMax: "50000"
  gidMin: "40000"
  restauthenabled: "true"
  resturl: "http://192.168.0.14:8080"    # <--ToBeReplaced-->
  restuser: admin
  secretName: heketi-secret
  secretNamespace: kube-system
  volumetype: "replicate:2"    # <--ToBeReplaced--> 
provisioner: kubernetes.io/glusterfs
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

### Add-on Config
Save the above StorageClass yaml locally (e.g. **/root/glusterfs-sc.yaml**). The add-on configuration can be set like:
```yaml
- addon
- name: glusterfs
  sources:
    yaml:
      path:
      - /root/glusterfs-sc.yaml
```

## OpenEBS/LocalVolumes
[OpenEBS](https://github.com/openebs/openebs) Dynamic Local PV provisioner can create Kubernetes Local Persistent Volumes 
using a unique HostPath (directory) on the node to persist data. 
It is very convenient for users to get started with KubeSphere when they have no special storage system. 
If **no default StorageClass** is configured with **KubeKey** add-on, OpenEBS/LocalVolumes will be installed.

## Multi-Storage
If you intend to install more than one storage plugins, please only set one of them to be the default or 
set `spec.persistence.storageClass` of `ClusterConfiguration` with the StorageClass name you want Kubesphere to use.
Otherwise, [ks-installer](https://github.com/kubesphere/ks-installer) will be confused about which StorageClass to use. 