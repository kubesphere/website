---
_build:
    render: false
---

Kubernetes has announced that in-tree volume plugins will be removed from Kubernetes in version 1.21. For more information, see [Kubernetes In-Tree to CSI Volume Migration Moves to Beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/). Therefore, it is recommended that you install CSI plugins instead.

Supported CSI plugins:

- [neonsan-csi](https://github.com/yunify/qingstor-csi)
- [qingcloud-csi](../../../installing-on-linux/persistent-storage-configurations/install-qingcloud-csi/)
- [ceph-csi](../../../installing-on-linux/persistent-storage-configurations/install-ceph-csi-rbd/)