---
title: "在 KubeSphere 中部署 RabbitMQ"
keywords: 'KubeSphere, RabbitMQ, Kubernetes, 安装'
description: '如何通过应用商店在 KubeSphere 中部署 RabbitMQ'

link title: "在 KubeSphere 中部署 RabbitMQ"
weight: 14290
---
[RabbitMQ](https://www.rabbitmq.com/) 是部署最广泛的开源消息代理。它轻量且易于在本地和云上部署，支持多种消息协议。RabbitMQ 可在分布和联邦的配置中部署，以满足大规模和高可用性需求。

本教程演示如何从 KubeSphere 的应用商店部署 RabbitMQ。

## 准备工作

- 您需要[启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户。该帐户必须是已邀请至项目的平台普通用户，并且在项目中的角色为 `operator`。在本教程中，您需要以 `project-regular` 用户登录，并在 `demo-workspace` 企业空间的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店部署 RabbitMQ

1. 在 `demo-project` 的**概览**页面，点击左上角的**应用商店**。

   ![rabbitmq01](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq01.jpg)

2. 找到 RabbitMQ，在**应用信息**页面点击**部署**。

   ![find-rabbitmq](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq02.jpg)

   ![click-deploy](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq021.jpg)

3. 设置应用名称和版本，确保 RabbitMQ 部署在 `demo-project` 项目中，然后点击**下一步**。

   ![rabbitmq03](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq03.jpg)

4. 在**应用配置**页面，您可以直接使用默认配置，也可以通过修改表单参数或编辑 YAML 文件自定义配置。您需要记录 **Root Username** 和 **Root Password** 的值，用于在后续步骤中登录系统。设置完成后点击**部署**。

   ![rabbitMQ11](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitMQ11.jpg)

   ![rabbitMQ04](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitMQ04.jpg)

   {{< notice tip >}}

   如需查看清单文件，请点击 **YAML** 开关。

   {{</ notice >}}

5. 等待 RabbitMQ 创建完成并开始运行。

   ![check-if-rabbitmq-is-running](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq05.jpg)

### 步骤 2：访问 RabbitMQ 主页

要从集群外访问 RabbitMQ，您需要先用 NodePort 暴露该应用。

1. 打开**服务**页面并点击 RabbitMQ 的服务名称。

   ![go-to-services](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq06.jpg)

2. 点击**更多操作**，在下拉菜单中选择**编辑外网访问**。

   ![rabbitmq07](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq07.jpg)

3. 将**访问方式**设置为 **NodePort** 并点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

   ![rabbitmq08](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq08.jpg)

4. 您可以在**服务端口**区域查看暴露的端口。

   ![rabbitmq09](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq09.jpg)

5. 用 `{$NodeIP}:{$Nodeport}` 地址以及步骤 1 中记录的用户名和密码访问 RabbitMQ 的 **management** 端口。
   ![rabbitmq-dashboard](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitmq-dashboard.jpg)

   ![rabbitma-dashboard-detail](/images/docs/zh-cn/appstore/built-in-apps/rabbitmq-app/rabbitma-dashboard-detail.jpg)

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 

6. 有关 RabbitMQ 的更多信息，请参考[ RabbitMQ 官方文档](https://www.rabbitmq.com/documentation.html)。

