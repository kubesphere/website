---
title: "使用 KubeKey 升级"
keywords: "Kubernetes, 升级, KubeSphere, 3.3.0, KubeKey"
description: "使用 KubeKey 升级 Kubernetes 和 KubeSphere。"
linkTitle: "使用 KubeKey 升级"
weight: 7200
---

对于 KubeSphere 和 Kubernetes 都由 [KubeKey](../../installing-on-linux/introduction/kubekey/) 部署的用户，推荐使用 KubeKey 升级。如果您的 Kubernetes 集群由云厂商托管或自行配置，请参考[使用 ks-installer 升级](../upgrade-with-ks-installer/)。

本教程演示如何使用 KubeKey 升级集群。


## 准备工作

- 您需要有一个运行 KubeSphere v3.2.x 的集群。如果您的 KubeSphere 是 v3.1.0 或更早的版本，请先升级至 v3.2.x。
- 请仔细阅读 [3.3.0 版本说明](../../../v3.3/release/release-v330/)。
- 提前备份所有重要的组件。
- 确定您的升级方案。本文档中提供 [All-in-One 集群](#all-in-one-集群)和[多节点集群](#多节点集群)的两种升级场景。

## 下载 KubeKey

升级集群前执行以下命令下载 KubeKey。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub 发布页面](https://github.com/kubesphere/kubekey/releases)下载 KubeKey 或直接使用以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

先执行以下命令以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

执行以下命令下载 KubeKey。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

下载 KubeKey 后，如果您将其传至新的机器，且访问 Googleapis 同样受限，请您在执行以下步骤之前务必再次执行 `export KKZONE=cn` 命令。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

执行以上命令会下载最新版 KubeKey (v2.2.2)，您可以修改命令中的版本号以下载指定版本。

{{</ notice >}} 

为 `kk` 添加可执行权限：

```bash
chmod +x kk
```

## 升级 KubeSphere 和 Kubernetes

单节点集群 (All-in-One) 和多节点集群的升级步骤不同。

{{< notice info >}}

当升级 Kubernetes 时，KubeKey 将从一个小版本升级到下一个小版本，直到目标版本。例如，您会发现升级过程先从 1.16 先升级到 1.17 然后再升级到 1.18，而不是直接从 1.16 升级到 1.18。
{{</ notice >}}

### All-in-One 集群

运行以下命令使用 KubeKey 将您的单节点集群升级至 KubeSphere 3.3.0 和 Kubernetes v1.22.10：

```bash
./kk upgrade --with-kubernetes v1.22.10 --with-kubesphere v3.3.0
```

要将 Kubernetes 升级至特定版本，请在 `--with-kubernetes` 标志后明确指定版本号。以下是可用版本：v1.19.x、v1.20.x、v1.21.x、v1.22.x 和 v1.23.x（实验性支持）。

### 多节点集群

#### 步骤 1：使用 KubeKey 生成配置文件

运行以下命令会基于您的集群创建一个 `sample.yaml` 配置文件。

```bash
./kk create config --from-cluster
```

{{< notice note >}}

假设您的 kubeconfig 位于 `~/.kube/config`。您可以通过 `--kubeconfig` 标志进行修改。

{{</ notice >}}

#### 步骤 2：修改配置文件模板

根据您的集群配置修改 `sample.yaml` 文件，请确保正确修改以下字段。

- `hosts`：您主机的基本信息（主机名和 IP 地址）以及使用 SSH 连接至主机的信息。
- `roleGroups.etcd`：etcd 节点。
- `controlPlaneEndpoint`：负载均衡器地址（可选）。
- `registry`：镜像服务信息（可选）。

{{< notice note >}}

有关更多信息，请参见[编辑配置文件](../../installing-on-linux/introduction/multioverview/#2-编辑配置文件)，或参考[完整配置文件](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md)中的 `Cluster` 部分获取更多信息。

{{</ notice >}}

#### 步骤 3：升级集群

运行以下命令，将您的集群升级至 KubeSphere 3.3.0 和 Kubernetes v1.22.10：

```bash
./kk upgrade --with-kubernetes v1.22.10 --with-kubesphere v3.3.0 -f sample.yaml
```

要将 Kubernetes 升级至特定版本，请在 `--with-kubernetes` 标志后明确指定版本号。以下是可用版本：v1.19.x、v1.20.x、v1.21.x、v1.22.x 和 v1.23.x（实验性支持）。

{{< notice note >}}

若要使用 KubeSphere 3.3.0 的新功能，您需要在升级后启用对应的可插拔组件。

{{</ notice >}} 