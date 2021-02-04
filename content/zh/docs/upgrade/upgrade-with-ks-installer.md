---
title: "使用 ks-installer 升级"
keywords: "kubernetes, 升级, kubesphere, v3.0.0"
description: "使用 ks-installer 升级 KubeSphere"
linkTitle: "使用 ks-installer 升级"
weight: 7300
---

对于 Kubernetes 集群不是通过 [KubeSphere Installer](https://v2-1.docs.kubesphere.io/docs/zh-CN/installation/all-in-one/#第二步-准备安装包) 部署而是由云厂商托管的用户，推荐使用 ks-installer 升级。本教程**只用于升级 KubeSphere**。集群运维员应负责提前升级 Kubernetes。

## 准备工作

- 您需要有一个运行在 v2.1.1 版本的 KubeSphere 集群。如果您的 KubeSphere 是 v2.1.0 或更早的版本，请先升级至 v2.1.1。

- 请仔细阅读 [v3.0.0 发布说明](../../release/release-v300/)。

   {{< notice warning >}}
在 v3.0.0 版本中，KubeSphere 重构了许多组件，例如 Fluent Bit Operator 和 IAM。如果您的这些组件有深度自定义配置（并非通过 KubeSphere 控制台配置），请务必先备份重要组件。
{{</ notice >}}

## 步骤 1：下载 YAML 文件

运行以下命令下载配置文件模板。

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

## 步骤 2：修改配置文件

将 v2.1.1 到 v3.0.0 的变更同步至 `cluster-configuration.yaml` 中的配置部分。存储类型和可插拔组件需要与 v2.1.1 保持一致。

## 步骤 3：应用 YAML 文件

运行以下命令升级 KubeSphere。

```bash
kubectl apply -f kubesphere-installer.yaml
```

```bash
kubectl apply -f cluster-configuration.yaml
```