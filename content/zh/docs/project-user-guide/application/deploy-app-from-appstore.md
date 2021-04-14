---
title: "从应用商店部署应用"
keywords: 'Kubernetes, chart, helm, KubeSphere, application, App Store'
description: '了解如何从应用商店中部署应用程序。'
linkTitle: "从应用商店部署应用"
weight: 10130
---

[应用商店](../../../application-store/)是平台上的公共应用仓库。平台上的每个租户，无论属于哪个企业空间，都可以查看应用商店中的应用。应用商店包含 15 个精选的企业就绪的容器化应用，以及平台上不同企业空间的租户发布的应用。任何经过身份验证的用户都可以从应用商店部署应用。这与私有应用仓库不同，访问私有应用仓库的租户必须属于私有应用仓库所在的企业空间。

本教程演示如何从基于 [OpenPitrix](https://github.com/openpitrix/openpitrix) 的 KubeSphere 应用商店快速部署 [NGINX](https://www.nginx.com/)，并通过 NodePort 访问其服务。

## 准备工作

- 您需要启用 [OpenPitrix (App Store)](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户（例如 `project-regular`）。该帐户必须是已邀请至该项目的平台普通用户，并具有 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店部署 NGINX

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

   ![app-store](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/app-store.jpg)

   {{< notice note >}}

   您也可以打开**应用负载**下的**应用**页面，点击**部署新应用**，并选择**来自应用商店**进入应用商店。

   {{</ notice >}} 

2. 找到 NGINX，在**应用信息**页面点击**部署**。

   ![nginx-in-app-store](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/nginx-in-app-store.jpg)

   ![deploy-nginx](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/deploy-nginx.jpg)

3. 设置应用的名称和版本，确保 NGINX 部署在 `demo-project` 项目中，点击**下一步**。

   ![confirm-deployment](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/confirm-deployment.jpg)

4. 在**应用配置**页面，设置应用部署的副本数，根据需要启用或禁用 Ingress，然后点击**部署**。

   ![edit-config-nginx](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/edit-config-nginx.jpg)

   ![manifest-file](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/manifest-file.jpg)

   {{< notice note >}}

   如需为 NGINX 设置更多的参数, 可点击 **YAML** 后的切换开关打开应用的 YAML 配置文件，并在配置文件中设置相关参数。 

   {{</ notice >}}

5. 等待应用创建完成并开始运行。

   ![nginx-running](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/nginx-running.jpg)

### 步骤 2：访问 NGINX

要从集群外访问 NGINX，您需要先用 NodePort 暴露该应用。

1. 打开**服务**页面并点击 NGINX 的服务名称。

   ![nginx-service](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/nginx-service.jpg)

2. 在服务详情页面，点击**更多操作**，在下拉菜单中选择**编辑外网访问**。

   ![edit-internet-access](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/edit-internet-access.jpg)

3. 将**访问方式**设置为 **NodePort** 并点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

   ![nodeport](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/nodeport.jpg)

4. 您可以在**服务端口**区域查看暴露的端口。

   ![exposed-port](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/exposed-port.jpg)

5. 用 `{$NodeIP}:{$Nodeport}` 地址访问 NGINX。

   ![access-nginx](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-store/access-nginx.jpg)

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 