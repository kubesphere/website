---
title: "准备工作"
keywords: "KubeSphere, Kubernetes, 安装, 准备工作"
description: "确保现有 Kubernetes 集群运行所在的环境满足部署 KubeSphere 的前提条件。"
linkTitle: "准备工作"
weight: 4120
---



您可以在虚拟机和裸机上安装 KubeSphere，并同时配置 Kubernetes。另外，只要 Kubernetes 集群满足以下前提条件，那么您也可以在云托管和本地 Kubernetes 集群上部署 KubeSphere。

- 如需在 Kubernetes 上安装 KubeSphere 3.3，您的 Kubernetes 版本必须为：v1.19.x，v1.20.x，v1.21.x，v1.22.x 或 v1.23.x（实验性支持）。
- 可用 CPU > 1 核；内存 > 2 G。CPU 必须为 x86_64，暂时不支持 Arm 架构的 CPU。
- Kubernetes 集群已配置**默认** StorageClass（请使用 `kubectl get sc` 进行确认）。
- 使用 `--cluster-signing-cert-file` 和 `--cluster-signing-key-file` 参数启动集群时，kube-apiserver 将启用 CSR 签名功能。请参见 [RKE 安装问题](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309)。

## 预检查

1. 在集群节点中运行 `kubectl version`，确保 Kubernetes 版本可兼容。输出如下所示：

    ```bash
    $ kubectl version
    Client Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.8", GitCommit:"fd5d41537aee486160ad9b5356a9d82363273721", GitTreeState:"clean", BuildDate:"2021-02-17T12:41:51Z", GoVersion:"go1.15.8", Compiler:"gc", Platform:"linux/amd64"}
    Server Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.8", GitCommit:"fd5d41537aee486160ad9b5356a9d82363273721", GitTreeState:"clean", BuildDate:"2021-02-17T12:33:08Z", GoVersion:"go1.15.8", Compiler:"gc", Platform:"linux/amd64"}
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
