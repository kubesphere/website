---
title: "上传应用至 KubeSphere 的 GitHub 仓库"
keywords: "Kubernetes, Helm, KubeSphere, 应用程序"
description: "上传您自己的应用至 KubeSphere 的 GitHub 仓库。"
linkTitle: "上传应用至 KubeSphere 的 GitHub 仓库"
weight: 9320
version: "v3.3"
---

KubeSphere 提供一个可供测试和开发的应用仓库，用户可以上传应用至该仓库，应用审核通过后即可作为应用模板使用。

## 上传应用

首先请根据 [Helm 文档](https://helm.sh/docs/topics/charts/)构建您的应用，您可以参考该 KubeSphere 应用仓库中的现有应用。官方应用存储在 [src/main](https://github.com/kubesphere/helm-charts/tree/master/src/main) 路径下，测试应用存储在 [src/test](https://github.com/kubesphere/helm-charts/tree/master/src/test) 路径下。

### 步骤 1：开发应用

1. [Fork KubeSphere 的应用仓库](https://github.com/kubesphere/helm-charts/fork)。

2. 根据 [Helm 文档安装](https://helm.sh/docs/intro/install/) Helm。

3. 执行以下命令初始化 Helm 客户端：

   ```bash
   helm init --client-only
   ```

4. 创建您的应用。例如，在 `src/test` 目录下创建名为 `mychart` 的应用。

   ```bash
   cd src/test
   helm create mychart
   cd mychart
   ```

5. 您会看到 Helm 在该目录中生成了相关的模板文件。有关更多信息，请参见[创建应用](../../../application-store/app-developer-guide/helm-developer-guide/#创建应用)。

### 步骤 2：提交应用

开发完成后，请向 [KubeSphere 官方仓库](https://github.com/kubesphere/helm-charts)提交 PR 以审核您的应用。

### 步骤 3：部署应用

PR 审核通过后，您的应用即可使用。有关更多信息，请参考[导入 Helm 仓库](../import-helm-repository/)将 `https://charts.kubesphere.io/main` 添加至 KubeSphere。

