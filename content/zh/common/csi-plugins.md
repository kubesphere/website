---
_build:
    render: false
---

Kuberentes 此前已宣布将在 1.21 版本中移除树内 (in-tree) 存储插件。有关更多信息，请参见 [Kubernetes In-Tree to CSI Volume Migration Moves to Beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/)。因此，建议您安装 CSI 插件。

支持的 CSI 插件：

- [neonsan-csi](https://github.com/yunify/qingstor-csi)
- [qingcloud-csi](../../../installing-on-linux/persistent-storage-configurations/install-qingcloud-csi/)
- [ceph-csi](../../../installing-on-linux/persistent-storage-configurations/install-ceph-csi-rbd/)