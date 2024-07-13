---
title: "安装 Ceph"
keywords: 'Kubesphere，Kubernetes，Ceph，安装，配置，存储'
description: '如何创建一个使用 Ceph 提供存储服务的 KubeSphere 集群。'
linkTitle: "安装 Ceph"
weight: 3350
version: "v3.4"
---

您可以选择 [Ceph RBD](https://kubernetes.io/zh/docs/concepts/storage/storage-classes/#ceph-rbd) 或 [Ceph CSI ](https://github.com/ceph/ceph-csi) 作为 Ceph 服务器的底层存储插件。Ceph RBD 是 Kubernetes 上的一个树内存储插件，Ceph 容器存储接口（CSI）是一个用于 RBD 和 CephFS 的驱动程序。

### Ceph 插件

如果你安装的是 Ceph v14.0.0（Nautilus）及以上版本，那么推荐您使用 Ceph CSI RBD。原因如下：

- 树内存储插件将会被弃用。
- Ceph RBD 只适用于使用 hyperkube 镜像的 Kubernetes 集群，而 hyperkube 镜像
 [从 Kubernetes 1.17 开始已被弃用](https://github.com/kubernetes/kubernetes/pull/85094)。
- Ceph CSI 功能更丰富，如克隆，扩容和快照。

### Ceph CSI RBD

您需要安装 Kubernetes（v1.14.0 及以上版本）和 Ceph v14.0.0（Nautilus）及以上版本。有关兼容性的详细信息，请参见 [Ceph CSI 支持矩阵](https://github.com/ceph/ceph-csi#support-matrix)。

以下是 Helm Charts 安装的 Ceph CSI RBD 的 KubeKey 插件配置示例。由于 StorageClass 不包含在 chart 中，因此需要在插件中配置 StorageClass。

#### Chart 配置

```yaml
csiConfig:
  - clusterID: "cluster1"
    monitors:
      - "192.168.0.8:6789"     # <--TobeReplaced-->
      - "192.168.0.9:6789"     # <--TobeReplaced-->
      - "192.168.0.10:6789"    # <--TobeReplaced-->
```

如果你想配置更多的参数，请参见 [ceph-csi-rbd 的 chart 配置](https://github.com/ceph/ceph-csi/tree/master/charts/ceph-csi-rbd)。

#### StorageClass 配置（包含保密字典）

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: csi-rbd-secret
  namespace: kube-system
stringData:
  userID: admin
  userKey: "AQDoECFfYD3DGBAAm6CPhFS8TQ0Hn0aslTlovw=="    # <--ToBeReplaced-->
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

#### 插件配置

将上面的 chart 配置和 StorageClass 保存到本地（例如 `/root/ceph-csi-rbd.yaml` 和 `/root/ceph-csi-rbd-sc.yaml`）。插件配置如下所示:

```yaml
addons: 
- name: ceph-csi-rbd
  namespace: kube-system
  sources:
    chart:
      name: ceph-csi-rbd
      repo: https://ceph.github.io/csi-charts
      valuesFile: /root/ceph-csi-rbd.yaml
- name: ceph-csi-rbd-sc
  sources:
    yaml:
      path:
      - /root/ceph-csi-rbd-sc.yaml
```

### Ceph RBD

Kubekey 没有使用 hyperkube 镜像。因此，树内 Ceph RBD 可能无法在使用 KubeKey 安装的 Kubernetes 上工作。如果你的 Ceph 集群版本低于 14.0.0，Ceph CSI 将不能使用，但是由于 [RBD](https://github.com/kubernetes-incubator/external-storage/tree/master/ceph/rbd) 格式和 Ceph RBD 相同，可以作为 Ceph RBD 的替代选项。下面是由 Helm Charts 安装的 RBD Provisioner 的 KubeKey 插件配置示例，其中包括 StorageClass。

#### Chart 配置

```yaml
ceph:
  mon: "192.168.0.12:6789"    # <--ToBeReplaced-->
  adminKey: "QVFBS1JkdGRvV0lySUJBQW5LaVpSKzBRY2tjWmd6UzRJdndmQ2c9PQ=="   # <--ToBeReplaced-->
  userKey: "QVFBS1JkdGRvV0lySUJBQW5LaVpSKzBRY2tjWmd6UzRJdndmQ2c9PQ=="    # <--ToBeReplaced-->
sc:
  isDefault: false
```

如果你想配置更多的参数，请参见 [RBD-Provisioner 的 chart 配置](https://github.com/kubesphere/helm-charts/tree/master/src/test/rbd-provisioner#configuration)。

#### 插件配置

将上面的 chart 配置保存到本地（例如 `/root/rbd-provisioner.yaml`）。RBD Provisioner Cloud 的插件配置如下所示:

```yaml
- name: rbd-provisioner
  namespace: kube-system
  sources:
    chart:
      name: rbd-provisioner
      repo: https://charts.kubesphere.io/test
      valuesFile: /root/rbd-provisioner.yaml
```

