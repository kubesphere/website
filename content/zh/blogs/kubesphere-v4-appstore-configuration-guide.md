---
title: 'KubeSphere v4 应用商店配置指南'
tag: 'KubeSphere, Kubernetes, KubeSphere v4, KubeSphere LuBan'
createTime: '2024-11-01'
author: 'inksnw'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-appstore-configuration-guide-cover.png'
---

在 KubeSphere v4 版本中，为保持平台的简洁性，系统默认移除了内置应用商店中的应用。用户可以按照下列步骤进行手动配置和添加。

> 注意：应用商店和扩展市场有所不同，扩展市场的使用方法将在后续文档中详细介绍。
>
> - **Helm Repo 源**：安装时需要从源下载 Chart 包，需要保证源是可用状态，平台会定时从源同步最新的应用信息
> - **应用商店**：应用被存储在平台中，默认不会自动更新，可在审核后全局可见
> - **商店导入工具**：用于将 Helm Repo 源中的应用转为应用商店应用

## 企业空间中的 Helm Repo 源配置

### 添加源

在企业空间中添加的源仅对当前空间可见。

- 进入企业空间，选择左侧边栏中的应用仓库。
- 添加一个 Helm Repo 源。

KubeSphere v3.x 默认提供的 Helm Repo 源为： https://charts.kubesphere.io/stable

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-1.png)

### 使用源

- 进入项目，选择应用负载 > 应用。
- 点击创建 > 从应用模板，选择对应的应用源。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-2.png)

## 仅在企业空间的应用管理

### 安装应用商店扩展

在 KubeSphere v4 中需要安装应用商店扩展，才能在企业空间上传应用 Chart 包，上传的 Chart 应用默认只在当前企业空间可见，如需全局可见，请参考后续的全局应用配置。

- 进入企业空间，选择左侧边栏中的应用模板。
- 选择上传 Helm Chart以添加应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-3.png)

### 使用上传应用

- 进入项目，选择应用负载 > 应用。
- 点击创建 > 从应用模板，选择当前企业空间的应用源。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-4.png)

## 全局应用商店的应用

### 提交审核

在企业空间上传 Chart 后，可以将应用提交审核，通过审核后，该应用将在全局应用商店中可见，所有用户均可访问。

- 上传 Chart 后，进入应用详情页。
- 点击提交审核按钮。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-5.png)

### 通过审核

通过审核。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-6.png)

### 上架

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-7.png)

此时，所有企业空间的用户都能在应用商店页看到这个应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-8.png)

## 全局的 Repo 源

可以在应用商店管理配置的 Repo 源，所有用户在项目内创建应用时，都可以选择到。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-9.png)

在项目中创建应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/20241101-10.png)

## 问题说明

上传 Helm Chart 时如果提示超出限制，需要您删除一下 Chart 包中的无用文件减小体积。

目前支持上传的文件体积，不能超过 1M，且不能调整。

当开启了 S3 外置存储时, 可不限制大小： https://github.com/kubesphere/kubesphere/blob/6a2f78ef0f3c8e0497095da831415f4e672dc14a/config/ks-core/values.yaml#L38

但目前前端还有限制, 预计在 KubeSphere 4.1.3 版本会移除前端的这个限制。

## 商店导入工具

如果想把 Helm Repo 中的应用变成商店中的应用，可以使用[商店导入工具](https://github.com/kubesphere-extensions/app-tool)来操作。

### 概述

本工具用于把 Helm Repo 中的软件同步到应用商店中。

这个工具是把 Repo 中的应用变成全局商店应用, 不是必须的操作。

### 前提条件

- 可访问的 Kubernetes 集群，并配置好 `~/.kube/config` 文件
- 安装应用商店管理扩展

### 使用方法

#### 命令行参数

- `--server`：KubeSphere 的服务器 URL（必填）
- `--token`：平台的访问令牌（必填）
- `--repo`：Helm Repo的 URL（必填）

#### 使用示例

```
# 创建service account
kubectl apply -f token.yaml
# 获取token
token=$(kubectl get secrets $(kubectl get serviceaccounts.kubesphere.io app-tool -n default -o "jsonpath={.secrets[].name}") -n default -o jsonpath={.data.token} | base64 -d)
# 执行
go run main.go --server=http://192.168.50.87:30880 --token=${token}  --repo=https://charts.kubesphere.io/stable
# 删除service account
kubectl delete -f token.yaml
```

### 注意事项

#### 多次执行的场景

由于商店允许多次上传并生成随机名称的应用，本工具不会处理多次执行的场景。如果您多次执行，希望清理生成的资源，请手动执行：

`kubectl delete applications.application.kubesphere.io xxx`
