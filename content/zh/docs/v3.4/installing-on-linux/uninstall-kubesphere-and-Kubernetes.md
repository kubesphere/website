---
title: "卸载 KubeSphere 和 Kubernetes"
keywords: 'kubernetes, kubesphere, 卸载, 移除集群'
description: '从机器上移除 KubeSphere 和 Kubernetes。'
linkTitle: "卸载 KubeSphere 和 Kubernetes"
weight: 3700
version: "v3.4"
---

卸载 KubeSphere 和 Kubernetes 意味着将其从您的机器上移除。该操作不可逆，且不会进行任何备份。请谨慎操作。

如需删除集群，请执行以下命令。

- 如果是按照快速入门 ([All-in-One](../../quick-start/all-in-one-on-linux/)) 安装的 KubeSphere：

    ```bash
    ./kk delete cluster
    ```

- 如果是使用高级模式安装的 KubeSphere（[使用配置文件创建](../introduction/multioverview/)）：

    ```bash
    ./kk delete cluster [-f config-sample.yaml]
    ```
