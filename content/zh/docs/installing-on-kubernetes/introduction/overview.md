---
title: "概述"
keywords: "KubeSphere, Kubernetes, 安装"
description: "Kubernetes 部署 KubeSphere概述"

linkTitle: "概述"
weight: 2105
---

![KubeSphere+K8s](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

作为KubeSphere为用户提供即插即用架构承诺的一部分，您可以轻松地将KubeSphere安装在现有的Kubernetes集群上。更具体地说，KubeSphere可以部署在托管在云上（例如AWS EKS，QingCloud QKE和Google GKE）或本地上的Kubernetes中。KubeSphere不会对已有Kubernetes集群进行任何侵入性修改，它仅与Kubernetes API交互以管理Kubernetes集群资源。换句话说，KubeSphere可以安装在任何本地Kubernetes集群或Kubernetes发行版上。

本节描述了在Kubernetes上安装KubeSphere的一般步骤。有关在不同环境中的特定安装方式的更多信息，请参阅在托管Kubernetes上安装和在本地Kubernetes上安装。

{{< notice note >}} 

在现有Kubernetes群集上安装KubeSphere之前，请阅读先决条件。

{{</ notice >}}

## 部署 KubeSphere

确保现有的Kubernetes群集满足所有要求之后，可以使用kubectl执行KubeSphere的默认最小安装。

- 执行以下命令以开始安装：

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

{{< notice note >}} 

如果您的服务器无法访问GitHub，则可以分别复制[kubesphere-installer.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml)和[cluster-configuration.yaml中](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml)的内容并将其[粘贴](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml)到本地文件中。然后，您可以使用`kubectl apply -f` 执行本地文件来安装KubeSphere。

{{</ notice >}}

- 检查安装日志：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

- 使用`kubectl get pod --all-namespaces`，查看所有pod在KubeSphere相关的命名空间运行是否正常。如果是，请通过以下命令检查控制台的端口（默认为30880）：

```bash
kubectl get svc/ks-console -n kubesphere-system
```

- 确保在安全组中打开了30880端口，并使用（`IP:30880`）以及默认帐户和密码（`admin/P@88w0rd`）通过NodePort访问Web控制台。

![kubesphere-console](/images/docs/zh-cn/installing-on-kubernetes/introduction/login.png)

## 启用可插拔组件（可选）

如果从默认的最小安装开始，请参阅[启用可插拔组件](../../../pluggable-components/)以安装其他组件。

{{< notice tip >}}

- 您可以在执行KuberSphere安装之前或之后启用可插拔组件。请参阅示例文件[cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml)以获取更多详细信息。
- 请确保集群中的节点有足够的CPU和内存。
- 强烈建议您安装这些可插拔组件，以体验KubeSphere提供的全栈功能。

{{</ notice >}}


