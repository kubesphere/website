---
title: "在 Kubernetes 上最小化安装 KubeSphere"
keywords: 'KubeSphere, Kubernetes, 最小化安装'
description: '在已有 Kubernetes 集群上安装最小化 KubeSphere'
linkTitle: "在 Kubernetes 上最小化安装 KubeSphere"
weight: 2200
---

除了在 Linux 机器上安装 KubeSphere 之外，您还可以将其直接部署在现有的 Kubernetes 集群上。本快速入门指南将引导您完成在 Kubernetes 上最小化安装 KubeSphere 的一般性步骤。有关更多信息，请参见[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/)。

{{< notice note >}}

- 支持的 Kubernetes 版本：1.15.x、1.16.x、1.17.x 或 1.18.x；
- 确保您的机器满足最低硬件要求：CPU > 1 核，内存 > 2 G；
- 在安装之前，需要配置 Kubernetes 集群中的**默认**存储类型；
- 当使用 `--cluster-signing-cert-file` 和 `--cluster-signing-key-file` 参数启动时，在 `kube-apiserver` 中会激活 CSR 签名功能。请参见 [RKE 安装问题](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309)；
- 有关在 Kubernetes 上安装 KubeSphere 的准备工作，请参见[准备工作](../../installing-on-kubernetes/introduction/prerequisites/)。

{{</ notice >}}

## 部署 KubeSphere

确保您的机器满足安装的前提条件之后，可以按照以下步骤安装 KubeSphere。

1. 执行以下命令：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
    
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
    ```

2. 检查安装日志：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

3. 使用 `kubectl get pod --all-namespaces` 查看所有 Pod 是否在 KubeSphere 的相关命名空间中正常运行。如果是，请通过以下命令检查控制台的端口（默认为 `30880`）：

    ```bash
    kubectl get svc/ks-console -n kubesphere-system
    ```

4. 确保在安全组中打开了端口 `30880`，并通过 NodePort `(IP:30880)` 使用默认帐户和密码 `(admin/P@88w0rd)` 访问 Web 控制台。

5. 登录控制台后，您可以在**服务组件**中检查不同组件的状态。如果要使用相关服务，可能需要等待某些组件启动并运行。

    ![KubeSphere 组件](/images/docs/zh-cn/quickstart/minimal-kubesphere-on-k8s/kubesphere-components-zh.png)

## 启用可插拔组件（可选）

本指南仅适用于默认的最小化安装。若要在 KubeSphere 中启用其他组件，请参见[启用可插拔组件](../../pluggable-components/)。

## 代码演示

<script src="https://asciinema.org/a/362121.js" id="asciicast-362121" async></script>
