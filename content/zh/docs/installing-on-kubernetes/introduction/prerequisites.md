---
title: "先决条件"
keywords: "KubeSphere, Kubernetes, 安装, 先决条件"
description: "在现有Kubernetes上安装KubeSphere的先决条件"

linkTitle: "准备工作"
weight: 2125
---



只要您的Kubernetes集群满足以下先决条件，不仅可以将KubeSphere安装在具有预配置的Kubernetes的虚拟机和裸机上，而且还支持在云托管和本地现有Kubernetes群集上进行安装。

- Kubernetes版本:  `1.15.x, 1.16.x, 1.17.x, 1.18.x`;
- CPU > 1 核; 内存 > 2 G;
- Kubernetes集群中的默认存储类型（StorageClass）已配置; 请使用`kubectl get sc`命令进行确认。
- 当使用`--cluster-signing-cert-file`和`--cluster-signing-key-file`参数启动集群时，kube-apiserver将启用CSR签名功能。请参阅[RKE安装问题](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309)。

## 预检查

1. 通过在集群节点中运行`kubectl version`，确保您的Kubernetes版本在KuberSphere兼容范围内。输出可能如下所示：

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
```

{{< notice note >}}

注意`Server Version`行。如果GitVersion显示的是旧版本，则需要先升级Kubernetes。请参阅[将kubeadm集群从v1.14升级到v1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)

{{</ notice >}} 

2. 检查集群中的可用资源是否满足最低要求。

```bash
$ free -g
              total        used        free      shared  buff/cache   available
Mem:              16          4          10           0           3           2
Swap:             0           0           0
```

3. 检查集群中是否有默认的存储类。准备就绪的存储类是KubeSphere安装的先决条件。

```bash
$ kubectl get sc
NAME                      PROVISIONER               AGE
glusterfs (default)       kubernetes.io/glusterfs   3d4h
```

如果您的Kubernetes集群环境满足上述所有要求，那么您就可以在现有Kubernetes集群上部署KubeSphere了。

有关更多信息，请参见[概述](../overview/)。