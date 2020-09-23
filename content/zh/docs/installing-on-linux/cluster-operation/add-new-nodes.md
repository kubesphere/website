---
title: "添加新节点"
keywords: 'kubernetes, kubesphere, scale, add-nodes'
description: 'How to add new nodes in an existing cluster'


weight: 2340
---

使用 KubeSphere 一段时间后，很可能需要随着工作负载的增加来扩展集群。 在这种情况下，KubeSphere 提供了将新节点添加到集群的脚本。 基本上，该操作基于 Kubelet 的注册机制，即新节点将自动加入现有的Kubernetes 集群。

{{< notice tip >}}

从 v3.0.0 起，全新的安装程序 [KubeKey](https://github.com/kubesphere/kubekey) 支持从一个单节点集群扩展主节点和工作节点。

{{</ notice >}}

### 步骤1：修改主机配置

KubeSphere 支持混合环境，即新添加的主机操作系统可以是 CentOS 或 Ubuntu 。 准备好新机器后，在文件`config-sample.yaml`的和`roleGroups`中添加有关新机器信息的配置。

{{< notice warning >}}
添加新节点时，不允许修改原始节点（例如 master1）的主机名。

{{</ notice >}}

例如，如果您使用 [all-in-one](../../quick-start/all-in-one-on-linux)  开始安装，并且想要为单节点集群添加新节点 ，您可以使用KubeKey创建配置文件。

```
# Assume your original Kubernetes cluster is v1.17.9
./kk create config --with-kubesphere --with-kubernetes v1.17.9
```

以下部分以“ root”用户为例，演示如何添加两个节点（即“ node1”和“ node2”），并假设第一台计算机的主机名是“ master1”（用您的主机名替换以下主机名） 。

```yaml
spec:
  hosts:
  - {name: master1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Qcloud@123}
  - {name: node1, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Qcloud@123}
  - {name: node2, address: 192.168.0.5, internalAddress: 192.168.0.5, user: root, password: Qcloud@123}
  roleGroups:
    etcd:
    - master1
    master:
    - master1
    worker:
    - node1
    - node2
···
```

### 步骤2：执行 Add-node 命令

执行以下命令以应用更改：

```bash
./kk add nodes -f config-sample.yaml
```

执行成功后，您将能够在 KubeSphere 控制台上查看新节点及其信息。 从左侧菜单中选择**节点管理 → 集群节点**，或者使用`kubectl get node`命令也可以看到更改。

```
kubectl get node
NAME          STATUS   ROLES           AGE   VERSION
master1       Ready    master,worker   20d   v1.17.9
node1         Ready    worker          31h   v1.17.9
node2         Ready    worker          31h   v1.17.9
```
