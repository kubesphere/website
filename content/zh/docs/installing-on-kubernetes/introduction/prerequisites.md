---
title: "先决条件"
keywords: "KubeSphere, Kubernetes, 安装, 先决条件"
description: "在现有Kubernetes上安装KubeSphere的先决条件"

linkTitle: "准备工作"
weight: 4120
---



只要您的 Kubernetes 集群满足以下先决条件，不仅可以将 KubeSphere 安装在具有预配置的 Kubernetes 的虚拟机和裸机上，而且还支持在云托管和本地现有 Kubernetes 群集上进行安装。

- Kubernetes 版本:  `1.15.x, 1.16.x, 1.17.x, 1.18.x`。
- 可用 CPU > 1 核; 内存 > 2 G。
- Kubernetes 集群已配置***默认***存储类型（StorageClass）; 请使用 `kubectl get sc` 命令进行确认。
- 当使用 `--cluster-signing-cert-file` 和 `--cluster-signing-key-file` 参数启动集群时，kube-apiserver 将启用 CSR 签名功能。请参阅 [RKE 安装问题](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309)。

## 预检查

1. 通过在集群节点中运行 `kubectl version`，确保您的 Kubernetes 版本在 KuberSphere 兼容范围内。输出类似如下所示：

    ```bash
    $ kubectl version
    Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
    Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
    ```

    {{< notice note >}}
注意 `Server Version` 行，如果 GitVersion 显示的是旧版本，则需要先升级 Kubernetes，请参阅[将 kubeadm 集群从 v1.14 升级到 v1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)。
    {{</ notice >}}

2. 检查集群中的可用资源是否满足最低要求。

    ```bash
    $ free -g
                total        used        free      shared  buff/cache   available
    Mem:              16          4          10           0           3           2
    Swap:             0           0           0
    ```

3. 检查集群中是否有***默认***的存储类，准备就绪的默认存储类是 KubeSphere 安装的先决条件。

    ```bash
    $ kubectl get sc
    NAME                      PROVISIONER               AGE
    glusterfs (default)       kubernetes.io/glusterfs   3d4h
    ```

如果您的 Kubernetes 集群环境满足上述所有要求，那么您就可以在现有 Kubernetes 集群上部署 KubeSphere 了。

有关更多信息，请参见[概述](../overview/)。
