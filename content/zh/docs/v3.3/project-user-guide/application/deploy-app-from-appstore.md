---
title: "从应用商店部署应用"
keywords: 'Kubernetes, Chart, Helm, KubeSphere, 应用, 应用商店'
description: '了解如何从应用商店中部署应用程序。'
linkTitle: "从应用商店部署应用"
weight: 10130
---

[应用商店](../../../application-store/)是平台上的公共应用仓库。平台上的每个租户，无论属于哪个企业空间，都可以查看应用商店中的应用。应用商店包含 16 个精选的企业就绪的容器化应用，以及平台上不同企业空间的租户发布的应用。任何经过身份验证的用户都可以从应用商店部署应用。这与私有应用仓库不同，访问私有应用仓库的租户必须属于私有应用仓库所在的企业空间。

本教程演示如何从基于 [OpenPitrix](https://github.com/openpitrix/openpitrix) 的 KubeSphere 应用商店快速部署 [NGINX](https://www.nginx.com/)，并通过 NodePort 访问其服务。

## 准备工作

- 您需要启用 [OpenPitrix (App Store)](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须被邀请至该项目，并具有 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店部署 NGINX

1. 以 `project-regular` 身份登录 KubeSphere Web 控制台，点击左上角的**应用商店**。

   {{< notice note >}}

   您也可以在您的项目中前往**应用负载**下的**应用**页面，点击**创建**，并选择**来自应用商店**进入应用商店。

   {{</ notice >}} 

2. 找到并点击 NGINX，在**应用信息**页面点击**安装**。请确保在**安装须知**对话框中点击**同意**。

3. 设置应用的名称和版本，确保 NGINX 部署的位置，点击**下一步**。

4. 在**应用设置**页面，设置应用部署的副本数，根据需要启用或禁用 Ingress，然后点击**安装**。

   {{< notice note >}}

   如需为 NGINX 设置更多的参数, 可点击 **YAML** 后的切换开关打开应用的 YAML 配置文件，并在配置文件中设置相关参数。 

   {{</ notice >}}

5. 等待应用创建完成并开始运行。

### 步骤 2：访问 NGINX

要从集群外访问 NGINX，您需要先用 NodePort 暴露该应用。

1. 在已创建的项目中打开**服务**页面并点击 NGINX 的服务名称。

2. 在服务详情页面，点击**更多操作**，在下拉菜单中选择**编辑外部访问**。

3. 将**访问方式**设置为 **NodePort** 并点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

4. 在**端口**区域查看暴露的端口。

5. 用 `<NodeIP>:<NodePort>` 地址访问 NGINX。

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 