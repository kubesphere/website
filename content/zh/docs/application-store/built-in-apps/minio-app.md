---
title: "在 KubeSphere 中部署 MinIO"
keywords: 'Kubernetes, KubeSphere, Minio, 应用商店'
description: '了解如何从 KubeSphere 应用商店中部署 Minio 并访问服务。'
linkTitle: "在 KubeSphere 中部署 MinIO"
weight: 14240
---
[MinIO](https://min.io/) 对象存储为高性能和 S3 API 而设计。对于具有严格安全要求的大型私有云环境来说，MinIO 是理想选择，它可以为多种工作负载提供任务关键型可用性。

本教程演示如何从 KubeSphere 应用商店部署 MinIO。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 MinIO

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

   ![Minio 应用](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/minio-app-1.PNG)

2. 找到 MinIO，点击**应用信息**页面上的**部署**。

   ![应用商店中的 Minio](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/minio-in-app-store-2.PNG)

   ![deploy-minio](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/deploy-minio-3.PNG)

3. 设置名称并选择应用版本。请确保将 MinIO 部署在 `demo-project` 中，点击**下一步**。

   ![部署 Minio](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/minio-deploy-4.PNG)

4. 在**应用配置**页面，您可以使用默认配置或者直接编辑 YAML 文件来自定义配置。点击**部署**继续。

   ![部署 Minio 2](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/deploy-minio-5.PNG)

5. 稍等片刻待 MinIO 启动并运行。

   ![列表中的 Minio](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/minio-in-list-6.PNG)

### 步骤 2：访问 MinIO Browser

要从集群外部访问 MinIO，您需要先通过 NodePort 暴露该应用。

1. 在**服务**页面点击 MinIO 的服务名称。

   ![Minio 详情](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/minio-detail-7.PNG)

2. 点击**更多操作**，在下拉菜单中选择**编辑外网访问**。

   ![编辑外网访问](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/edit-internet-access-8.PNG)

3. 在**访问方式**的下拉列表中选择 **NodePort**，然后点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

   ![nodeport](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/nodeport-9.PNG)

4. 您可以在**服务端口**中查看已暴露的端口。

   ![已暴露的端口](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/port-exposed-10.PNG)

5. 要访问 MinIO Browser，您需要 `accessKey` 和 `secretKey`，都在 MinIO 配置文件中指定。在**应用**的**应用模板**选项卡中，点击 MinIO，随后可以在**配置文件**选项卡下查找这两个字段的值。

   ![模板列表](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/template-list-11.PNG)

   ![配置文件](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/config-file-12.PNG)

6. 通过 `<NodeIP>:<NodePort>` 使用 `accessKey` 和 `secretKey` 访问 MinIO Browser。

   ![Minio Browser](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/minio-browser-13.PNG)

   ![Minio Browser 界面](/images/docs/zh-cn/appstore/built-in-apps/deploy-minio-on-ks/minio-browser-interface-14.PNG)

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 

7. 有关 MinIO 的更多信息，请参见 [MinIO 官方文档](https://docs.min.io/)。