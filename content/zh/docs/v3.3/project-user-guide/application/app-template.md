---
title: "应用模板"
keywords: 'Kubernetes, Chart, Helm, KubeSphere, 应用程序, 仓库, 模板'
description: '了解应用模板的概念以及它们如何在企业内部帮助部署应用程序。'
linkTitle: "应用模板"
weight: 10110
version: "v3.3"
---

应用模板是用户上传、交付和管理应用的一种方式。一般来说，根据一个应用的功能以及与外部环境通信的方式，它可以由一个或多个 Kubernetes 工作负载（例如[部署](../../../project-user-guide/application-workloads/deployments/)、[有状态副本集](../../../project-user-guide/application-workloads/statefulsets/)和[守护进程集](../../../project-user-guide/application-workloads/daemonsets/)）和[服务](../../../project-user-guide/application-workloads/services/)组成。作为应用模板上传的应用基于 [Helm](https://helm.sh/) 包构建。

## 应用模板的使用方式

您可以将 Helm Chart 交付至 KubeSphere 的公共仓库，或者导入私有应用仓库来提供应用模板。

KubeSphere 的公共仓库也称作应用商店，企业空间中的每位租户都能访问。[上传应用的 Helm Chart](../../../workspace-administration/upload-helm-based-application/) 后，您可以部署应用来测试它的功能，并提交审核。最终待应用审核通过后，您可以选择将它发布至应用商店。有关更多信息，请参见[应用程序生命周期管理](../../../application-store/app-lifecycle-management/)。

对于私有仓库，只有拥有必要权限的用户才能在企业空间中[添加私有仓库](../../../workspace-administration/app-repository/import-helm-repository/)。一般来说，私有仓库基于对象存储服务构建，例如 MinIO。这些私有仓库在导入 KubeSphere 后会充当应用程序池，提供应用模板。

{{< notice note >}}

对于 KubeSphere 中[作为 Helm Chart 上传的单个应用](../../../workspace-administration/upload-helm-based-application/)，待审核通过并发布后，会和内置应用一同显示在应用商店中。此外，当您从私有应用仓库中选择应用模板时，在下拉列表中也可以看到**当前企业空间**，其中存储了这些作为 Helm Chart 上传的单个应用。

{{</ notice >}} 

KubeSphere 基于 [OpenPitrix](https://github.com/openpitrix/openpitrix)（一个[可插拔组件](../../../pluggable-components/app-store/)）部署应用仓库服务。

## 为什么选用应用模板

应用模板使用户能够以可视化的方式部署并管理应用。对内，应用模板作为企业为团队内部协调和合作而创建的共享资源（例如，数据库、中间件和操作系统）发挥着重要作用。对外，应用模板设立了构建和交付的行业标准。在不同场景中，用户可以通过一键部署来利用应用模板满足他们的自身需求。

此外，KubeSphere 集成了 OpenPitrix 来提供应用程序全生命周期管理，平台上的 ISV、开发者和普通用户都可以参与到管理流程中。基于 KubeSphere 的多租户体系，每位租户只负责自己的部分，例如应用上传、应用审核、发布、测试以及版本管理。最终，企业可以通过自定义的标准来构建自己的应用商店并丰富应用程序池，同时也能以标准化的方式来交付应用。

有关如何使用应用模板的更多信息，请参见[使用应用模板部署应用](../../../project-user-guide/application/deploy-app-from-template/)。