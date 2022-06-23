---
title: "导入 Helm 仓库"
keywords: "Kubernetes, Helm, KubeSphere, 应用程序"
description: "导入 Helm 仓库至 KubeSphere，为企业空间中的租户提供应用模板。"

linkTitle: "导入 Helm 仓库"
weight: 9310
---

KubeSphere 构建的应用仓库可以让用户使用基于 Helm Chart 的 Kubernetes 应用程序。KubeSphere 基于[OpenPitrix](https://github.com/openpitrix/openpitrix) 提供应用仓库服务，OpenPitrix 是由青云QingCloud 发起的开源跨云应用程序管理平台，支持基于 Helm Chart 类型的 Kubernetes 应用程序。在应用仓库中，每个应用程序都是基础软件包存储库。您需要事先创建应用仓库，才能从中部署和管理应用。

为了创建仓库，您可以使用 HTTP 或 HTTPS 服务器或者对象存储解决方案来存储文件包。具体地说，应用仓库依靠独立于 OpenPitrix 的外部存储，例如 [MinIO](https://min.io/) 对象存储、[QingStor 对象存储](https://github.com/qingstor)以及 [AWS 对象存储](https://aws.amazon.com/cn/what-is-cloud-object-storage/)。这些对象存储服务用于存储开发者创建的配置包和索引文件。注册仓库后，配置包就会自动被索引为可部署的应用程序。

本教程演示了如何向 KubeSphere 中添加应用仓库。

## 准备工作

- 您需要启用 [KubeSphere 应用商店 (OpenPitrix)](../../../pluggable-components/app-store/)。
- 您需要准备一个应用仓库。请参考 [Helm 官方文档](https://v2.helm.sh/docs/developing_charts/#the-chart-repository-guide)创建仓库，或者[上传自己的应用至 KubeSphere 公共仓库](../../../workspace-administration/app-repository/upload-app-to-public-repository/)。此外，也可以使用下方步骤中的示例仓库，这里仅用作演示。
- 您需要创建一个企业空间和一个用户 (`ws-admin`)。该用户必须在企业空间中被授予 `workspace-admin` 角色。有关更多信息，请参考[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 添加应用仓库

1. 以 `ws-admin` 身份登录 KubeSphere Web 控制台。在企业空间页面，转到**应用管理**下的**应用仓库**，然后点击**添加**。

2. 在弹出的对话框中，输入应用仓库名称并添加仓库 URL。例如，输入 `https://charts.kubesphere.io/main`。

    - **名称**：为仓库设置一个简洁明了的名称，方便用户识别。
    - **URL**：遵循 RFC 3986 规范并支持以下三种协议：
      
      - S3：S3 格式的 URL，例如 `s3.<region>.amazonaws.com`，用于访问使用 S3 接口的 Amazon S3 服务。如果您选择此类型，则需要提供 Access Key ID 和 Secret Access Key。
      
      - HTTP：例如 `http://docs-repo.gd2.qingstor.com`。示例中包含一个样例应用 NGINX，创建仓库后会自动导入。您可以用应用模板来部署它。
      
      - HTTPS：例如 `https://docs-repo.gd2.qingstor.com`。
      
        {{< notice note >}}

如果您想要对 HTTP/HTTPS 进行基本访问验证，可以使用类似此格式的 URL：`http://username:password@docs-repo.gd2.qingstor.com`。
        {{</ notice >}}

    - **同步间隔**：同步远端应用仓库的周期。
    - **描述**：简单介绍应用仓库的主要特性。

3. 输入必需的字段后，点击**验证**以验证 URL。如果 URL 可用，您会在它旁边看到一个绿色的对号，点击**确定**完成操作。
    
    {{< notice note >}}

- 在本地私有云环境中，您可以基于 [ChartMuseum](https://chartmuseum.com/) 构建自己的仓库。然后，您可以开发和上传应用程序至该仓库，再根据您的需求将这些应用程序部署至 KubeSphere。
- 如果您需要设置 HTTP 基本访问验证，请参考[此文件](https://github.com/helm/chartmuseum#basic-auth)。

{{</ notice >}} 

4. 导入完成后，仓库会列在下方的仓库列表中，并且 KubeSphere 会自动加载该仓库中的所有应用，并添加为应用模板。当用户使用应用模板来部署应用时，可以在该仓库中查看这些应用。有关更多信息，请参见[用应用模板部署应用](../../../project-user-guide/application/deploy-app-from-template/)。