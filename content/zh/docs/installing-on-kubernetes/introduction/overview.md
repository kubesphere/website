---
title: "概述"
keywords: "KubeSphere, Kubernetes, 安装"
description: "在已有 Kubernetes 集群上部署 KubeSphere 的一般步骤"

linkTitle: "概述"
weight: 2105
---

![KubeSphere+K8s](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

作为 KubeSphere 为用户提供即插即用架构承诺的一部分，您可以轻松地将 KubeSphere 安装在现有的 Kubernetes 集群上。更具体地说，KubeSphere 可以部署在托管在云上（例如 AWS EKS，QingCloud QKE 和 Google GKE 等）或本地上的 Kubernetes 中。KubeSphere 不会对已有 Kubernetes 集群进行任何侵入性修改，它仅与 Kubernetes API 交互以管理 Kubernetes 集群资源。换句话说，KubeSphere 可以安装在任何本地 Kubernetes 集群或 Kubernetes 发行版上。

本节描述了在 Kubernetes 上安装 KubeSphere 的一般步骤。有关在不同环境中的特定安装方式的更多信息，请参阅在托管 Kubernetes 上安装和在本地 Kubernetes 上安装。

{{< notice note >}}

在现有 Kubernetes 群集上安装 KubeSphere 之前，请阅读需要[准备的工作](../prerequisites/)。

{{</ notice >}}

## 部署 KubeSphere

确保现有的 Kubernetes 群集满足所有要求之后，可以使用 kubectl 执行 KubeSphere 的默认最小安装。

- 执行以下命令以开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
    ```

- 检查安装日志：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

- 使用 `kubectl get pod --all-namespaces`，查看所有 Pod 在 KubeSphere 相关的命名空间运行是否正常。如果是，请通过以下命令检查控制台的端口（默认为 30880）：

    ```bash
    kubectl get svc/ks-console -n kubesphere-system
    ```

- 确保在安全组中打开了 30880 端口，并使用（`IP:30880`）以及默认帐户和密码（`admin/P@88w0rd`）通过 NodePort 访问 Web 控制台。

    ![kubesphere-console](/images/docs/zh-cn/installing-on-kubernetes/introduction/login.png)

## 启用可插拔组件（可选）

如果从默认的最小安装开始，请参阅[启用可插拔组件](../../../pluggable-components/)安装其他组件。

{{< notice tip >}}

- 您可以在执行 KuberSphere 安装之前或之后启用可插拔组件。请参阅示例文件 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml) 获取更多的详细信息。
- 请确保集群中的节点有足够的 CPU 和内存。
- 强烈建议安装这些可插拔组件，以体验 KubeSphere 提供的全栈功能。

{{</ notice >}}
