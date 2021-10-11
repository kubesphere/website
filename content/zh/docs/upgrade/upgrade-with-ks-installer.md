---
title: "使用 ks-installer 升级"
keywords: "kubernetes, 升级, kubesphere, v3.2.0"
description: "使用 ks-installer 升级 KubeSphere。"
linkTitle: "使用 ks-installer 升级"
weight: 7300
---

对于 Kubernetes 集群不是通过 [KubeKey](../../installing-on-linux/introduction/kubekey/) 部署而是由云厂商托管或自行搭建的用户，推荐使用 ks-installer 升级。本教程**仅用于升级 KubeSphere**。集群运维员应负责提前升级 Kubernetes。

## 准备工作

- 您需要有一个运行 KubeSphere v3.1.x 的集群。如果您的 KubeSphere 是 v3.0.0 或更早的版本，请先升级至 v3.1.x。
- 请仔细阅读 [Release Notes for 3.1.1](../../release/release-v311/)。
- 提前备份所有重要的组件。
- KubeSphere v3.2.0 支持的 Kubernetes 版本：v1.17.x、v1.18.x、v1.19.x、v1.20.x 和 v1.21.x。

## 应用 ks-installer

运行以下命令升级集群：

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.1.1/kubesphere-installer.yaml
```

## 启用可插拔组件

您可以在升级后启用 KubeSphere v3.2.0 的[可插拔组件](../../pluggable-components/overview/)以体验该容器平台的更多功能。