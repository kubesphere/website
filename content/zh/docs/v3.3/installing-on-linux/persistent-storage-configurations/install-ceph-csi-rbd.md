---
title: "安装 Ceph"
keywords: 'KubeSphere, Kubernetes, Ceph, installation, configurations, storage'
description: 'How to create a KubeSphere cluster with Ceph providing storage services.'
linkTitle: "安装 Ceph"
weight: 3350
---

With a Ceph server, you can choose [Ceph RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) or [Ceph CSI](https://github.com/ceph/ceph-csi) as the underlying storage plugin. Ceph RBD is an in-tree storage plugin on Kubernetes, and Ceph CSI is a Container Storage Interface (CSI) driver for RBD, CephFS. 

###  Which plugin to select for Ceph 

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

####  Chart configurations

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

#### Add-on configurations

Save the above chart config and StorageClass locally (e.g. `/root/ceph-csi-rbd.yaml` and `/root/ceph-csi-rbd-sc.yaml`). The add-on configuration can be set like:

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

KubeKey will never use **hyperkube** images. Hence, in-tree Ceph RBD may not work on Kubernetes installed by KubeKey. However, if your Ceph cluster is lower than 14.0.0 which means Ceph CSI can't be used, [rbd provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/ceph/rbd) can be used as a substitute for Ceph RBD. Its format is the same with [in-tree Ceph RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd). 
The following is an example of KubeKey add-on configurations for rbd provisioner installed by **Helm Charts including a StorageClass**.

#### Chart configurations

```yaml
ceph:
  mon: "192.168.0.12:6789"    # <--ToBeReplaced-->
  adminKey: "QVFBS1JkdGRvV0lySUJBQW5LaVpSKzBRY2tjWmd6UzRJdndmQ2c9PQ=="   # <--ToBeReplaced-->
  userKey: "QVFBS1JkdGRvV0lySUJBQW5LaVpSKzBRY2tjWmd6UzRJdndmQ2c9PQ=="    # <--ToBeReplaced-->
sc:
  isDefault: false
```

If you want to configure more values, see [chart configuration for rbd-provisioner](https://github.com/kubesphere/helm-charts/tree/master/src/test/rbd-provisioner#configuration).

#### Add-on configurations

Save the above chart config locally (e.g. `/root/rbd-provisioner.yaml`). The add-on config for rbd provisioner cloud be like: 

```yaml
- name: rbd-provisioner
  namespace: kube-system
  sources:
    chart:
      name: rbd-provisioner
      repo: https://charts.kubesphere.io/test
      valuesFile: /root/rbd-provisioner.yaml
```
