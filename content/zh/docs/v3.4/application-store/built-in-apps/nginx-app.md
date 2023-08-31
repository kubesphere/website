---
title: "在 KubeSphere 中部署 NGINX"
keywords: 'KubeSphere, Kubernetes, 安装, NGINX'
description: '了解如何从 KubeSphere 应用商店中部署 NGINX 并访问服务。'
linkTitle: "在 KubeSphere 中部署 NGINX"
weight: 14270
---

[NGINX](https://www.nginx.com/) 是一个开源软件应用，用于 Web 服务、反向代理、缓存、负载均衡、流媒体等。

本教程演示如何从 KubeSphere 应用商店部署 NGINX。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 NGINX

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

2. 找到 NGINX，点击**应用信息**页面上的**安装**。

3. 设置名称并选择应用版本。请确保将 NGINX 部署在 `demo-project` 中，点击**下一步**。

4. 在**应用设置**页面，指定要为该应用部署的副本数量，根据需要启用应用路由 (Ingress)。操作完成后，点击**安装**。

   {{< notice note >}}

   要为 NGINX 指定更多值，请打开右上角的拨动开关，查看 YAML 格式的应用清单文件，编辑其配置。

   {{</ notice >}}

5. 稍等片刻待 NGINX 启动并运行。


### 步骤 2：访问 NGINX

要从集群外部访问 NGINX，您需要先通过 NodePort 暴露该应用。

1. 转到**服务**页面，点击 NGINX 的服务名称。

2. 在服务详情页面，点击**更多操作**，在下拉菜单中选择**编辑外部访问**。

3. **访问模式**选择 **NodePort**，然后点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

4. 在**端口**下，您可以查看已暴露的端口。

5. 通过 `<NodeIP>:<NodePort>` 访问 NGINX。

   ![访问 Nginx](/images/docs/v3.x/zh-cn/appstore/built-in-apps/nginx-app/access-nginx-12.PNG)

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 

6. 有关更多信息，请参见 [NGINX 官方文档](https://docs.nginx.com/?_ga=2.48327718.1445131049.1605510038-1186152749.1605510038)。
