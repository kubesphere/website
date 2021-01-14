---
title: "持久化存储配置"
keywords: 'Kubernetes, KubeSphere, 存储, 存储卷, PVC, KubeKey, 插件'
description: '持久化存储配置'
linkTitle: "持久化存储配置"
weight: 3170
---

## 概述
安装 KubeSphere 时**必须**有持久化存储卷。[KubeKey](https://github.com/kubesphere/kubekey) 通过 [Add-on 机制](https://github.com/kubesphere/kubekey/blob/v1.0.0/docs/addons.md)可以在不同的存储系统上安装 KubeSphere。在 Linux 上使用 KubeKey 安装 KubeSphere 的一般步骤是：

1. 安装 Kubernetes。
2. 安装 KubeSphere 的 **Add-on** 插件。
3. 使用 [ks-installer](https://github.com/kubesphere/ks-installer) 安装 KubeSphere。

在 KubeKey 配置中，需要设置 `ClusterConfiguration` 的 `spec.persistence.storageClass`，使 ks-installer 为 KubeSphere 创建 PersistentVolumeClaim (PVC)。如果此处为空，将使用**默认 StorageClass**（注解 `storageclass.kubernetes.io/is-default-class` 等于 `true`）。
``` yaml
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
spec:
  persistence:
    storageClass: ""
...    
```

因此，在前述的步骤 2 中**必须**安装一个可用的 StorageClass。它包括：
- StorageClass 本身
- StorageClass 的存储插件（如有必要） 

本教程介绍了一些常用存储插件的 **KubeKey Add-on 配置**。如果 `spec.persistence.storageClass` 为空，将安装默认 StorageClass。如果您想配置其他存储系统，请参考下面的内容。

## QingCloud CSI
如果您打算在[青云QingCloud](https://www.qingcloud.com/) 上安装 KubeSphere，可以选择 [QingCloud CSI](https://github.com/yunify/qingcloud-csi) 作为底层存储插件。下面是使用**带有 StorageClass 的 Helm Chart** 安装 QingCloud CSI 的 KubeKey Add-on 配置示例。

### Chart 配置
```yaml
config:
  qy_access_key_id: "MBKTPXWCIRIEDQYQKXYL"    # Replace it with your own key id.
  qy_secret_access_key: "cqEnHYZhdVCVif9qCUge3LNUXG1Cb9VzKY2RnBdX"  # Replace it with your own access key.
  zone: "pek3a"  # Lowercase letters only.
sc:
  isDefaultClass: true # Set it as the default storage class.
```
您需要创建该 Chart 配置文件，并手动输入上面的值。

#### 密钥 (Key)

要获取 `qy_access_key_id` 和 `qy_secret_access_key` 的值，请登录[青云QingCloud](https://console.qingcloud.com/login) 的 Web 控制台，参考下方截图先创建一个密钥。密钥创建之后会存储在 csv 文件中，下载该 csv 文件。

![access-key](/images/docs/zh-cn/installing-on-linux/introduction/persistent-storage-configurations/access-key.PNG)

#### 可用区 (Zone)

字段 `zone` 指定云存储卷部署的位置。在青云QingCloud 平台上，您必须先选择一个可用区，然后才能创建存储卷。

![storage-zone](/images/docs/zh-cn/installing-on-linux/introduction/persistent-storage-configurations/storage-zone.PNG)

请确保您在 `zone` 中指定的值匹配下表中列出的区域 (Region) ID：

| 可用区                                      | 区域 ID                 |
| ------------------------------------------- | ----------------------- |
| Shanghai1-A/Shanghai1-B                     | sh1a/sh1b               |
| Beijing3-A/Beijing3-B/Beijing3-C/Beijing3-D | pek3a/pek3b/pek3c/pek3d |
| Guangdong2-A/Guangdong2-B                   | gd2a/gd2b               |
| Asia-Pacific 2-A                            | ap2a                    |

如果您想配置更多值，请参见 [QingCloud CSI Chart 配置](https://github.com/kubesphere/helm-charts/tree/master/src/test/csi-qingcloud#configuration)。

### Add-on 配置
将上面的 Chart 配置文件保存至本地（例如 `/root/csi-qingcloud.yaml`）。QingCloud CSI Add-on 配置可设为：
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
通过 NFS 服务器，您可以选择 [NFS-client Provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client) 作为存储插件。NFS-client Provisioner 会动态创建 PersistentVolume。下面是使用**带有 StorageClass 的 Helm Chart** 安装 NFS-client Provisioner 的 KubeKey Add-on 配置示例。

### Chart 配置
```yaml
nfs:
  server: "192.168.0.27"    # <--ToBeReplaced->
  path: "/mnt/csi/"    # <--ToBeReplaced-> 
storageClass:
  defaultClass: false    
```
如果您想配置更多值，请参见 [NFS-client Chart 配置](https://github.com/kubesphere/helm-charts/tree/master/src/main/nfs-client-provisioner#configuration)。

### Add-on 配置
将上面的 Chart 配置文件保存至本地（例如 `/root/nfs-client.yaml`）。NFS-client Provisioner 的 Add-on 配置可设为：
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
通过 Ceph 服务器，您可以选择 [Ceph RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) 或 [Ceph CSI](https://github.com/ceph/ceph-csi) 作为底层存储插件。Ceph RBD 是 Kubernetes 上的一个树内 (in-tree) 存储插件，Ceph CSI 是 CephFS RBD 的容器存储接口 (CSI) 驱动。

###  为 Ceph 选择一种插件 
如果您使用 **14.0.0 (Nautilus)+** Ceph 集群，建议优先选择 Ceph CSI RBD。部分理由如下：
- 树内插件在未来会被弃用。
- Ceph RBD 仅能在使用 **hyperkube** 镜像的 Kubernetes 上运行，而 **hyperkube** 镜像[自 Kubernetes 1.17 开始已经被弃用](https://github.com/kubernetes/kubernetes/pull/85094)。
- Ceph CSI 具有更多功能，例如克隆、扩容和快照。

### Ceph CSI RBD
Ceph-CSI 需要安装在 1.14.0 以上版本的 Kubernetes 上，并与 14.0.0 (Nautilus)+ Ceph 集群一同运行。有关兼容性的详细信息，请参见 [Ceph CSI 支持矩阵](https://github.com/ceph/ceph-csi#support-matrix)。

下面是使用 **Helm Chart** 安装 Ceph CSI RBD 的 KubeKey Add-on 配置示例。由于 Chart 中未包含 StorageClass，需要在 Add-on 配置文件中配置一个 StorageClass。

####  Chart 配置

```yaml
csiConfig:
  - clusterID: "cluster1"
    monitors:
      - "192.168.0.8:6789"     # <--TobeReplaced-->
      - "192.168.0.9:6789"     # <--TobeReplaced-->
      - "192.168.0.10:6789"    # <--TobeReplaced-->
```
如果您想配置更多值，请参见 [Ceph CSI RBD Chart 配置](https://github.com/ceph/ceph-csi/tree/master/charts/ceph-csi-rbd)。

#### StorageClass（包括 Secret）
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

#### Add-on 配置
将上面的 Chart 配置文件和 StorageClass 文件保存至本地（例如 `/root/ceph-csi-rbd.yaml` 和 `/root/ceph-csi-rbd-sc.yaml`）。Add-on 配置可以设置为：
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
KubeKey 不使用 **hyperkube** 镜像。因此，树内 Ceph RBD 可能无法在由 KubeKey 安装的 Kubernetes 上运行。不过，如果您的 Ceph 集群版本低于 14.0.0，即无法使用 Ceph CSI，则可以使用 [RBD Provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/ceph/rbd) 来替代 Ceph RBD。它的格式与[树内 Ceph RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) 相同。下面是使用**带有 StorageClass 的 Helm Chart** 安装 RBD Provisioner 的 KubeKey Add-on 配置示例。

#### Chart 配置
```yaml
ceph:
  mon: "192.168.0.12:6789"    # <--ToBeReplaced-->
  adminKey: "QVFBS1JkdGRvV0lySUJBQW5LaVpSKzBRY2tjWmd6UzRJdndmQ2c9PQ=="   # <--ToBeReplaced-->
  userKey: "QVFBS1JkdGRvV0lySUJBQW5LaVpSKzBRY2tjWmd6UzRJdndmQ2c9PQ=="    # <--ToBeReplaced-->
sc:
  isDefault: false
```
如果您想配置更多值，请参见 [RBD Provisioner Chart 配置](https://github.com/kubesphere/helm-charts/tree/master/src/test/rbd-provisioner#configuration)。

#### Add-on 配置
将上面的 Chart 配置文件保存至本地（例如 `/root/rbd-provisioner.yaml`）。RBD Provisioner 的 Add-on 配置可设为：
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
[Glusterfs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) 是 Kubernetes 的一个树内存储插件。因此，**只**需要安装 **StorageClass**。下面是 Glusterfs 的 KubeKey Add-on 配置示例。

### StorageClass（包括 Secret）
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

### Add-on 配置
将上面的 StorageClass YAML 文件保存至本地（例如 **/root/glusterfs-sc.yaml**）。Add-on 配置可以设置为：
```yaml
- addon
- name: glusterfs
  sources:
    yaml:
      path:
      - /root/glusterfs-sc.yaml
```

## OpenEBS/LocalVolumes
[OpenEBS](https://github.com/openebs/openebs) 动态本地 PV Provisioner 可以在节点上使用唯一的 HostPath（目录）来创建 Kubernetes 本地持久化存储卷，以持久存储数据。若用户没有专门的存储系统，可以用它方便地上手 KubeSphere。如果 **KubeKey** Add-on 的配置中**没有默认 StorageClass**，则会安装 OpenEBS/LocalVolumes。

## 多个存储
如果您想安装多个存储插件，请只将其中一个设置为默认，或者在 `ClusterConfiguration` 的 `spec.persistence.storageClass` 中设置您想让 KubeSphere 使用的 StorageClass 名称。否则，[ks-installer](https://github.com/kubesphere/ks-installer) 将不清楚使用哪一个 StorageClass。