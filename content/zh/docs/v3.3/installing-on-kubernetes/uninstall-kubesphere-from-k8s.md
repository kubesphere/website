---
title: "从 Kubernetes 上卸载 KubeSphere"
keywords: 'Kubernetes, KubeSphere, 卸载, 移除集群'
description: '从 Kubernetes 集群中删除 KubeSphere。'
LinkTitle: "从 Kubernetes 上卸载 KubeSphere"
weight: 4400
---

您可以使用 [kubesphere-delete.sh](https://github.com/kubesphere/ks-installer/blob/release-3.1/scripts/kubesphere-delete.sh) 将 KubeSphere 从您现有的 Kubernetes 集群中卸载。复制 [GitHub 源文件](https://raw.githubusercontent.com/kubesphere/ks-installer/release-3.1/scripts/kubesphere-delete.sh)并在本地机器上执行此脚本。

{{< notice warning >}}

卸载意味着 KubeSphere 会从您的 Kubernetes 集群中移除。此操作不可逆并且没有任何备份，请谨慎操作。

{{</ notice >}}