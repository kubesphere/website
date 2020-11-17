---
title: "卸载 KubeSphere 和 Kubernetes"
keywords: 'kubernetes, kubesphere, uninstalling, remove-cluster'
description: 'How to uninstall KubeSphere and kubernetes'


weight: 2451
---

您可以通过以下命令删除集群。

{{< notice tip >}}

卸载将会从计算机中删除 KubeSphere 和 Kubernetes。 此操作是不可逆的，没有任何备份。 请谨慎操作。

{{</ notice >}}

- 如果您以快速入门 ( all-in-one )开始：

```
./kk delete cluster
```

- 如果从高级模式开始（使用配置文件创建）：

```
./kk delete cluster [-f config-sample.yaml]
```
