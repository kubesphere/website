---
title: "在 KubeSphere 中部署 Tomcat"
keywords: 'KubeSphere, Kubernetes, 安装, Tomcat'
description: '如何通过应用商店在 KubeSphere 中部署 Tomcat'

link title: "在 KubeSphere 中部署 Tomcat"
weight: 14292
---
[Apache Tomcat](https://tomcat.apache.org/index.html) 支撑着诸多行业和组织中的众多大规模任务关键型 Web 应用。它提供了一个纯 Java HTTP Web 服务器环境，可用于执行 Java 代码。

本教程演示如何从 KubeSphere 的应用商店部署 Tomcat。

## 准备工作

- 您需要[启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`)。该帐户必须是已邀请至项目的平台普通用户，并且在项目中的角色为 `operator`。在本教程中，您需要以 `project-regular` 用户登录，并在 `demo-workspace` 企业空间的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店部署 Tomcat

1. 在 `demo-project` 的**概览**页面，点击左上角的**应用商店**。

   ![go-to-app-store](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/tomcat-app01.jpg)

2. 找到 Tomcat，在**应用信息**页面点击**部署**。

   ![find-tomcat](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/find-tomcat.jpg)

   ![click-deploy](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/click-deploy.jpg)

3. 设置应用名称和版本，确保 Tomcat 部署在 `demo-project` 项目中，然后点击**下一步**。

   ![click-next](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/click-next.jpg)

4. 在**应用配置**页面，您可以直接使用默认配置，也可以通过编辑 YAML 文件自定义配置。设置完成后点击**部署**。

   ![deploy-tomcat](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/deploy-tomcat.jpg)

5. 等待 Tomcat 创建完成并开始运行。

   ![tomcat-running](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/tomcat-running.jpg)

### 步骤 2：访问 Tomcat 终端

1. 打开**服务**页面并点击 Tomcat 的服务名称。

   ![click-tomcat-service](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/click-tomcat-service.jpg)

2. 在**容器组**区域，展开容器详情，点击终端图标。

   ![tomcat-teminal-icon](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/tomcat-teminal-icon.jpg)

3. 在 `/usr/local/tomcat/webapps` 目录下查看部署的项目。

   ![view-project](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/view-project.jpg)

### 步骤 3：用浏览器访问 Tomcat 项目

要从集群外访问 Tomcat 项目，您需要先用 NodePort 暴露该应用。

1. 打开**服务**页面并点击 Tomcat 的服务名称。

   ![click-tomcat-service](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/click-tomcat-service.jpg)

2. 点击**更多操作**，在下拉菜单中选择**编辑外网访问**。

   ![edit-internet-access](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/edit-internet-access.jpg)

3. 将**访问方式**设置为 **NodePort** 并点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

   ![nodeport](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/nodeport.jpg)

4. 您可以在**服务端口**区域查看暴露的端口。

   ![exposed-port](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/exposed-port.jpg)

5. 在浏览器中用 `{$NodeIP}:{$Nodeport}/sample` 地址访问 Tomcat 示例项目。

   ![access-tomcat-browser](/images/docs/zh-cn/appstore/built-in-apps/tomcat-app/access-tomcat-browser.jpg)

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 

6. 有关 Tomcat 的更多信息，请参考[ Tomcat 官方文档](https://tomcat.apache.org/index.html)。

