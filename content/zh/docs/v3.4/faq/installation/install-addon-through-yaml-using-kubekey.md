---
title: "使用 KubeKey 通过 YAML 安装插件"
keywords: "Installer, KubeKey, KubeSphere, Kubernetes, 插件"
description: "了解使用 KubeKey 安装 YAML 插件时可能失败的原因。"
linkTitle: "使用 KubeKey 通过 YAML 安装插件"
Weight: 16400
version: "v3.4"
---

当您使用 KubeKey 安装插件时，需要在配置文件（默认为 `config-sample.yaml`）的 `addons` 字段下添加插件信息（Chart 或 YAML）。如果所提供的插件以 YAML 格式安装，在某些情况下，安装时可能会报如下错误信息：

```bash
Error from server: failed to create typed patch object: xxx: element 0: associative list with keys has an element that omits key field "protocol"
```

这是一个 [Kubernetes 本身的已知问题](https://github.com/kubernetes-sigs/structured-merge-diff/issues/130)，由 `--server-side` 标志导致。若要解决该问题，请在部署完 KubeSphere 之后再应用该 YAML 文件，而非在配置文件中添加插件信息通过 KubeKey 安装。例如：

```bash
kubectl apply -f xxx.yaml # 请替换为您自己的 YAML 文件。
```