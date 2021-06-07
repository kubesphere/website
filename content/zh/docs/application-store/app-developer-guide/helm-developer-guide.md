---
title: "Helm 开发者指南"
keywords: 'Kubernetes, KubeSphere, Helm, 开发'
description: '开发基于 Helm 的应用。'
linkTitle: "Helm 开发者指南"
weight: 14410
---

您可以上传应用的 Helm Chart 至 KubeSphere，以便具有必要权限的租户能够进行部署。本教程以 NGINX 为示例演示如何准备 Helm Chart。

## 安装 Helm

如果您已经安装 KubeSphere，那么您的环境中已部署 Helm。如果未安装，请先参考 [Helm 文档](https://helm.sh/docs/intro/install/)安装 Helm。

## 创建本地仓库

执行以下命令在您的机器上创建仓库。

```bash
mkdir helm-repo
```

```bash
cd helm-repo
```

## 创建应用

使用 `helm create` 创建一个名为 `nginx` 的文件夹，它会自动为您的应用创建 YAML 模板和目录。一般情况下，不建议修改顶层目录中的文件名和目录名。

```bash
$ helm create nginx
$ tree nginx/
nginx/
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── ingress.yaml
│   ├── NOTES.txt
│   └── service.yaml
└── values.yaml
```

`Chart.yaml` 用于定义 Chart 的基本信息，包括名称、API 和应用版本。有关更多信息，请参见 [Chart.yaml 文件](../helm-specification/#chartyaml-文件)。

该 `Chart.yaml` 文件的示例：

```yaml
apiVersion: v1
appVersion: "1.0"
description: A Helm chart for Kubernetes
name: nginx
version: 0.1.0
```

当您向 Kubernetes 部署基于 Helm 的应用时，可以直接在 KubeSphere 控制台上编辑 `values.yaml` 文件。

该 `values.yaml` 文件的示例：

```yaml
# 默认值仅供测试使用。
# 此文件为 YAML 格式。
# 对要传入您的模板的变量进行声明。

replicaCount: 1

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

nameOverride: ""
fullnameOverride: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  path: /
  hosts:
    - chart-example.local
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # 通常不建议对默认资源进行指定，用户可以去主动选择是否指定。
  # 这也有助于 Chart 在资源较少的环境上运行，例如 Minikube。
  # 如果您要指定资源，请将下面几行内容取消注释，
  # 按需调整，并删除 'resources:' 后面的大括号。
  # limits:
  #  cpu: 100m
  #  memory: 128Mi
  # requests:
  #  cpu: 100m
  #  memory: 128Mi

nodeSelector: {}

tolerations: []

affinity: {}
```

请参考 [Helm 规范](../helm-specification/)对 `nginx` 文件夹中的文件进行编辑，完成编辑后进行保存。

## 创建索引文件（可选）

要在 KubeSphere 中使用 HTTP 或 HTTPS URL 添加仓库，您需要事先向对象存储上传一个 `index.yaml` 文件。在 `nginx` 的上一个目录中使用 Helm 执行以下命令，创建索引文件。

```bash
helm repo index .
```

```bash
$ ls
index.yaml  nginx
```

{{< notice note >}}

- 如果仓库 URL 是 S3 格式，您向仓库添加应用时会自动在对象存储中创建索引文件。

- 有关何如向 KubeSphere 添加仓库的更多信息，请参见[导入 Helm 仓库](../../../workspace-administration/app-repository/import-helm-repository/)。

{{</ notice >}}

## 打包 Chart

前往 `nginx` 的上一个目录，执行以下命令打包您的 Chart，这会创建一个 .tgz 包。

```bash
helm package nginx
```

```bash
$ ls
nginx  nginx-0.1.0.tgz
```

## 上传您的应用

现在您已经准备好了基于 Helm 的应用，您可以将它上传至 KubeSphere 并在平台上进行测试。

## 另请参见

[Helm 规范](../helm-specification/)

[导入 Helm 仓库](../../../workspace-administration/app-repository/import-helm-repository/)

