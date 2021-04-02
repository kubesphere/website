---
title: "准备工作"
keywords: "KubeSphere, Kubernetes, 安装, 准备工作"
description: "确保现有 Kubernetes 集群运行所在的环境满足部署 KubeSphere 的前提条件。"
linkTitle: "准备工作"
weight: 4120
---



您可以在虚拟机和裸机上安装 KubeSphere，并同时配置 Kubernetes。另外，只要 Kubernetes 集群满足以下前提条件，那么您也可以在云托管和本地 Kubernetes 集群上部署 KubeSphere。

- Kubernetes 版本：`1.15.x，1.16.x，1.17.x，1.18.x`。
- 可用 CPU > 1 核；内存 > 2 G。
- Kubernetes 集群已配置**默认** StorageClass（请使用 `kubectl get sc` 进行确认）。
- 使用 `--cluster-signing-cert-file` 和 `--cluster-signing-key-file` 参数启动集群时，kube-apiserver 将启用 CSR 签名功能。请参见 [RKE 安装问题](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309)。

## 预检查

1. 在集群节点中运行 `kubectl version`，确保 Kubernetes 版本可兼容。输出如下所示：

    ```bash
    $ kubectl version
    Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
    Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
    ```

    {{< notice note >}}
请注意 `Server Version` 这一行。如果 `GitVersion` 显示为旧版本，则需要先升级 Kubernetes。
    {{</ notice >}}

2. 检查集群中的可用资源是否满足最低要求。

    ```bash
    $ free -g
                total        used        free      shared  buff/cache   available
    Mem:              16          4          10           0           3           2
    Swap:             0           0           0
    ```

3. 检查集群中是否有**默认** StorageClass（准备默认 StorageClass 是安装 KubeSphere 的前提条件）。

    ```bash
    $ kubectl get sc
    NAME                      PROVISIONER               AGE
    glusterfs (default)       kubernetes.io/glusterfs   3d4h
    ```

如果 Kubernetes 集群环境满足上述所有要求，那么您就可以在现有的 Kubernetes 集群上部署 KubeSphere 了。

有关更多信息，请参见[概述](../overview/)。
