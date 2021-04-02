---
title: "卸载 KubeSphere 和 Kubernetes"
keywords: 'kubernetes, kubesphere, uninstalling, remove-cluster'
description: '从机器上删除 KubeSphere 和 Kubernetes。'


weight: 3700
---

您可以通过以下命令删除集群。

{{< notice tip >}}

卸载将会从计算机中删除 KubeSphere 和 Kubernetes。此操作是不可逆的，没有任何自动备份，请谨慎操作。

{{</ notice >}}

- 如果是按照快速入门（[all-in-one](../../quick-start/all-in-one-on-linux/)）安装的集群，则可以用下面的命令直接删除：

    ```bash
    ./kk delete cluster
    ```

- 如果用高级模式安装的集群（[使用配置文件创建](../introduction/multioverview/)）：

    ```bash
    ./kk delete cluster [-f config-sample.yaml]
    ```
