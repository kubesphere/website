---
title: "在 Kubernetes 最小化安装 KubeSphere"
keywords: 'kubesphere, kubernetes, docker, multi-tenant'
description: '在 Kubernetes 最小化安装 KubeSphere'

linkTitle: "在 Kubernetes 最小化安装 KubeSphere"
weight: 3020
---

除了在 Linux 机器上安装 KubeSphere 之外，您还可以将其直接部署在现有的 Kubernetes 集群上。本快速入门指南将引导您完成在 Kubernetes 上最小化安装 KubeSphere 的一般步骤。有关更多信息，请参阅在 [Kubernetes 上安装](../../installing-on-kubernetes/)。

{{< notice note >}}

- Kubernetes 版本必须为 “1.15.x，1.16.x，1.17.x 或 1.18.x”；
- 确保您的计算机满足最低硬件要求：CPU > 1 核，内存 > 2 G；
- 在安装之前，需要配置 Kubernetes 集群中的默认存储类；
- 当使用 `--cluster-signing-cert-file` 和 `--cluster-signing-key-file` 参数启动时，在 kube-apiserver 中会激活 CSR 签名功能。 请参阅 [RKE 安装问题](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309)；
- 有关在 Kubernetes 上安装 KubeSphere 的前提条件的详细信息，请参阅[前提条件](../../installing-on-kubernetes/introduction/prerequisites/)。

{{</ notice >}}

## 部署 KubeSphere

确保您的计算机满足前提条件之后，您可以按照以下步骤安装 KubeSphere。

- 在执行命令开始安装之前，请阅读以下注释：

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

{{< notice note >}}

如果您的服务器无法访问 GitHub，则可以分别复制 [kubesphere-installer.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml) 和 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 中的内容并将其粘贴到本地文件中。然后，您可以对本地文件使用 `kubectl apply -f` 来安装 KubeSphere。

{{</ notice >}}

检查安装日志：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

- 使用 `kubectl get pod --all-namespaces` 查看所有 Pod 是否在 KubeSphere 的相关命名空间中正常运行。如果是，请通过以下命令检查控制台的端口（默认为 30880）：

```bash
kubectl get svc/ks-console -n kubesphere-system
```

- 确保在安全组中打开了端口 30880，并通过 NodePort（IP：30880）使用默认帐户和密码（admin/P@88w0rd）访问 Web 控制台。
- 登录控制台后，您可以在***组件***中检查不同组件的状态。如果要使用相关服务，可能需要等待某些组件启动并运行。

![components](/images/docs/quickstart/kubesphere-components-zh.png)

## 启用可插拔组件（可选）

上面的指南默认情况下仅用于最小化安装。要在 KubeSphere 中启用其他组件，请参阅[启用可插拔组件](../../pluggable-components/)以获取更多详细信息。

## 示例

<script src="https://asciinema.org/a/362121.js" id="asciicast-362121" async></script>
