---
title: "使用 KubeKey 升级"
keywords: "Kubernetes, 升级, KubeSphere, v3.0.0, KubeKey"
description: "使用 KubeKey 升级 KubeSphere"
linkTitle: "使用 KubeKey 升级"
weight: 7200
---

对于 KubeSphere 和 Kubernetes 都是通过 [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/zh-CN/installation/all-in-one/#第二步-准备安装包) 部署的用户，推荐使用 KubeKey 升级。如果您的 Kubernetes 集群由云厂商托管或自行配置，请参考[使用 ks-installer 升级](../upgrade-with-ks-installer)。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/docs-v3.0/%E5%AE%89%E8%A3%85%E4%B8%8E%E9%83%A8%E7%BD%B2_7_%E4%BB%8E%20KubeSphere%202.x%20%E5%8D%87%E7%BA%A7%E5%88%B0%203.0.mp4">
</video>

## 准备工作

- 您需要有一个运行在 v2.1.1 版本的 KubeSphere 集群。如果您的 KubeSphere 是 v2.1.0 或更早的版本，请先升级至 v2.1.1。

- 您已经下载 KubeKey。若未下载，请先按照下面的步骤下载 KubeKey。

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub 发布页面](https://github.com/kubesphere/kubekey/releases)下载 KubeKey 或直接使用以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

先执行以下命令以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

执行以下命令下载 KubeKey。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{< notice note >}}

下载 KubeKey 后，如果您将其传至新的机器，且访问 Googleapis 同样受限，请您在执行以下步骤之前务必再次执行 `export KKZONE=cn` 命令。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

执行以上命令会下载最新版 KubeKey (v1.0.1)，您可以修改命令中的版本号下载指定版本。

{{</ notice >}} 

为 `kk` 添加可执行权限：

```bash
chmod +x kk
```

- 请仔细阅读 [v3.0.0 发布说明](../../release/release-v300/)。

{{< notice warning >}}

在 v3.0.0 版本中，KubeSphere 重构了许多组件，例如 Fluent Bit Operator 和 IAM。如果您的这些组件有深度自定义配置（并非通过 KubeSphere 控制台配置），请务必先备份重要组件。

{{</ notice >}}

- 制定您的升级计划，下面提供了两种升级场景。

## 升级 KubeSphere 和 Kubernetes

单节点集群 (All-in-One) 和多节点集群的升级步骤不同。

{{< notice info >}}

- 升级 Kubernetes 将使 Helm 从 v2 升级到 v3。如果您想继续使用 Helm2，请先备份它：`cp /usr/local/bin/helm /usr/local/bin/helm2`。
- 当升级 Kubernetes 时，KubeKey 将从一个小版本升级到下一个小版本，直到目标版本。例如，您会发现升级过程是从 1.16 先升级到 1.17 然后再升级到 1.18，而不是直接从 1.16 升级到 1.18。
{{</ notice >}}

### All-in-One 集群

运行下面的命令使用 KubeKey 将您的单节点集群升级至 KubeSphere v3.0.0 和 Kubernetes v1.17.9（默认）：

```bash
./kk upgrade --with-kubernetes v1.17.9 --with-kubesphere v3.0.0
```

要将 Kubernetes 升级至特定版本，可以在 `--with-kubernetes` 标志后明确指定版本号。以下是可用版本：

- v1.15.12
- v1.16.8、v1.16.10、v1.16.12、v1.16.13
- v1.17.0、v1.17.4、v1.17.5、v1.17.6、v1.17.7、v1.17.8、v1.17.9
- v1.18.3、v1.18.5、v1.18.6

### 多节点集群

#### 步骤 1：使用 KubeKey 生成配置文件

运行下面的命令会基于您的集群创建一个 `sample.yaml` 配置文件。

```bash
./kk create config --from-cluster
```

{{< notice note >}}

假设您的 kubeconfig 位于 `~/.kube/config`。您可以通过 `--kubeconfig` 标志进行修改。

{{</ notice >}}

#### 步骤 2：修改配置文件模板

根据您的集群配置修改 `sample.yaml` 文件，请确保正确修改以下字段。

- `hosts`：输入主机之间的连接信息。
- `roleGroups.etcd`：输入 etcd 节点。
- `controlPlaneEndpoint`：输入负载均衡器地址（可选）。
- `registry`：输入镜像仓库信息（可选）。

{{< notice note >}}

有关更多信息，请参见[编辑配置文件](https://kubesphere.io/zh/docs/installing-on-linux/introduction/multioverview/#2-编辑配置文件)，或参考[完整配置文件](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)中的 `Cluster` 部分获取更多信息。

{{</ notice >}}

#### 步骤 3：升级集群

运行下面的命令，将您的集群升级至 KubeSphere v3.0.0 和 Kubernetes v1.17.9（默认）：

```bash
./kk upgrade --with-kubernetes v1.17.9 --with-kubesphere v3.0.0 -f config-sample.yaml
```

要将 Kubernetes 升级至特定版本，可以在 `--with-kubernetes` 标志后明确指定版本号。以下是可用版本：

- v1.15.12
- v1.16.8、v1.16.10、v1.16.12、v1.16.13
- v1.17.0、v1.17.4、v1.17.5、v1.17.6、v1.17.7、v1.17.8、v1.17.9
- v1.18.3、v1.18.5、v1.18.6
